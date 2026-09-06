with open('App.tsx', 'r') as f:
    content = f.read()

import_orders = "import Orders from './pages/admin/Orders';"
import_finances = "import Finances from './pages/admin/Finances';"

if import_finances not in content:
    content = content.replace(import_orders, import_orders + '\n' + import_finances)

route_orders = '<Route path="orders" element={<Orders />} />'
route_finances = '<Route path="finances" element={<Finances />} />'

if route_finances not in content:
    content = content.replace(route_orders, route_orders + '\n        ' + route_finances)

with open('App.tsx', 'w') as f:
    f.write(content)
