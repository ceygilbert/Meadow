with open('components/AdminLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "className={`object-contain transition-all duration-300 ${isSidebarOpen ? 'h-8' : 'h-8 w-8 object-left'}`}",
    "className={`transition-all duration-300 ${isSidebarOpen ? 'h-7 object-contain' : 'h-8 w-8 object-cover object-left'}`}"
)

with open('components/AdminLayout.tsx', 'w') as f:
    f.write(content)
