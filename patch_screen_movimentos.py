import re

with open("src/components/ScreenMovimentos.tsx", "r", encoding="utf-8") as f:
    content = f.read()

target = """  const handleSelectMovement = (id: string) => {
    // Navigate to produtos passing the initial movement ID
    onNavigate('/produtos', { initialMovementId: id });
  };"""

replacement = """  const handleSelectMovement = (id: string) => {
    // Find the movement to save
    const movement = movementsList.find(m => m.id === id);
    if (movement) {
      localStorage.setItem('viralseller_movimento_pre', JSON.stringify(movement));
      localStorage.setItem('viralseller_video_mode', 'MOVIMENTO'); // ensure mode is set
    }
    onNavigate('produtos');
  };"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/components/ScreenMovimentos.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Not found")
