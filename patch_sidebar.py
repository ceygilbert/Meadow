import re

with open('components/AdminLayout.tsx', 'r') as f:
    content = f.read()

# Remove Sales Channels Group
content = re.sub(
    r'\s*\{\/\* Sales Channels Group \*\/\}.*?title="Online Store"[\s\S]*?<\/Link>\s*<\/nav>\s*<\/div>',
    '',
    content,
    flags=re.DOTALL
)

# Replace <Link to="/"> with <a href="/"> for Open Site to ensure it works correctly as a new window/tab link
content = content.replace(
    '''            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <Globe size={14} />
              <span>Open Site</span>
            </Link>''',
    '''            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <Globe size={14} />
              <span>Open Site</span>
            </a>'''
)

with open('components/AdminLayout.tsx', 'w') as f:
    f.write(content)
