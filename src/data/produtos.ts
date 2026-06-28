export interface Produto {
  id: string;
  nome: string;
  imagem: string;
  tags: string[];
  niche: string;
  preco: string;
  rating: string;
  afiliado: {
    link: string;
    comissao: string;
  };
  prompts: {
    ugc: string;
    pov: string;
    movimento: string;
  };
}

export const PRODUTOS_EM_ALTA: Produto[] = [
  {
    id: "1735089994906043782",
    nome: "Escova de Cabelo Elétrica XYZ",
    imagem: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400",
    tags: ["Beleza", "Cabelo", "Eletrônico"],
    niche: "Beleza",
    preco: "89,90",
    rating: "4.8",
    afiliado: {
      link: "https://shop.tiktok.com/view/product/1735089994906043782",
      comissao: "10%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem mulher segura a Escova Elétrica XYZ em um ambiente de sala iluminado. Estilo selfie, sorriso natural. Ela diz diretamente para a câmera: "Tenho usado a Escova XYZ há uma semana e meu cabelo nunca esteve tão brilhante e macio! Você precisa experimentar também!"`,
      pov: `Cena POV sobre bancada de mármore limpa. Mãos femininas claras seguram a Escova XYZ, mostrando de perto o produto contra a luz natural. Voz em off descreve: "Esta escova elétrica dá brilho instantâneo ao seu cabelo. Sua tecnologia única alisa sem danos." O estilo é realista e editorial.`,
      movimento: `Avatar masculino confiante em estúdio moderno. Ele levanta a Escova XYZ e faz um giro suave para mostrar diferentes ângulos enquanto música animada toca ao fundo. Câmera faz zoom dinâmico no produto quando o avatar destaca: "Veja como a XYZ elimina o frizz em segundos!"`
    }
  },
  {
    id: "1735089994906043783",
    nome: "Fone Sem Fio Z",
    imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
    tags: ["Eletrônicos", "Áudio", "Gadgets"],
    niche: "Tecnologia",
    preco: "129,90",
    rating: "4.7",
    afiliado: {
      link: "https://shop.tiktok.com/view/product/1735089994906043783",
      comissao: "12%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16, estilo selfie. Jovem segura o Fone Sem Fio Z sobre o sofá da sala. Ela sorri e fala naturalmente para a câmera: "Eu adoro meu Fone Z, o som é super limpo e ele nem pesa na orelha. Dá pra usar o dia inteiro sem incômodo. Recomendo muito!". Cenário aconchegante, luz suave.`,
      pov: `Cena POV: câmera aponta para baixo mostrando uma bancada de madeira clara. Mãos femininas seguram o Fone Z de forma que seja visível o logo e os botões. O ambiente é bem iluminado, com fundo desfocado. Uma narração suave diz: "Este fone Z tem cancelamento de ruído ativo e bateria de longa duração. Ideal para quem ama música!"`,
      movimento: `Avatar masculino elegante em estúdio claro. Ele coloca o Fone Z em volta do pescoço e o levanta perto da câmera, fazendo um giro de 360° no lugar. Close-ups intercalam mostrando o produto de diferentes ângulos. Música moderna toca enquanto o avatar aponta características: "Som potente, design compacto e bateria para o dia todo!"`
    }
  },
  {
    id: "1735089994906043784",
    nome: "Mini Processador Triturador de Alimentos USB",
    imagem: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=400",
    tags: ["Casa", "Cozinha", "Eletrônicos"],
    niche: "Casa",
    preco: "29,90",
    rating: "4.6",
    afiliado: {
      link: "https://shop.tiktok.com/view/product/1735089994906043784",
      comissao: "25%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem criadora sorridente na sua cozinha segurando o Mini Processador USB. Ela aperta o botão e mostra temperos sendo fatiados instantaneamente. Ela diz: "Olha a facilidade disso aqui! Chega de chorar cortando cebola. Super rápido e prático de limpar, recomendo!"`,
      pov: `Cena POV em bancada de mármore. Mãos masculinas seguram o Mini Processador USB, removem a tampa mostrando as 3 lâminas e trituram alho em 5 segundos. Voz em off: "Esse processador USB recarregável tritura seus temperos na hora sem esforço. Compacto, potente e limpo."`,
      movimento: `Avatar feminino em estúdio escandinavo moderno. Ela segura o Mini Processador sobre a mesa, gesticulando e sorrindo. O vídeo corta para closes dinâmicos em slow motion do processamento de vegetais sob luz suave de estúdio.`
    }
  },
  {
    id: "1735089994906043785",
    nome: "Sunset Lamp LED Estética 16 Cores",
    imagem: "https://images.unsplash.com/photo-1507608077129-56e32842fcdb?auto=format&fit=crop&q=80&w=400",
    tags: ["Tecnologia", "Luzes", "Decoração"],
    niche: "Tecnologia",
    preco: "34,90",
    rating: "4.5",
    afiliado: {
      link: "https://shop.tiktok.com/view/product/1735089994906043785",
      comissao: "20%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem no quarto escuro acende a Sunset Lamp. O ambiente fica banhado por um tom dourado e avermelhado fantástico. Ela diz: "Deixou meu quarto com uma vibe incrível e perfeita para tirar fotos e fazer meus tiktoks. É muito linda!"`,
      pov: `Cena POV: mãos posicionando a Sunset Lamp sobre uma mesa gamer, usando o controle remoto para trocar as cores (azul, violeta, dourado). Voz em off: "Crie cenários cinematográficos em segundos. Sunset Lamp com 16 tonalidades para elevar o visual de qualquer gravação."`,
      movimento: `Avatar masculino em estúdio moderno, ajustando a position da Sunset Lamp em 180° enquanto a luz projeta auréolas de cores vivas nas paredes. Close-ups de transição focando no design metálico de alta durabilidade.`
    }
  }
];
