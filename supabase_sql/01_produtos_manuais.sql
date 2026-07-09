CREATE TABLE IF NOT EXISTS produtos_manuais (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  imagem_url text,
  preco text,
  comissao text,
  link_afiliado text,
  tendencia text DEFAULT 'em_alta',
  nicho text DEFAULT 'Geral',
  ativo boolean DEFAULT true,
  criado_em timestamp DEFAULT now()
);

ALTER TABLE produtos_manuais ENABLE ROW LEVEL SECURITY;

-- Todos usuários autenticados podem LER
CREATE POLICY "Todos leem produtos manuais" ON produtos_manuais
FOR SELECT TO authenticated
USING (true);

-- Admins podem ESCREVER
CREATE POLICY "Admins gerenciam produtos manuais" ON produtos_manuais
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()::text
    AND profiles.role = 'admin'
  )
);
