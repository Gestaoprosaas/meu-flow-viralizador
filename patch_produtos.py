import re

with open("server.ts", "r", encoding="utf-8") as f:
    content = f.read()

target = """    console.log('[produtos] Lendo de:', filePath);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);"""

replacement = """    console.log('[produtos] Lendo de:', filePath);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Inject Custom Produtos em Alta
    const customProds = (dbState.produtos_alta || []).map((p: any) => ({
      id: p.id,
      nome: p.name,
      preco: p.price.replace('R$', '').trim(),
      imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300",
      tags: [p.trend, "Destaque"],
      niche: "Geral",
      rating: "5.0",
      afiliado: {
        link: p.tiktok_link,
        comissao: "Personalizada"
      }
    }));
    
    res.json([...customProds, ...data]);"""

if target in content:
    content = content.replace(target, replacement)
    with open("server.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Not found")
