with open('pages/public/Home.tsx', 'r') as f:
    content = f.read()

target = """               <Link 
                  to={homeSettings?.custom_pc_btn_link || "/customised"}
                  className="inline-flex items-center gap-3 px-6 py-3 md:px-9 md:py-4 bg-[#e11d48] hover:bg-rose-700 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-wider md:tracking-widest hover:scale-105 transition-all shadow-xl group/btn w-fit active:scale-95"
               >
                 <span>{homeSettings?.custom_pc_btn_text || "Start Building"}</span>
                 <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
               </Link>"""

replacement = """               {/* Temporarily disabled
               <Link 
                  to={homeSettings?.custom_pc_btn_link || "/customised"}
                  className="inline-flex items-center gap-3 px-6 py-3 md:px-9 md:py-4 bg-[#e11d48] hover:bg-rose-700 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-wider md:tracking-widest hover:scale-105 transition-all shadow-xl group/btn w-fit active:scale-95"
               >
                 <span>{homeSettings?.custom_pc_btn_text || "Start Building"}</span>
                 <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
               </Link>
               */}"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target not found. Doing regex...")
    import re
    content = re.sub(
        r'(<Link[^>]*to=\{homeSettings\?\.custom_pc_btn_link[^>]*>[\s\S]*?<span>\{homeSettings\?\.custom_pc_btn_text[^<]*<\/span>[\s\S]*?<\/Link>)',
        r'{/* Temporarily disabled\n\1\n*/}',
        content
    )

with open('pages/public/Home.tsx', 'w') as f:
    f.write(content)

