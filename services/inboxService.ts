import { supabase } from '../lib/supabase';

export type InboxMessageType = 'career' | 'newsletter';
export type InboxMessageStatus = 'unread' | 'read' | 'shortlisted' | 'archived';

export interface ResumeAttachmentInfo {
  filename: string;
  size: number;
  formattedSize: string;
  mimetype?: string;
  url: string;
  uploadedAt?: string;
}

export interface InboxMessage {
  id: string;
  type: InboxMessageType;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  // Career fields
  position?: string;
  employmentType?: string;
  preferredBranch?: string;
  earliestStartDate?: string;
  coverLetter?: string;
  resume?: ResumeAttachmentInfo | null;
  // Newsletter fields
  source?: string;
  // Mailbox state
  isRead: boolean;
  isStarred: boolean;
  status: InboxMessageStatus;
  createdAt: string;
  updatedAt?: string;
}

export const INBOX_DB_ID = '00000000-0000-0000-0000-000000000008';
export const INBOX_DB_PREFIX = 'INBOX_MESSAGES:';
export const INBOX_STORAGE_KEY = 'meadow_inbox_messages_cache';
export const INBOX_UPDATED_EVENT = 'meadow_inbox_updated';

function notifyInboxUpdated(messages: InboxMessage[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(messages));
      window.dispatchEvent(new CustomEvent(INBOX_UPDATED_EVENT, { detail: messages }));
    } catch {}
  }
}

export function getCachedInboxMessages(): InboxMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/**
 * Fetch all inbox messages from the backend API and Supabase database.
 */
export async function fetchInboxMessages(): Promise<InboxMessage[]> {
  const mergedMap = new Map<string, InboxMessage>();

  // 1. Fetch from server API (/api/inbox)
  try {
    const res = await fetch('/api/inbox');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        for (const item of json.data) {
          if (item && item.id) mergedMap.set(item.id, item);
        }
      }
    }
  } catch (err) {
    console.warn('[InboxService] API fetch warning:', err);
  }

  // 2. Also query Supabase database directly for authoritative sync
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('id', INBOX_DB_ID)
      .maybeSingle();

    if (!error && data && typeof data.name === 'string' && data.name.startsWith(INBOX_DB_PREFIX)) {
      const parsed = JSON.parse(data.name.substring(INBOX_DB_PREFIX.length));
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item && item.id && !mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[InboxService] Supabase fetch warning:', err);
  }

  const finalMessages = Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  notifyInboxUpdated(finalMessages);
  return finalMessages;
}

/**
 * Submit a Newsletter subscription and persist it to the database.
 */
export async function submitNewsletterSubscription(email: string, source = 'Website Footer'): Promise<{ success: boolean; data?: InboxMessage; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    const res = await fetch('/api/inbox/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, source }),
    });

    if (res.ok) {
      const json = await res.json();
      await fetchInboxMessages();
      return { success: true, data: json.data };
    }
  } catch (err) {
    console.warn('[InboxService] API newsletter submit fallback:', err);
  }

  // Fallback direct Supabase persistence
  const newRecord: InboxMessage = {
    id: crypto.randomUUID ? crypto.randomUUID() : `nl-${Date.now()}`,
    type: 'newsletter',
    fullName: cleanEmail.split('@')[0],
    email: cleanEmail,
    subject: 'Newsletter Subscription',
    source,
    isRead: false,
    isStarred: false,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  const current = await fetchInboxMessages();
  const updated = [newRecord, ...current];
  await persistInboxToSupabase(updated);
  return { success: true, data: newRecord };
}

/**
 * Submit a Career application with resume attachment and persist it to the database.
 */
export async function submitCareerApplication(payload: {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  employmentType: string;
  preferredBranch: string;
  earliestStartDate?: string;
  coverLetter?: string;
  resume: ResumeAttachmentInfo;
}): Promise<{ success: boolean; data?: InboxMessage; error?: string }> {
  try {
    const res = await fetch('/api/inbox/career', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      await fetchInboxMessages();
      return { success: true, data: json.data };
    }
  } catch (err) {
    console.warn('[InboxService] API career submit fallback:', err);
  }

  const newRecord: InboxMessage = {
    id: crypto.randomUUID ? crypto.randomUUID() : `cr-${Date.now()}`,
    type: 'career',
    fullName: payload.fullName.trim(),
    email: payload.email.trim(),
    phone: payload.phone,
    position: payload.position,
    employmentType: payload.employmentType,
    preferredBranch: payload.preferredBranch,
    earliestStartDate: payload.earliestStartDate || '',
    coverLetter: payload.coverLetter || '',
    resume: payload.resume,
    subject: `Job Application: ${payload.position}`,
    isRead: false,
    isStarred: false,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  const current = await fetchInboxMessages();
  const updated = [newRecord, ...current];
  await persistInboxToSupabase(updated);
  return { success: true, data: newRecord };
}

async function persistInboxToSupabase(messages: InboxMessage[]): Promise<void> {
  notifyInboxUpdated(messages);
  try {
    await supabase.from('units').upsert(
      {
        id: INBOX_DB_ID,
        name: INBOX_DB_PREFIX + JSON.stringify(messages),
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.warn('[InboxService] Supabase upsert warning:', err);
  }
}

/**
 * Update a single inbox message (read status, starred, application status).
 */
export async function updateInboxMessage(id: string, updates: Partial<InboxMessage>): Promise<InboxMessage[]> {
  try {
    await fetch(`/api/inbox/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch {}

  const current = getCachedInboxMessages();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
  );
  await persistInboxToSupabase(updated);
  return updated;
}

/**
 * Delete a single inbox message from the database.
 */
export async function deleteInboxMessage(id: string): Promise<InboxMessage[]> {
  try {
    await fetch(`/api/inbox/${id}`, { method: 'DELETE' });
  } catch {}

  const current = getCachedInboxMessages();
  const updated = current.filter((item) => item.id !== id);
  await persistInboxToSupabase(updated);
  return updated;
}

/**
 * Batch update or delete inbox messages.
 */
export async function batchInboxMessages(
  ids: string[],
  action: 'mark_read' | 'mark_unread' | 'delete'
): Promise<InboxMessage[]> {
  try {
    await fetch('/api/inbox/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, action }),
    });
  } catch {}

  const idSet = new Set(ids);
  const current = getCachedInboxMessages();
  let updated: InboxMessage[] = [];

  if (action === 'delete') {
    updated = current.filter((item) => !idSet.has(item.id));
  } else if (action === 'mark_read') {
    updated = current.map((item) =>
      idSet.has(item.id)
        ? { ...item, isRead: true, status: item.status === 'unread' ? 'read' : item.status }
        : item
    );
  } else if (action === 'mark_unread') {
    updated = current.map((item) =>
      idSet.has(item.id) ? { ...item, isRead: false, status: 'unread' } : item
    );
  }

  await persistInboxToSupabase(updated);
  return updated;
}
