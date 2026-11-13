import React, { useState, useEffect, useMemo } from 'react';
import {
  Inbox as InboxIcon,
  Mail,
  Briefcase,
  Search,
  Trash2,
  Star,
  CheckCircle2,
  Paperclip,
  Download,
  ExternalLink,
  RefreshCw,
  FileText,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Copy,
  Check,
  MailOpen,
  User,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import {
  InboxMessage,
  InboxMessageStatus,
  fetchInboxMessages,
  getCachedInboxMessages,
  updateInboxMessage,
  deleteInboxMessage,
  batchInboxMessages
} from '../../services/inboxService';

type FolderTab = 'all' | 'career' | 'newsletter' | 'unread' | 'starred';

const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>(() => getCachedInboxMessages());
  const [loading, setLoading] = useState<boolean>(messages.length === 0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<FolderTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<InboxMessage | null>(null);

  const loadInbox = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else if (messages.length === 0) {
      setLoading(true);
    }
    try {
      const data = await fetchInboxMessages();
      setMessages(data);
      if (!selectedId && data.length > 0) {
        setSelectedId(data[0].id);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  // Counts for tabs and stats
  const counts = useMemo(() => {
    return {
      all: messages.length,
      career: messages.filter((m) => m.type === 'career').length,
      newsletter: messages.filter((m) => m.type === 'newsletter').length,
      unread: messages.filter((m) => !m.isRead).length,
      starred: messages.filter((m) => m.isStarred).length,
    };
  }, [messages]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (activeTab === 'career' && m.type !== 'career') return false;
      if (activeTab === 'newsletter' && m.type !== 'newsletter') return false;
      if (activeTab === 'unread' && m.isRead) return false;
      if (activeTab === 'starred' && !m.isStarred) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (m.fullName || '').toLowerCase().includes(q);
        const matchEmail = (m.email || '').toLowerCase().includes(q);
        const matchPhone = (m.phone || '').toLowerCase().includes(q);
        const matchPos = (m.position || '').toLowerCase().includes(q);
        const matchBranch = (m.preferredBranch || '').toLowerCase().includes(q);
        const matchFile = (m.resume?.filename || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone || matchPos || matchBranch || matchFile;
      }

      return true;
    });
  }, [messages, activeTab, searchQuery]);

  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedId) || null,
    [messages, selectedId]
  );

  const handleSelectMessage = async (msg: InboxMessage) => {
    setSelectedId(msg.id);
    if (!msg.isRead) {
      const updated = await updateInboxMessage(msg.id, {
        isRead: true,
        status: msg.status === 'unread' ? 'read' : msg.status,
      });
      setMessages(updated);
    }
  };

  const handleToggleStar = async (e: React.MouseEvent, msg: InboxMessage) => {
    e.stopPropagation();
    const nextStarred = !msg.isStarred;
    const updated = await updateInboxMessage(msg.id, {
      isStarred: nextStarred,
      status: nextStarred ? 'shortlisted' : msg.isRead ? 'read' : 'unread',
    });
    setMessages(updated);
  };

  const handleToggleRead = async (msg: InboxMessage) => {
    const nextRead = !msg.isRead;
    const updated = await updateInboxMessage(msg.id, {
      isRead: nextRead,
      status: nextRead ? 'read' : 'unread',
    });
    setMessages(updated);
  };

  const handleStatusChange = async (msg: InboxMessage, newStatus: InboxMessageStatus) => {
    const updated = await updateInboxMessage(msg.id, {
      status: newStatus,
      isRead: newStatus !== 'unread',
      isStarred: newStatus === 'shortlisted' ? true : msg.isStarred,
    });
    setMessages(updated);
  };

  const handleDeleteSingle = async (msg: InboxMessage) => {
    const updated = await deleteInboxMessage(msg.id);
    setMessages(updated);
    setDeleteConfirmItem(null);
    if (selectedId === msg.id) {
      const remaining = updated.filter((m) => m.id !== msg.id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleBatchAction = async (action: 'mark_read' | 'mark_unread' | 'delete') => {
    if (checkedIds.length === 0) return;
    const updated = await batchInboxMessages(checkedIds, action);
    setMessages(updated);
    if (action === 'delete' && selectedId && checkedIds.includes(selectedId)) {
      setSelectedId(updated.length > 0 ? updated[0].id : null);
    }
    setCheckedIds([]);
  };

  const toggleCheckOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleCheckAll = () => {
    const visibleIds = filteredMessages.map((m) => m.id);
    const allChecked = visibleIds.length > 0 && visibleIds.every((id) => checkedIds.includes(id));
    if (allChecked) {
      setCheckedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setCheckedIds(Array.from(new Set([...checkedIds, ...visibleIds])));
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleExportNewsletterCSV = () => {
    const subscribers = messages.filter((m) => m.type === 'newsletter');
    if (subscribers.length === 0) return;

    const rows = [
      ['Email', 'Subscribed At', 'Source'],
      ...subscribers.map((s) => [
        `"${s.email}"`,
        `"${new Date(s.createdAt).toLocaleString()}"`,
        `"${s.source || 'Footer'}"`,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meadow_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (iso: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inbox & Mailbox
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Receive and manage career resume applications and newsletter subscriptions saved in the database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {counts.newsletter > 0 && (
            <button
              type="button"
              onClick={handleExportNewsletterCSV}
              className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Download size={14} />
              <span>Export Subscribers CSV</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => loadInbox(true)}
            disabled={refreshing}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Messages</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{counts.all}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <InboxIcon size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unread</p>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{counts.unread}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Mail size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Career Resumes</p>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">{counts.career}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Newsletter</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{counts.newsletter}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Standardized Tabs (Matching Home Page Settings tab style) */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 w-fit">
        {[
          { id: 'all', label: 'All Messages', count: counts.all, icon: InboxIcon },
          { id: 'career', label: 'Career Resumes', count: counts.career, icon: Briefcase },
          { id: 'newsletter', label: 'Newsletter', count: counts.newsletter, icon: Mail },
          { id: 'unread', label: 'Unread', count: counts.unread, icon: MailOpen },
          { id: 'starred', label: 'Shortlisted', count: counts.starred, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as FolderTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Mailbox Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Message List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          {/* Search & Batch Toolbar */}
          <div className="p-3.5 border-b border-slate-100 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, role, filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-slate-900 transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={
                    filteredMessages.length > 0 &&
                    filteredMessages.every((m) => checkedIds.includes(m.id))
                  }
                  onChange={toggleCheckAll}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                />
                <span>
                  {checkedIds.length > 0
                    ? `${checkedIds.length} selected`
                    : `${filteredMessages.length} ${filteredMessages.length === 1 ? 'message' : 'messages'}`}
                </span>
              </label>

              {checkedIds.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleBatchAction('mark_read')}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Mark Read
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBatchAction('mark_unread')}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Unread
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBatchAction('delete')}
                    className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Message Rows */}
          <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 size={24} className="animate-spin text-slate-500" />
                <p className="text-xs font-medium">Loading inbox from database...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-16 px-6 text-center space-y-2">
                <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <InboxIcon size={20} />
                </div>
                <p className="text-xs font-bold text-slate-700">No messages found</p>
                <p className="text-[11px] text-slate-400">
                  Incoming career resumes and newsletter subscriptions will appear here automatically.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = msg.id === selectedId;
                const isChecked = checkedIds.includes(msg.id);
                const isCareer = msg.type === 'career';

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-900/5 border-l-4 border-l-slate-900'
                        : !msg.isRead
                        ? 'bg-blue-50/30 hover:bg-slate-50'
                        : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="pt-0.5 flex items-center gap-2 shrink-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onClick={(e) => toggleCheckOne(e, msg.id)}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleToggleStar(e, msg)}
                        className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                        title={msg.isStarred ? 'Remove from shortlisted' : 'Shortlist / Star'}
                      >
                        <Star
                          size={14}
                          className={msg.isStarred ? 'fill-amber-400 text-amber-400' : ''}
                        />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          )}
                          <span
                            className={`text-xs truncate ${
                              !msg.isRead ? 'font-black text-slate-900' : 'font-semibold text-slate-700'
                            }`}
                          >
                            {isCareer ? msg.fullName : msg.email}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {formatDate(msg.createdAt).split(',')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCareer
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}
                        >
                          {isCareer ? <Briefcase size={10} /> : <Mail size={10} />}
                          {isCareer ? 'Career Resume' : 'Newsletter'}
                        </span>

                        {isCareer && msg.position && (
                          <span className="text-[11px] font-semibold text-slate-700 truncate">
                            {msg.position}
                          </span>
                        )}
                      </div>

                      {isCareer ? (
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span className="text-[11px] text-slate-500 truncate">
                            {msg.email} {msg.phone ? `• ${msg.phone}` : ''}
                          </span>
                          {msg.resume?.filename && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold shrink-0 max-w-[140px] truncate">
                              <Paperclip size={10} />
                              <span className="truncate">{msg.resume.filename}</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 truncate">
                          Subscribed via {msg.source || 'Website Footer'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Reading Pane */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden min-h-[520px] flex flex-col">
          {!selectedMessage ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 text-slate-300">
                <MailOpen size={26} />
              </div>
              <p className="text-sm font-bold text-slate-700">Select a message to view details</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Click any career application or newsletter subscription on the left to inspect its details and download attachments.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Top Action Bar */}
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      selectedMessage.type === 'career'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {selectedMessage.type === 'career' ? (
                      <>
                        <Briefcase size={13} /> Career Application
                      </>
                    ) : (
                      <>
                        <Mail size={13} /> Newsletter Subscription
                      </>
                    )}
                  </span>

                  {selectedMessage.type === 'career' && (
                    <select
                      value={selectedMessage.status || 'read'}
                      onChange={(e) =>
                        handleStatusChange(selectedMessage, e.target.value as InboxMessageStatus)
                      }
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-slate-900 cursor-pointer"
                    >
                      <option value="unread">Status: Unread</option>
                      <option value="read">Status: Reviewed</option>
                      <option value="shortlisted">Status: Shortlisted</option>
                      <option value="archived">Status: Archived</option>
                    </select>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleToggleStar(e, selectedMessage)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedMessage.isStarred
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Star
                      size={13}
                      className={selectedMessage.isStarred ? 'fill-amber-400 text-amber-500' : ''}
                    />
                    <span>{selectedMessage.isStarred ? 'Shortlisted' : 'Shortlist'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {selectedMessage.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmItem(selectedMessage)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Detail Content */}
              {selectedMessage.type === 'career' ? (
                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                  {/* Applicant Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shrink-0">
                        {(selectedMessage.fullName || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-slate-900">
                          {selectedMessage.fullName}
                        </h2>
                        <p className="text-xs font-bold text-indigo-600 mt-0.5">
                          Applying for: {selectedMessage.position || 'General Application'}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                          <Clock size={12} /> Submitted on {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Regarding your application at Meadow Computer (${selectedMessage.position || ''})`}
                        className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Mail size={13} /> Email Candidate
                      </a>
                      {selectedMessage.phone && (
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Phone size={13} /> Call
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Structured Candidate Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Email Address
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {selectedMessage.email}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(selectedMessage.email)}
                          className="text-slate-400 hover:text-slate-900 cursor-pointer"
                          title="Copy email"
                        >
                          {copiedEmail === selectedMessage.email ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Phone Number
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        {selectedMessage.phone || 'Not provided'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Preferred Store Location
                      </p>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        {selectedMessage.preferredBranch || 'Any Johor Branch'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Employment Type & Start Date
                      </p>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        {selectedMessage.employmentType || 'Full-Time'} •{' '}
                        {selectedMessage.earliestStartDate
                          ? `Available ${selectedMessage.earliestStartDate}`
                          : 'Flexible Start'}
                      </p>
                    </div>
                  </div>

                  {/* Resume / CV Attachment Section */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Paperclip size={14} className="text-indigo-600" />
                      Resume / CV Attachment
                    </h3>

                    {selectedMessage.resume ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {selectedMessage.resume.filename}
                              </p>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                {selectedMessage.resume.formattedSize || 'Attached Document'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={selectedMessage.resume.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <ExternalLink size={13} /> View Resume
                            </a>
                            <a
                              href={selectedMessage.resume.url}
                              download={selectedMessage.resume.filename}
                              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <Download size={13} /> Download
                            </a>
                          </div>
                        </div>

                        {/* Inline Preview if image or PDF */}
                        {selectedMessage.resume.url &&
                          (selectedMessage.resume.filename?.toLowerCase().endsWith('.pdf') ? (
                            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100 h-80">
                              <iframe
                                src={selectedMessage.resume.url}
                                title={selectedMessage.resume.filename}
                                className="w-full h-full border-0"
                              />
                            </div>
                          ) : /\.(jpg|jpeg|png|webp|gif)$/i.test(selectedMessage.resume.filename || '') ? (
                            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-3 flex justify-center">
                              <img
                                src={selectedMessage.resume.url}
                                alt={selectedMessage.resume.filename}
                                className="max-h-80 object-contain rounded-lg"
                              />
                            </div>
                          ) : null)}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                        No resume file attached to this application.
                      </div>
                    )}
                  </div>

                  {/* Additional Message / Cover Note */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Applicant Message / Notes
                    </h3>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.coverLetter
                        ? selectedMessage.coverLetter
                        : 'No additional cover message provided.'}
                    </div>
                  </div>
                </div>
              ) : (
                /* Newsletter Subscription Reading Pane */
                <div className="p-6 space-y-6 flex-1">
                  <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Mail size={22} />
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Active Newsletter Subscriber
                        </span>
                        <h2 className="text-lg font-black text-slate-900">
                          {selectedMessage.email}
                        </h2>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          Subscribed on {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Subscriber Email
                      </p>
                      <p className="text-xs font-bold text-slate-900">{selectedMessage.email}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Subscription Source
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        {selectedMessage.source || 'Website Footer'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(selectedMessage.email)}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      {copiedEmail === selectedMessage.email ? (
                        <>
                          <Check size={14} className="text-emerald-400" /> Copied Email!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Email Address
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-2 transition-colors"
                    >
                      <Mail size={14} /> Send Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Message?</h3>
                <p className="text-xs text-slate-500">
                  This will permanently remove the entry from the database.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <p className="font-bold">
                {deleteConfirmItem.type === 'career'
                  ? `${deleteConfirmItem.fullName} (${deleteConfirmItem.position})`
                  : deleteConfirmItem.email}
              </p>
              <p className="text-slate-500 mt-0.5">{deleteConfirmItem.email}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSingle(deleteConfirmItem)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInbox;
