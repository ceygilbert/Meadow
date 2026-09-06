with open('pages/admin/Users.tsx', 'r') as f:
    content = f.read()

# 1. Add password state
content = content.replace('const [currentUser, setCurrentUser] = useState<Partial<Profile>>({});', 'const [currentUser, setCurrentUser] = useState<Partial<Profile>>({});\n  const [password, setPassword] = useState("");')

# 2. Reset password when opening modal
content = content.replace('setCurrentUser({ role: \'admin\' });\n            setIsEditing(true);', 'setCurrentUser({ role: \'admin\' });\n            setPassword("");\n            setIsEditing(true);')

content = content.replace('setCurrentUser(user); setIsEditing(true);', 'setCurrentUser(user); setPassword(""); setIsEditing(true);')

# 3. Update handleSave
old_handle_save = """  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (currentUser.id) {
        // Edit existing
        const { error: sbError } = await supabase
          .from('profiles')
          .update({
            full_name: currentUser.full_name,
            phone: currentUser.phone,
            role: currentUser.role
          })
          .eq('id', currentUser.id);
        if (sbError) throw sbError;
      } else {
        const id = crypto.randomUUID();
        const { error: sbError } = await supabase
          .from('profiles')
          .insert([{
            id,
            email: currentUser.email,
            full_name: currentUser.full_name,
            phone: currentUser.phone,
            role: currentUser.role || 'admin',
          }]);
        if (sbError) throw sbError;
      }
      
      setIsEditing(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert('Failed to save user.');
    } finally {
      setFormLoading(false);
    }
  };"""

new_handle_save = """  const handleSave = async (e: React.FormEvent) => {
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
  };"""

content = content.replace(old_handle_save, new_handle_save)

# 4. Add Password fields in the form
old_email_div = """                {!currentUser.id && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      required
                      value={currentUser.email || ''} 
                      onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                )}"""

new_password_div = """                {!currentUser.id ? (
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
                )}"""

content = content.replace(old_email_div, new_password_div)

with open('pages/admin/Users.tsx', 'w') as f:
    f.write(content)
