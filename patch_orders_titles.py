with open('pages/admin/Orders.tsx', 'r') as f:
    content = f.read()

# Replace Page Titles
content = content.replace('<h1 className="text-2xl font-bold text-slate-900">Transactions</h1>', '<h1 className="text-2xl font-bold text-slate-900">Orders</h1>')
content = content.replace('<p className="text-slate-500 text-sm">Monitor customer deals and manage fulfillment.</p>', '<p className="text-slate-500 text-sm">Monitor customer orders and manage fulfillment status.</p>')

# Replace Transaction ID with Order ID
content = content.replace('Transaction ID</th>', 'Order ID</th>')
content = content.replace('Transaction ID: {selectedOrder.id}', 'Order ID: {selectedOrder.id}')
content = content.replace('No transactions recorded', 'No orders found')
content = content.replace('Close Transaction', 'Close Order')

with open('pages/admin/Orders.tsx', 'w') as f:
    f.write(content)
