with open('components/AdminLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace("style={ objectPosition:", "style={{ objectPosition:")
content = content.replace("'0 50%' } />", "'0 50%' }} />")

with open('components/AdminLayout.tsx', 'w') as f:
    f.write(content)
