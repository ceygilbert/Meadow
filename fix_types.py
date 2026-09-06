with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace("role: 'admin' | 'customer';", "role: 'admin' | 'customer' | 'superadmin';")

with open('types.ts', 'w') as f:
    f.write(content)
