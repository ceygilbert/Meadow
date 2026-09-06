with open('pages/admin/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (profile.role !== 'admin') {", "if (profile.role !== 'admin' && profile.role !== 'superadmin') {")

with open('pages/admin/Login.tsx', 'w') as f:
    f.write(content)
