with open('pages/admin/HomePageSettings.tsx', 'r') as f:
    content = f.read()

content = content.replace(".from('generals')", ".from('products')")

with open('pages/admin/HomePageSettings.tsx', 'w') as f:
    f.write(content)
