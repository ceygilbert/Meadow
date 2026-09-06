import re

with open('pages/admin/Orders.tsx', 'r') as f:
    content = f.read()

# Replace Imports to include ArrowRight, MoreHorizontal
if 'MoreHorizontal' not in content:
    content = content.replace('X,', 'X,\n  ArrowRight,\n  MoreHorizontal,')

# Add actionDropdownId state
if 'actionDropdownId' not in content:
    content = content.replace('const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);', 'const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);\n  const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);')

# Replace search bar container
content = content.replace('className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"', 'className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"')

# Replace error and loading states
content = re.sub(
    r'\{loading \? \([\s\S]*?Fetching Transactions...</p>\n        </div>\n      \) : error \? \([\s\S]*?Retry</button>\n        </div>\n      \) : \(',
    """{error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-800" size={32} />
        </div>
      ) : (""",
    content
)

# Replace table container
content = content.replace(
    '<div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">',
    '<div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">'
)

content = content.replace('<table className="w-full text-left">', '<table className="w-full text-left border-collapse">')
content = content.replace('<thead className="bg-slate-50/50 border-b border-slate-100">', '<thead>')

# Replace table headers
content = content.replace(
    """                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>""",
    """                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-900">Transaction ID</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Customer</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Date</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Amount</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Status</th>
                  <th className="py-4 pr-6 pl-4 text-right"></th>
                </tr>"""
)

# Replace table body rows
content = content.replace('<tbody className="divide-y divide-slate-50">', '<tbody className="divide-y divide-slate-100">')
content = content.replace('<tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">', '<tr key={order.id} className="hover:bg-slate-50/70 transition-colors">')

content = content.replace('<td className="px-8 py-5">', '<td className="py-4 px-4">')
content = content.replace('<td className="px-8 py-5 text-right">', '<td className="py-4 pr-6 pl-4 text-right relative">')

content = content.replace(
    """                    <td className="py-4 px-4">
                      <span className="text-xs font-black text-slate-400 uppercase font-mono">#{order.id.slice(0, 8)}</span>
                    </td>""",
    """                    <td className="py-4 pl-6 pr-4">
                      <span className="text-xs font-bold text-slate-900 font-mono">#{order.id.slice(0, 8)}</span>
                    </td>"""
)

content = content.replace(
    """                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{order.customer_name}</span>
                        <span className="text-[10px] text-slate-400">{order.customer_email}</span>
                      </div>
                    </td>""",
    """                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 truncate">{order.customer_name}</span>
                        <span className="text-[11px] font-medium text-slate-400">{order.customer_email}</span>
                      </div>
                    </td>"""
)

content = content.replace(
    """                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    </td>""",
    """                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>"""
)

content = content.replace(
    """                    <td className="py-4 px-4">
                      <span className="font-black text-slate-900">RM{order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </td>""",
    """                    <td className="py-4 px-4 text-xs font-semibold text-slate-900">
                      RM{order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>"""
)

content = content.replace(
    """                    <td className="py-4 px-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>""",
    """                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </td>"""
)

# Actions Column
content = content.replace(
    """                    <td className="py-4 pr-6 pl-4 text-right relative">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Eye size={16} />
                      </button>
                    </td>""",
    """                    <td className="py-4 pr-6 pl-4 text-right relative">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => setActionDropdownId(actionDropdownId === order.id ? null : order.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                      
                      {actionDropdownId === order.id && (
                        <div className="absolute right-6 top-12 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                          <button onClick={() => { setActionDropdownId(null); setSelectedOrder(order); }} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Eye size={14} /> View Details
                          </button>
                        </div>
                      )}
                    </td>"""
)

content = content.replace('<td colSpan={6} className="px-8 py-24 text-center">', '<td colSpan={6} className="p-12 text-center text-slate-400 font-medium">')
content = content.replace('<p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions recorded.</p>', 'No transactions recorded.')

# Replace Slide-in drawer
modal_old = """      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order Details</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Transaction ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <PackageCheck size={14} /> Purchased Items
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                          {item.products?.image_url && <img src={item.products.image_url} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.products?.name || 'Unknown Product'}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">RM{item.unit_price.toLocaleString()} x {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">RM{(item.unit_price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Order Total</span>
                    <span className="text-2xl font-black text-blue-600">RM{selectedOrder.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <User size={14} /> Customer Info
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                         <User size={16} />
                       </div>
                       <span className="text-sm font-bold text-slate-900">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                         <Mail size={16} />
                       </div>
                       <span className="text-sm font-medium text-slate-500 truncate">{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                         <Calendar size={16} />
                       </div>
                       <span className="text-sm font-medium text-slate-500">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <Receipt size={14} /> Actions
                  </h4>
                  <div className="space-y-2">
                    {['pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status as any)}
                        disabled={updatingStatus === selectedOrder.id || selectedOrder.status === status}
                        className={`w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedOrder.status === status 
                            ? getStatusColor(status as any) 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20"
              >
                Close Transaction
              </button>
            </div>
          </div>
        </div>"""

modal_new = """      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-end">
          <div className="bg-[#F5F6F8] w-full max-w-4xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="px-6 md:px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedOrder(null)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 rounded-full transition-colors">
                  <ArrowRight size={20} className="rotate-180" />
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Order Details</h3>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">ID: {selectedOrder.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors text-sm">
                  Close
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <PackageCheck size={18} className="text-slate-400" /> Purchased Items
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200/70 flex items-center justify-center">
                          {item.products?.image_url ? (
                            <img src={item.products.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <PackageCheck className="text-slate-300" size={20} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{item.products?.name || 'Unknown Product'}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">RM{item.unit_price.toLocaleString()} × {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">RM{(item.unit_price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-600">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-900">RM{selectedOrder.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Customer</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                         <User size={14} />
                       </div>
                       <span className="text-sm font-medium text-slate-900 truncate">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                         <Mail size={14} />
                       </div>
                       <span className="text-sm font-medium text-slate-600 truncate">{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                         <Calendar size={14} />
                       </div>
                       <span className="text-sm font-medium text-slate-600 truncate">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Update Status</h4>
                  <div className="space-y-2">
                    {['pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status as any)}
                        disabled={updatingStatus === selectedOrder.id || selectedOrder.status === status}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold capitalize transition-all border flex items-center justify-center gap-2 ${
                          selectedOrder.status === status 
                            ? getStatusColor(status as any) 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {updatingStatus === selectedOrder.id && selectedOrder.status !== status ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : selectedOrder.status === status && (
                          <CheckCircle2 size={14} />
                        )}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>"""

content = content.replace(modal_old, modal_new)

with open('pages/admin/Orders.tsx', 'w') as f:
    f.write(content)
