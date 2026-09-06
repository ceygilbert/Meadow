import re

# 1. Patch Categories.tsx
with open('pages/admin/Categories.tsx', 'r') as f:
    categories_content = f.read()

# Replace supabase.from('products') -> supabase.from('categories')
categories_content = categories_content.replace(".from('products')", ".from('categories')")

with open('pages/admin/Categories.tsx', 'w') as f:
    f.write(categories_content)


# 2. Patch Brands.tsx
with open('pages/admin/Brands.tsx', 'r') as f:
    brands_content = f.read()

# Replace supabase.from('products') -> supabase.from('brands')
brands_content = brands_content.replace(".from('products')", ".from('brands')")

with open('pages/admin/Brands.tsx', 'w') as f:
    f.write(brands_content)


# 3. Patch SubCategories.tsx
with open('pages/admin/SubCategories.tsx', 'r') as f:
    subcategories_content = f.read()

# Replace supabase.from('products') for catRes -> supabase.from('categories')
subcategories_content = subcategories_content.replace(
    "supabase.from('products').select('*').order('name')", 
    "supabase.from('categories').select('*').order('name')"
)

with open('pages/admin/SubCategories.tsx', 'w') as f:
    f.write(subcategories_content)

