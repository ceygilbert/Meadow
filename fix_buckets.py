import os

files_to_fix = [
    'pages/admin/Brands.tsx',
    'pages/admin/Categories.tsx',
    'pages/admin/SubCategories.tsx'
]

for file_path in files_to_fix:
    with open(file_path, 'r') as f:
        content = f.read()

    # Find where the bucket is used and replace it
    if 'Brands.tsx' in file_path:
        content = content.replace(".from('brands')", ".from('products')")
    elif 'Categories.tsx' in file_path:
        content = content.replace(".from('categories')", ".from('products')")
    elif 'SubCategories.tsx' in file_path:
        content = content.replace(".from('subcategories')", ".from('products')")

    with open(file_path, 'w') as f:
        f.write(content)
