import re

with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

target = """                {currentPath === '/treinamentos' && (
                  <ScreenTreinamentos"""

replacement = """                {currentPath === '/seguranca' && (
                  <ScreenSeguranca onNavigate={handleNavigate} />
                )}

                {currentPath === '/treinamentos' && (
                  <ScreenTreinamentos"""

content = content.replace(target, replacement)

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Success")
