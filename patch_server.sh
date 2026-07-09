sed -i '4525i \
// ---------------------------------------------------------\n\
// PRODUTOS EM ALTA (ADMIN)\n\
// ---------------------------------------------------------\n\
app.get("/api/admin/produtos-alta", (req, res) => {\n\
  res.json(dbState.produtos_alta || []);\n\
});\n\
app.post("/api/admin/produtos-alta", (req, res) => {\n\
  const { name, price, trend, tiktok_link } = req.body;\n\
  const newProduct = {\n\
    id: `prod-alta-${Date.now()}`,\n\
    name: name || "Produto Desconhecido",\n\
    price: price || "R$ 0,00",\n\
    trend: trend || "+0%",\n\
    tiktok_link: tiktok_link || "",\n\
    created_at: new Date().toISOString()\n\
  };\n\
  if (!dbState.produtos_alta) dbState.produtos_alta = [];\n\
  dbState.produtos_alta.push(newProduct);\n\
  res.json(newProduct);\n\
});\n\
app.delete("/api/admin/produtos-alta/:id", (req, res) => {\n\
  const { id } = req.params;\n\
  if (!dbState.produtos_alta) dbState.produtos_alta = [];\n\
  const index = dbState.produtos_alta.findIndex(p => p.id === id);\n\
  if (index !== -1) {\n\
    dbState.produtos_alta.splice(index, 1);\n\
    res.json({ success: true });\n\
  } else {\n\
    res.status(404).json({ error: "Not found" });\n\
  }\n\
});\n\
' server.ts
