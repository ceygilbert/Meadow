/**
 * MySQL / MariaDB Query Builder and Client Adapter for Hostinger
 * Provides a chainable API compatible with Supabase Client syntax.
 */

export interface QueryFilter {
  column: string;
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
  value: any;
}

export interface QueryOrder {
  column: string;
  ascending?: boolean;
}

export class MysqlQueryBuilder<T = any> implements PromiseLike<{ data: T | null; error: any; count?: number | null }> {
  private tableName: string;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private selectedColumns: string = '*';
  private filters: QueryFilter[] = [];
  private orderConfig?: QueryOrder;
  private limitCount?: number;
  private offsetCount?: number;
  private payload?: any;
  private isSingle = false;
  private isMaybeSingle = false;

  constructor(table: string) {
    this.tableName = table;
  }

  select(columns: string = '*', _options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) {
    this.action = 'select';
    this.selectedColumns = columns;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, op: 'eq', value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ column, op: 'neq', value });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push({ column, op: 'gt', value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ column, op: 'gte', value });
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push({ column, op: 'lt', value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ column, op: 'lte', value });
    return this;
  }

  like(column: string, pattern: string) {
    this.filters.push({ column, op: 'like', value: pattern });
    return this;
  }

  ilike(column: string, pattern: string) {
    this.filters.push({ column, op: 'ilike', value: pattern });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ column, op: 'in', value: values });
    return this;
  }

  is(column: string, value: any) {
    this.filters.push({ column, op: 'is', value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderConfig = { column, ascending: options?.ascending ?? true };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number) {
    this.offsetCount = from;
    this.limitCount = to - from + 1;
    return this;
  }

  single() {
    this.isSingle = true;
    this.limitCount = 1;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    this.limitCount = 1;
    return this;
  }

  insert(data: any) {
    this.action = 'insert';
    this.payload = data;
    return this;
  }

  update(data: any) {
    this.action = 'update';
    this.payload = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  async executeQuery(): Promise<{ data: any; error: any; count?: number | null }> {
    try {
      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: this.tableName,
          action: this.action,
          select: this.selectedColumns,
          filters: this.filters,
          order: this.orderConfig,
          limit: this.limitCount,
          offset: this.offsetCount,
          data: this.payload,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Database error: HTTP ${response.status}`);
      }

      const result = await response.json();
      let data = result.data;

      if (this.action === 'select') {
        if (this.isSingle) {
          if (!data || data.length === 0) {
            return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
          }
          data = data[0];
        } else if (this.isMaybeSingle) {
          data = data && data.length > 0 ? data[0] : null;
        }
      }

      return { data, error: null, count: Array.isArray(data) ? data.length : 1 };
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Unknown database error' }, count: 0 };
    }
  }

  then<TResult1 = { data: T | null; error: any; count?: number | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T | null; error: any; count?: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.executeQuery().then(onfulfilled, onrejected);
  }
}

/**
 * Storage adapter uploading files to Hostinger /public/uploads via /api/upload
 */
export const mysqlStorage = {
  from: (_bucket: string) => ({
    upload: async (filePath: string, file: File | Blob) => {
      try {
        const formData = new FormData();
        formData.append('file', file, (file as File).name || filePath);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Upload failed');
        }

        const data = await res.json();
        return { data: { path: data.filename, publicUrl: data.publicUrl }, error: null };
      } catch (err: any) {
        return { data: null, error: { message: err.message } };
      }
    },

    getPublicUrl: (filePath: string) => {
      if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('/uploads/')) {
        return { data: { publicUrl: filePath } };
      }
      const clean = filePath.replace(/^product-images\//, '').replace(/^generals\//, '');
      return { data: { publicUrl: `/uploads/${clean}` } };
    },
  }),
};

/**
 * Native JWT Authentication adapter for Hostinger MySQL
 */
type AuthStateListener = (event: string, session: any) => void;
const authListeners = new Set<AuthStateListener>();
const SESSION_STORAGE_KEY = 'meadow_mysql_auth_session';

export const mysqlAuth = {
  getSession: async () => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return { data: { session: null }, error: null };
      const session = JSON.parse(raw);
      return { data: { session }, error: null };
    } catch {
      return { data: { session: null }, error: null };
    }
  },

  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: data.error || 'Login failed' } };
      }

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
      authListeners.forEach((listener) => listener('SIGNED_IN', data.session));

      return { data: { user: data.user, session: data.session }, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Network error during login' } };
    }
  },

  signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: options?.data?.full_name || '',
          phone: options?.data?.phone || '',
          address: options?.data?.address || '',
          role: options?.data?.role || 'customer',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: data.error || 'Registration failed' } };
      }

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
      authListeners.forEach((listener) => listener('SIGNED_IN', data.session));

      return { data: { user: data.user, session: data.session }, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Network error during sign up' } };
    }
  },

  signOut: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      authListeners.forEach((listener) => listener('SIGNED_OUT', null));
    }
    return { error: null };
  },

  onAuthStateChange: (callback: AuthStateListener) => {
    authListeners.add(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners.delete(callback);
          },
        },
      },
    };
  },
};
