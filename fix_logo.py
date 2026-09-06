with open('components/AdminLayout.tsx', 'r') as f:
    content = f.read()

logo_url = '"https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png"'
icon_url = '"https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Icon%20Logo.png"' # Let's see if this exists, actually let's just use the full logo or hide text

# We can replace the Link inner content.
old_link = '''            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs tracking-tighter">
                M
              </div>
              {isSidebarOpen && (
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  MEADOW
                </span>
              )}
            </Link>'''

new_link = f'''            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <img src={{isSidebarOpen ? {logo_url} : {logo_url}}} className={{`object-contain transition-all duration-300 ${{isSidebarOpen ? 'h-8' : 'h-8 w-8 object-left'}}`}} alt="Meadow" style={{ objectPosition: isSidebarOpen ? 'center' : '0 50%' }} />
            </Link>'''

content = content.replace(old_link, new_link)

with open('components/AdminLayout.tsx', 'w') as f:
    f.write(content)
