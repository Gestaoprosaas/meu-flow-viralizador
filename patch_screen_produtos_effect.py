import re

with open("src/components/ScreenProdutos.tsx", "r", encoding="utf-8") as f:
    content = f.read()

target = """  }, []);

  // Generation status"""

replacement = """  }, []);

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
            setWizardStep(6);
          }, 1000);
        } catch (e) {}
      }
    }
  }, [wizardStep, videoMode]);

  // Generation status"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/components/ScreenProdutos.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
