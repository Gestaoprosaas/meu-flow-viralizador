import re

with open("src/components/ScreenProdutos.tsx", "r", encoding="utf-8") as f:
    content = f.read()

target = """  const [movementSelectedMode, setMovementSelectedMode] = useState<string>(MOVEMENTS_PRESETS[0]?.id || 'cta_beijo');"""

replacement = """  const [movementSelectedMode, setMovementSelectedMode] = useState<string>(MOVEMENTS_PRESETS[0]?.id || 'cta_beijo');
  const [skippingMessage, setSkippingMessage] = useState<string | null>(null);"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/components/ScreenProdutos.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
