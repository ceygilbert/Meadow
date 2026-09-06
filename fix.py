with open('pages/admin/Products.tsx', 'r') as f:
    lines = f.readlines()
lines[1001] = '                      </div>\n                    )}\n'
with open('pages/admin/Products.tsx', 'w') as f:
    f.writelines(lines)
