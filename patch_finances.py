import re
with open('pages/admin/Finances.tsx', 'r') as f:
    content = f.read()

# Replace Orders with Finances component name
content = content.replace('const Orders: React.FC = () => {', 'const Finances: React.FC = () => {')
content = content.replace('export default Orders;', 'export default Finances;')

# Replace Page Titles
content = content.replace('<h1 className="text-2xl font-bold text-slate-900">Transactions</h1>', '<h1 className="text-2xl font-bold text-slate-900">Finances</h1>')
content = content.replace('<p className="text-slate-500 text-sm">Monitor customer deals and manage fulfillment.</p>', '<p className="text-slate-500 text-sm">Track payments, invoices, and revenue records.</p>')

# Replace Transaction ID with Invoice ID where appropriate
content = content.replace('Transaction ID: {selectedOrder.id}', 'Invoice / Order ID: {selectedOrder.id}')
content = content.replace('Transaction ID</th>', 'Invoice ID</th>')
content = content.replace('No transactions recorded', 'No financial records found')

# Update Status badge to represent Payment Status
def modify_status_color(match):
    # Mapping fulfillment status to a pseudo payment status for display
    return """
  const getPaymentStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing': return 'bg-emerald-100 text-emerald-700 border-emerald-200'; // paid
      case 'shipped': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200'; // refunded/void
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPaymentStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Unpaid';
      case 'processing':
      case 'shipped':
      case 'completed': return 'Paid';
      case 'cancelled': return 'Refunded';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: Order['status']) => {"""

content = re.sub(r'const getStatusColor = \(status: Order\[\'status\'\]\) => \{', modify_status_color, content, count=1)

# Modify Table rendering for Status
content = content.replace(
"""                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}""",
"""                        {getStatusIcon(order.status)}
                        {getPaymentStatusText(order.status)}"""
)

# Use payment status color
content = content.replace(
"""<div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ${getStatusColor(order.status)}`}>""",
"""<div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ${getPaymentStatusColor(order.status)}`}>"""
)

# Hide Update Status buttons in Finances (Finances shouldn't update fulfillment status, just view)
content = re.sub(
    r'<div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">\s*<h4 className="text-sm font-semibold text-slate-900 mb-4">Update Status</h4>[\s\S]*?</div>\s*</div>',
    """<div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Payment Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-xs font-medium text-slate-500">Method</span>
                      <span className="text-xs font-bold text-slate-900">Credit Card / Online</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-xs font-medium text-slate-500">Payment Status</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getPaymentStatusColor(selectedOrder.status)}`}>
                        {getPaymentStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>""",
    content
)

# Change title in Modal
content = content.replace('<h3 className="text-lg font-semibold text-slate-900">Order Details</h3>', '<h3 className="text-lg font-semibold text-slate-900">Financial Record</h3>')

with open('pages/admin/Finances.tsx', 'w') as f:
    f.write(content)
