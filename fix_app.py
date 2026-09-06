with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import Customers from './pages/admin/Customers';", "import Customers from './pages/admin/Customers';\nimport UsersPage from './pages/admin/Users';")
content = content.replace("<Route path=\"customers\" element={<Customers />} />", "<Route path=\"customers\" element={<Customers />} />\n        <Route path=\"users\" element={<UsersPage />} />")

with open('App.tsx', 'w') as f:
    f.write(content)
