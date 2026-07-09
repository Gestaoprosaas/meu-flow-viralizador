import re

with open("server.ts", "r", encoding="utf-8") as f:
    content = f.read()

get_endpoint = """app.get("/api/admin/produtos-alta", async (req, res) => {
  await syncFromSupabase("produtos_alta");
  res.json(dbState.produtos_alta || []);
});"""
content = re.sub(r'app.get\("/api/admin/produtos-alta", \(req, res\) => \{\n.*?res\.json.*?;\n\}\);', get_endpoint, content, flags=re.DOTALL)

post_endpoint = """app.post("/api/admin/produtos-alta", async (req, res) => {
  const { name, price, trend, tiktok_link } = req.body;
  const newProduct = {
    id: `prod-alta-${Date.now()}`,
    name: name || "Produto Desconhecido",
    price: price || "R$ 0,00",
    trend: trend || "+0%",
    tiktok_link: tiktok_link || "",
    created_at: new Date().toISOString()
  };
  if (!dbState.produtos_alta) dbState.produtos_alta = [];
  dbState.produtos_alta.push(newProduct);
  await syncWriteToSupabase("produtos_alta", newProduct, "insert");
  res.json(newProduct);
});"""
content = re.sub(r'app.post\("/api/admin/produtos-alta", \(req, res\) => \{.*?\n\}\);', post_endpoint, content, flags=re.DOTALL)

delete_endpoint = """app.delete("/api/admin/produtos-alta/:id", async (req, res) => {
  const { id } = req.params;
  if (!dbState.produtos_alta) dbState.produtos_alta = [];
  const index = dbState.produtos_alta.findIndex(p => p.id === id);
  if (index !== -1) {
    dbState.produtos_alta.splice(index, 1);
    await syncWriteToSupabase("produtos_alta", null, "delete", id);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});"""
content = re.sub(r'app.delete\("/api/admin/produtos-alta/:id", \(req, res\) => \{.*?\n\}\);', delete_endpoint, content, flags=re.DOTALL)

with open("server.ts", "w", encoding="utf-8") as f:
    f.write(content)
