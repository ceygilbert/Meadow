with open('pages/admin/Customers.tsx', 'r') as f:
    content = f.read()

target = """      const { data, error: sbError } = await supabase
        .from('profiles')
        .select(`
          *,
          orders:orders(total_amount)
        `)
        .order('created_at', { ascending: false });"""

replacement = """      const { data, error: sbError } = await supabase
        .from('profiles')
        .select(`
          *,
          orders:orders(total_amount)
        `)
        .eq('role', 'customer')
        .order('created_at', { ascending: false });"""

content = content.replace(target, replacement)

with open('pages/admin/Customers.tsx', 'w') as f:
    f.write(content)
