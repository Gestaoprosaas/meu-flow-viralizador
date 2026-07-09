import re

with open("src/components/ScreenProdutos.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add skippingMessage state
state_target = """  const [movementSelectedMode, setMovementSelectedMode] = useState<string>(MOVEMENTS_PRESETS[0]?.id || 'cta_beijo');"""
state_replacement = """  const [movementSelectedMode, setMovementSelectedMode] = useState<string>(MOVEMENTS_PRESETS[0]?.id || 'cta_beijo');
  
  const [skippingMessage, setSkippingMessage] = useState<string | null>(null);"""
content = content.replace(state_target, state_replacement)

# Add useEffect for skipping
effect_target = """  // Handle copy text functionality"""
effect_replacement = """  // Check for pre-selected avatar or movement to skip steps
  useEffect(() => {
    if (wizardStep === 2) {
      const preAvatarStr = localStorage.getItem('viralseller_avatar_pre');
      if (preAvatarStr) {
        try {
          const preAvatar = JSON.parse(preAvatarStr);
          setSelectedAvatarId(preAvatar.id);
          setAvatarText(preAvatar.description || '');
          setSkippingMessage(`✅ Avatar: ${preAvatar.nome} (pré-selecionado)`);
          localStorage.removeItem('viralseller_avatar_pre');
          
          setTimeout(() => {
            setSkippingMessage(null);
            // Advancing to step 3 as requested
            setWizardStep(3);
          }, 1000);
        } catch (e) {}
      }
    }

    if (wizardStep === 5 && videoMode === 'MOVIMENTO') {
      const preMovStr = localStorage.getItem('viralseller_movimento_pre');
      if (preMovStr) {
        try {
          const preMov = JSON.parse(preMovStr);
          setMovementSelectedMode(preMov.id);
          if (preMov.prompt) setMovementText(preMov.prompt);
          setSkippingMessage(`✅ Movimento: ${preMov.name || 'Personalizado'} (pré-selecionado)`);
          localStorage.removeItem('viralseller_movimento_pre');
          
          setTimeout(() => {
            setSkippingMessage(null);
            setWizardStep(6); // Skip to generated prompt step
          }, 1000);
        } catch (e) {}
      }
    }
  }, [wizardStep, videoMode]);

  // Handle copy text functionality"""
content = content.replace(effect_target, effect_replacement)

# Inject skippingMessage UI
ui_target = """            {/* STEP 2: MULTI-MODE DELEGATOR */}"""
ui_replacement = """            {/* SKIPPING MESSAGE OVERLAY */}
            {skippingMessage && (
              <div className="absolute inset-0 z-50 bg-[#0B0B11]/90 backdrop-blur-sm flex items-center justify-center animate-fade-in rounded-3xl">
                <div className="bg-[#1E1E2E] border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm">
                  {skippingMessage}
                </div>
              </div>
            )}

            {/* STEP 2: MULTI-MODE DELEGATOR */}"""
content = content.replace(ui_target, ui_replacement)

with open("src/components/ScreenProdutos.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Success")
