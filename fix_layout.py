with open('components/AdminLayout.tsx', 'r') as f:
    content = f.read()

# 1. Parse current profile from local storage
target_state = "  const navigate = useNavigate();"
replacement_state = """  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('meadow_auth_profile_current');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);"""
content = content.replace(target_state, replacement_state)

# 2. Add Users link after Customers link
target_customers = """              {/* Customers */}
              <Link
                to="/admin/customers"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/customers')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Customers"
              >
                <Users size={17} className={isCurrent('/admin/customers') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Customers</span>}
              </Link>"""

replacement_customers = """              {/* Customers */}
              <Link
                to="/admin/customers"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/customers')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Customers"
              >
                <Users size={17} className={isCurrent('/admin/customers') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Customers</span>}
              </Link>

              {/* Staff / Admins (Superadmin only) */}
              {profile?.role === 'superadmin' && (
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent('/admin/users')
                      ? 'bg-purple-50 text-purple-900 font-bold'
                      : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/50'
                  }`}
                  title="Admin Staff"
                >
                  <Sparkles size={17} className={isCurrent('/admin/users') ? 'text-purple-900' : 'text-slate-500'} />
                  {isSidebarOpen && <span>Staff</span>}
                </Link>
              )}"""

content = content.replace(target_customers, replacement_customers)

with open('components/AdminLayout.tsx', 'w') as f:
    f.write(content)
