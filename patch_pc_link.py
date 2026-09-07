import re

with open('components/PublicNavbar.tsx', 'r') as f:
    content = f.read()

# Desktop link
content = content.replace(
'''              <Link 
                to="/customised" 
                className="px-5 lg:px-7 py-3 bg-slate-900 text-white text-[11px] lg:text-xs font-nav uppercase tracking-[0.25em] rounded-full hover:bg-rose-600 transition-all shadow-md shadow-slate-900/20 hover:shadow-rose-600/30 flex items-center gap-2 shrink-0"
              >''',
'''              <Link 
                to="#" 
                onClick={(e) => e.preventDefault()}
                className="px-5 lg:px-7 py-3 bg-slate-900 text-white text-[11px] lg:text-xs font-nav uppercase tracking-[0.25em] rounded-full hover:bg-slate-700 transition-all shadow-md shadow-slate-900/20 flex items-center gap-2 shrink-0 opacity-50 cursor-not-allowed pointer-events-none"
              >'''
)

# Mobile Link
content = content.replace(
'''                <Link 
                  to="/customised" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white shadow-md active:scale-[0.99] transition-transform group"
                >''',
'''                <Link 
                  to="#" 
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white shadow-md transition-transform group opacity-50 cursor-not-allowed pointer-events-none"
                >'''
)

# Mega menu link
content = content.replace(
'''                        <Link 
                          to="/customised"
                          onClick={() => setActiveMenu(null)}
                          className="group block cursor-pointer"
                        >''',
'''                        <Link 
                          to="#"
                          onClick={(e) => e.preventDefault()}
                          className="group block cursor-not-allowed opacity-50 pointer-events-none"
                        >'''
)

with open('components/PublicNavbar.tsx', 'w') as f:
    f.write(content)

