import React, { useState, useEffect } from 'react';
import { Users, Search, Loader2, AlertCircle, Edit, Trash2, Plus, X, ArrowRight, MoreHorizontal } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<Profile>>({});
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  
  const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'superadmin'])
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, role: string) => {
    if (role === 'superadmin') {
      alert('Cannot delete superadmin accounts.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this admin account?')) return;
    
    try {
      const { error: sbError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
        
      if (sbError) throw sbError;
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete user.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (currentUser.id) {
        // Edit existing
        const res = await fetch('/api/admin/update-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentUser.id,
            full_name: currentUser.full_name,
            phone: currentUser.phone,
            role: currentUser.role,
            password: password
          })
        });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned an invalid response (not JSON). Ensure your backend Express server is running in production.");
        }
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        // Create new
        const res = await fetch('/api/admin/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            password: password,
            full_name: currentUser.full_name,
            phone: currentUser.phone,
            role: currentUser.role || 'admin'
          })
        });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error("Server did not return JSON. This usually means the backend Express server is not running, or the route is missing. Response: " + text.substring(0, 50) + "...");
        }

        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      
      setIsEditing(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save user: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Staff Management</h1>
          <p className="text-slate-500 text-sm">Manage administrative access and roles.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentUser({ role: 'admin' });
            setPassword("");
            setIsEditing(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add Admin
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-800" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-900">User</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Role</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Phone</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Joined</th>
                  <th className="py-4 pr-6 pl-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3.5 min-w-[220px]">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/70 flex items-center justify-center shrink-0">
                          <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-900 truncate">{user.full_name}</span>
                          <span className="text-[11px] font-medium text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${user.role === 'superadmin' ? 'bg-purple-50 text-purple-600 border-purple-200/40' : 'bg-blue-50 text-blue-600 border-blue-200/40'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                      {user.phone || '-'}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right relative">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => setActionDropdownId(actionDropdownId === user.id ? null : user.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                      
                      {actionDropdownId === user.id && (
                        <div className="absolute right-6 top-12 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                          <button onClick={() => { setActionDropdownId(null); setCurrentUser(user); setPassword(""); setIsEditing(true); }} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Edit size={14} /> Edit Admin
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <button 
                            onClick={() => { setActionDropdownId(null); handleDelete(user.id, user.role); }} 
                            disabled={user.role === 'superadmin'}
                            className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 ${user.role === 'superadmin' ? 'text-slate-300 cursor-not-allowed' : 'text-rose-600 hover:bg-rose-50'}`}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-end">
          <div className="bg-[#F5F6F8] w-full max-w-3xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="px-6 md:px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsEditing(false)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 rounded-full transition-colors">
                  <ArrowRight size={20} className="rotate-180" />
                </button>
                <h3 className="text-lg font-semibold text-slate-900">{currentUser.id ? 'Edit User' : 'Add New Admin'}</h3>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors text-sm">
                  Discard
                </button>
                <button type="submit" form="user-form" disabled={formLoading} className="px-8 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all text-sm flex items-center gap-2">
                  {formLoading && <Loader2 size={16} className="animate-spin" />}
                  {currentUser.id ? 'Save Changes' : 'Save'}
                </button>
              </div>
            </div>
            
            <form id="user-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h4 className="text-lg font-semibold text-slate-900">User Details</h4>
                
                {!currentUser.id ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={currentUser.email || ''} 
                        onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <input 
                        type="password" 
                        required
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                        placeholder="Create a password"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Reset Password <span className="text-slate-400 font-normal ml-1">(Leave blank to keep current)</span></label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                      placeholder="Enter new password"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={currentUser.full_name || ''} 
                    onChange={e => setCurrentUser({...currentUser, full_name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input 
                    type="text" 
                    value={currentUser.phone || ''} 
                    onChange={e => setCurrentUser({...currentUser, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <select 
                    value={currentUser.role || 'admin'} 
                    onChange={e => setCurrentUser({...currentUser, role: e.target.value as any})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                    disabled={currentUser.role === 'superadmin' && currentUser.id !== undefined}
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
