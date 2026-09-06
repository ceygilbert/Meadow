with open('lib/AuthContext.tsx', 'r') as f:
    content = f.read()

target = "  isAdmin: boolean;\n  isCustomer: boolean;"
replacement = "  isAdmin: boolean;\n  isCustomer: boolean;\n  isSuperAdmin?: boolean;"
content = content.replace(target, replacement)

with open('lib/AuthContext.tsx', 'w') as f:
    f.write(content)
