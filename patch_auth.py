import re
with open('lib/AuthContext.tsx', 'r') as f:
    content = f.read()

# Update isAdmin logic
target = "isAdmin: profile?.role === 'admin',"
replacement = "isAdmin: profile?.role === 'admin' || profile?.role === 'superadmin',\n    isSuperAdmin: profile?.role === 'superadmin',"
content = content.replace(target, replacement)

with open('lib/AuthContext.tsx', 'w') as f:
    f.write(content)
