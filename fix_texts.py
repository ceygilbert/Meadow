with open('components/AdminLayout.tsx', 'r') as f:
    content = f.read()
content = content.replace('{isSidebarOpen && <span>Home</span>}', '{isSidebarOpen && <span>Dashboard</span>}')
with open('components/AdminLayout.tsx', 'w') as f:
    f.write(content)

with open('pages/admin/Dashboard.tsx', 'r') as f:
    dashboard_content = f.read()

# We need to remove the whole banner block:
# {showBanner && (
#   <div className="mb-6 md:mb-8 bg-white/60 backdrop-blur-sm border border-slate-200/80 p-4 md:p-5 rounded-2xl flex flex-row items-center justify-between shadow-xs">
#     ...
#   </div>
# )}
start_idx = dashboard_content.find('{showBanner && (')
if start_idx != -1:
    # find the matching closing ')}' for showBanner
    end_idx = dashboard_content.find(')}', start_idx)
    # let's be careful to find the right one.
    # We can just remove from {showBanner && ( to the next div matching
    pass
