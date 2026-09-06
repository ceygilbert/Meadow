with open('components/AdminLayout.tsx', 'r') as f:
    content = f.read()

if 'DollarSign,' not in content:
    content = content.replace('Receipt,', 'Receipt,\n  DollarSign,\n  ShoppingCart,')

old_finances_link = """              {/* Finances / Transactions */}
              <Link
                to="/admin/orders"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/orders')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Finances / Orders"
              >
                <Receipt size={17} className={isCurrent('/admin/orders') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Finances</span>}
              </Link>"""

new_links = """              {/* Orders */}
              <Link
                to="/admin/orders"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/orders')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Orders"
              >
                <ShoppingCart size={17} className={isCurrent('/admin/orders') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Orders</span>}
              </Link>

              {/* Finances */}
              <Link
                to="/admin/finances"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/finances')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Finances"
              >
                <DollarSign size={17} className={isCurrent('/admin/finances') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Finances</span>}
              </Link>"""

content = content.replace(old_finances_link, new_links)

with open('components/AdminLayout.tsx', 'w') as f:
    f.write(content)
