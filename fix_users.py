with open('pages/admin/Users.tsx', 'r') as f:
    content = f.read()

import re

# Update table classes to match Products.tsx
content = content.replace('className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"', 'className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"')
content = content.replace('<div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">', '<div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">\n          <div className="overflow-x-auto">')
content = content.replace('</table>\n        </div>', '</table>\n          </div>\n        </div>')

content = content.replace('<tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">', '<tr className="border-b border-slate-100">')
content = content.replace('<th className="p-6">', '<th className="py-4 px-4 text-xs font-semibold text-slate-900">')
content = content.replace('<th className="p-6 text-right">', '<th className="py-4 pr-6 pl-4 text-right">')

content = content.replace('<td className="p-6">', '<td className="py-4 px-4">')
content = content.replace('<td className="p-6 text-slate-600 text-sm">', '<td className="py-4 px-4 text-xs font-medium text-slate-600">')
content = content.replace('<td className="p-6 text-slate-500 text-sm">', '<td className="py-4 px-4 text-xs font-medium text-slate-600">')
content = content.replace('<td className="p-6 text-right">', '<td className="py-4 pr-6 pl-4 text-right relative">')
content = content.replace('<tr key={user.id} className="hover:bg-slate-50 transition-colors group">', '<tr key={user.id} className="hover:bg-slate-50/70 transition-colors">')

content = content.replace('<div className="flex items-center gap-3">', '<div className="flex items-center gap-3.5 min-w-[220px]">')
content = content.replace('<div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden shrink-0">', '<div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/70 flex items-center justify-center shrink-0">')
content = content.replace('<p className="font-bold text-slate-900">{user.full_name}</p>', '<span className="block text-xs font-bold text-slate-900 truncate">{user.full_name}</span>')
content = content.replace('<p className="text-sm text-slate-500">{user.email}</p>', '<span className="text-[11px] font-medium text-slate-400">{user.email}</span>')

content = content.replace('<span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', '<span className={`px-3 py-1 rounded-full text-[11px] font-semibold border')

# Use ArrowRight from lucide-react if not imported
if 'ArrowRight' not in content:
    content = content.replace('X, ', 'X, ArrowRight, ')

# Update the modal pattern
modal_old = """      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.id ? 'Edit User' : 'Add New Admin'}</h2>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">"""

modal_new = """      {/* Edit/Create Modal */}
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
                <h4 className="text-lg font-semibold text-slate-900">User Details</h4>"""

content = content.replace(modal_old, modal_new)

# Update form content
content = content.replace('<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">', '<label className="block text-sm font-medium text-slate-700 mb-2">')
content = content.replace('className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"', 'className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"')

# Remove old buttons section from modal since they are in header now
btn_section_old = """              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {formLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>"""

btn_section_new = """              </div>
            </form>
          </div>
        </div>"""

content = content.replace(btn_section_old, btn_section_new)

with open('pages/admin/Users.tsx', 'w') as f:
    f.write(content)
