with open('pages/admin/Dashboard.tsx', 'r') as f:
    content = f.read()

start_idx = content.find('{showBanner && (')
if start_idx != -1:
    end_idx = content.find(')}', start_idx + 10) + 2 # the closing tag for showBanner block
    content = content[:start_idx] + content[end_idx:]

with open('pages/admin/Dashboard.tsx', 'w') as f:
    f.write(content)
