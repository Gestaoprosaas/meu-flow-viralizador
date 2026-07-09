import re

with open("src/components/TemplateGallery.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update activeSubTab state type and import
content = content.replace("const [activeSubTab, setActiveSubTab] = useState<'library' | 'custom'>('library');", 
                          "const [activeSubTab, setActiveSubTab] = useState<'ready' | 'library' | 'custom'>('library');")

# 2. Add the subtab button
subtab_target = """        <button
          onClick={() => setActiveSubTab('library')}"""
subtab_replacement = """        <button
          onClick={() => setActiveSubTab('ready')}
          className={`flex-1 py-3 px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2.5 ${
            activeSubTab === 'ready'
              ? 'bg-gradient-to-tr from-[#FE2C55] to-[#813EF6] text-white shadow-lg shadow-[#FE2C55]/15'
              : 'text-[#8888AA] hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Avatares Prontos
        </button>
        <button
          onClick={() => setActiveSubTab('library')}"""
content = content.replace(subtab_target, subtab_replacement)

content = content.replace("Biblioteca de Modelos Prontos", "Templates Premium")

# 3. Add Avatares Prontos render block
render_target = """      {/* TAB CONTENT RENDERING */}
      {activeSubTab === 'library' ? ("""
render_replacement = """      {/* TAB CONTENT RENDERING */}
      {activeSubTab === 'ready' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
           {AVATARS_PRESETS.map(avatar => (
             <div key={avatar.id} className="bg-[#050508] border border-[#1E1E2E] p-3 rounded-2xl flex flex-col gap-3 group relative overflow-hidden">
               <div className="aspect-[3/4] rounded-xl overflow-hidden relative bg-[#1E1E2E]">
                 <img src={avatar.imageUrl || avatar.foto} alt={avatar.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div>
                 <h4 className="font-bold text-white text-sm truncate">{avatar.nome}</h4>
                 <p className="text-xs text-zinc-500">{avatar.categoria}</p>
               </div>
               <button 
                 onClick={() => {
                   localStorage.setItem('viralseller_avatar_pre', JSON.stringify(avatar));
                   if(onNavigate) onNavigate('produtos');
                 }}
                 className="w-full py-2 bg-[#1E1E2E] hover:bg-[#FE2C55] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
               >
                 Usar Avatar
               </button>
             </div>
           ))}
        </div>
      ) : activeSubTab === 'library' ? ("""
content = content.replace(render_target, render_replacement)

# 4. Add typewriter states and logic
# Find generatedCustomPrompt declaration
usememo_target = """  const generatedCustomPrompt = useMemo(() => {"""
usememo_replacement = """  const [isTyping, setIsTyping] = useState(false);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [typingStatus, setTypingStatus] = useState("✅ Prompt pronto!");

  const generatedCustomPrompt = useMemo(() => {"""
content = content.replace(usememo_target, usememo_replacement)

# Add useEffect for typewriter
effect_target = """  const handleCopyCustom = () => {"""
effect_replacement = """  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let typingIntervalId: NodeJS.Timeout;
    
    setTypingStatus("✨ Construindo seu prompt...");
    setIsTyping(true);
    setTypedPrompt("");
    
    // Debounce to start typing
    timeoutId = setTimeout(() => {
      let i = 0;
      typingIntervalId = setInterval(() => {
        if (i < generatedCustomPrompt.length) {
          setTypedPrompt(prev => prev + generatedCustomPrompt.charAt(i));
          i++;
        } else {
          clearInterval(typingIntervalId);
          setIsTyping(false);
          setTypingStatus("✅ Prompt pronto!");
        }
      }, 5); // very fast typing
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(typingIntervalId);
    };
  }, [generatedCustomPrompt]);

  const handleCopyCustom = () => {"""
content = content.replace(effect_target, effect_replacement)

# 5. Update UI to show typing animation
ui_target = """                {/* Prompt full string content area */}
                <div className="bg-[#020204] border border-[#161622] rounded-xl p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-2 mb-2">
                    <span className="text-[10px] font-mono text-[#555577] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#25F4EE] animate-pulse" /> Prompt Customizado Gerado
                    </span>
                    <span className="text-[9px] font-mono text-[#444455]">
                      {generatedCustomPrompt.length} caracteres
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-[#A0A0C0] leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto select-all scrollbar-thin">
                    {generatedCustomPrompt}
                  </p>
                </div>"""
ui_replacement = """                {/* Prompt full string content area */}
                <div className="bg-[#020204] border border-[#161622] rounded-xl p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-2 mb-2">
                    <span className="text-[10px] font-mono text-[#555577] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#25F4EE] animate-pulse" /> {typingStatus} {isTyping && <span className="animate-pulse">...</span>}
                    </span>
                    <span className="text-[9px] font-mono text-[#444455]">
                      {typedPrompt.length} caracteres
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-[#A0A0C0] leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto select-all scrollbar-thin min-h-[100px]">
                    {typedPrompt}
                    {isTyping && <span className="w-1.5 h-3.5 inline-block bg-white ml-1 animate-pulse" />}
                  </p>
                </div>"""
content = content.replace(ui_target, ui_replacement)

with open("src/components/TemplateGallery.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Success")
