with open('pages/admin/Dashboard.tsx', 'r') as f:
    content = f.read()
    
# Remove everything between {/* Notice / Promo Banner (Matching Screenshot) */} and {/* Main 2-Column Dashboard Grid */}
start_marker = "{/* Notice / Promo Banner (Matching Screenshot) */}"
end_marker = "{/* Main 2-Column Dashboard Grid */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open('pages/admin/Dashboard.tsx', 'w') as f:
    f.write(content)
