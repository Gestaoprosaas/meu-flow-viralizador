export interface PromptMovimento {
  movimentoId: string; // deve bater com o id em prompts.ts
  nome: string;
  prompt: string;
}

export const PROMPTS_MOVIMENTO: PromptMovimento[] = [
  {
    movimentoId: "cta_beijo",
    nome: "CTA Beijo",
    prompt: ""
  },
  {
    movimentoId: "hook_tapar_camera",
    nome: "Hook Tapar Câmera",
    prompt: ""
  },
  {
    movimentoId: "hook_andando_pacote",
    nome: "Hook Andando com Pacote TikTok",
    prompt: ""
  },
  {
    movimentoId: "hook_roupa_passinho",
    nome: "Hook Roupa Passinho Frente",
    prompt: ""
  },
  {
    movimentoId: "hook_apresentacao_fashion",
    nome: "Hook Apresentação Fashion",
    prompt: ""
  },
  {
    movimentoId: "selfie_cabelo",
    nome: "Selfie Cabelo",
    prompt: ""
  },
  {
    movimentoId: "espelho_textura",
    nome: "Espelho Textura",
    prompt: ""
  },
  {
    movimentoId: "mostrando_look_cta",
    nome: "Mostrando Look + CTA",
    prompt: ""
  },
  {
    movimentoId: "passando_produto_rosto",
    nome: "Passando Produto no Rosto",
    prompt: ""
  },
  {
    movimentoId: "giro_lento_360",
    nome: "Giro Lento 360 Controlled",
    prompt: ""
  },
  {
    movimentoId: "pov_capinha",
    nome: "POV Capinha",
    prompt: ""
  },
  {
    movimentoId: "pov_sapatos",
    nome: "POV Sapatos",
    prompt: ""
  },
  {
    movimentoId: "pov_produto_pequeno",
    nome: "POV Produto Pequeno",
    prompt: ""
  },
  {
    movimentoId: "mesclagem_tiktok_shop",
    nome: "Mesclagem Pacote TikTok Shop",
    prompt: ""
  },
  {
    movimentoId: "espelho_academia",
    nome: "Espelho na Academia",
    prompt: ""
  },
  {
    movimentoId: "espelho_provador",
    nome: "Espelho Provador",
    prompt: ""
  },
  {
    movimentoId: "selfie_qualquer_produto",
    nome: "Selfie com Qualquer Produto",
    prompt: ""
  },
  {
    movimentoId: "selfie_proximo_rosto",
    nome: "Selfie Próximo ao Rosto",
    prompt: ""
  },
  {
    movimentoId: "selfie_jaqueta_couro",
    nome: "Selfie Jaqueta de Couro",
    prompt: ""
  },
  {
    movimentoId: "look_casual",
    nome: "Look Casual",
    prompt: ""
  },
  {
    movimentoId: "torcedora_brasil_premium",
    nome: "Torcedora Brasil Premium",
    prompt: ""
  },
  {
    movimentoId: "cenario_quarto_casual",
    nome: "Cenário Quarto Casual",
    prompt: ""
  },
  {
    movimentoId: "estilo_casual_home",
    nome: "Estilo Casual Home",
    prompt: ""
  },
  {
    movimentoId: "selfie_espelho_elegante",
    nome: "Selfie Espelho Elegante",
    prompt: ""
  },
  {
    movimentoId: "torcedora_brasil",
    nome: "Torcedora Brasil",
    prompt: ""
  }
];

// Função helper para buscar prompt pelo id do movimento
export function getPromptPorMovimento(movimentoId: string): string {
  const normalizedId = movimentoId.replace(/-/g, '_').toLowerCase();
  const found = PROMPTS_MOVIMENTO.find(p => p.movimentoId.replace(/-/g, '_').toLowerCase() === normalizedId);
  return found?.prompt || '';
}
