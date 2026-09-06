import re

files_to_patch = ['pages/admin/Users.tsx', 'pages/admin/Customers.tsx']

for file in files_to_patch:
    with open(file, 'r') as f:
        content = f.read()

    # Patch update-user
    content = content.replace(
        '''        const res = await fetch('/api/admin/update-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({''',
        '''        const res = await fetch('/api/admin/update-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({'''
    )
    
    # Actually let's use a regex to insert the check right before `const data = await res.json();`
    # for all fetch calls.
    
    content = re.sub(
        r'\}\);\s*const data = await res\.json\(\);',
        '''});
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned an invalid response (not JSON). Ensure your backend Express server is running in production.");
        }
        
        const data = await res.json();''',
        content
    )
    
    with open(file, 'w') as f:
        f.write(content)

