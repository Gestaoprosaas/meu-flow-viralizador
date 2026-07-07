export interface Produto {
  id: string;
  nome: string;
  imagem: string;
  tags: string[];
  niche: string;
  preco: string;
  rating: string;
  scoreViralidade: number;
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
    id: "copa2026-camisa-brasil-001",
    nome: "Camisa Seleção Brasileira Copa 2026 Premium",
    imagem: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400",
    tags: ["Copa 2026", "Moda", "Futebol", "Brasil"],
    niche: "Esportes",
    preco: "89,90",
    rating: "4.9",
    scoreViralidade: 99,
    afiliado: {
      link: "https://shope.ee/camisa-brasil-copa2026",
      comissao: "8%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem torcedora animada vestindo a Camisa da Seleção Brasileira Copa 2026. Ela segura a camisa na frente do espelho e fala: "Gente, chegou a camisa do Brasil pra Copa! Olha o tecido, olha o acabamento — muito melhor do que eu esperava pelo preço! Corre que tá voando!" Fundo quarto decorado com cores verde e amarelo.`,
      pov: `Cena POV sobre cama com lençol branco. Mãos desembalando a Camisa da Seleção Brasileira, mostrando o bordado do escudo, o tecido dry-fit e o corte slim. Voz em off empolgada: "Chegou a camisa do Brasil pra Copa 2026! Tecido premium, escudo bordado e um corte que fica incrível no corpo. Esse é o presente perfeito pra qualquer torcedor!"`,
      movimento: `Avatar feminino animado segurando a Camisa Brasil Copa 2026, exibindo frente e verso com movimentos dinâmicos. Close no escudo bordado. Fundo verde e amarelo com confetes. Música animada de torcida ao fundo.`
    }
  },
  {
    id: "copa2026-kit-torcedor-002",
    nome: "Kit Torcedor Brasil 12 Itens Copa 2026",
    imagem: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400",
    tags: ["Copa 2026", "Kit", "Torcida", "Brasil"],
    niche: "Esportes",
    preco: "49,90",
    rating: "4.8",
    scoreViralidade: 98,
    afiliado: {
      link: "https://shope.ee/kit-torcedor-brasil-copa2026",
      comissao: "12%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem casal em casa abrindo o Kit Torcedor Brasil 12 itens. Eles tiram bandeira, corneta, óculos verde e amarelo, adesivos e boné. A menina grita: "Olha esse kit! Veio tudo junto por menos de cinquenta reais! Vocês precisam garantir antes do jogo!" Reação genuína e animada.`,
      pov: `Cena POV: mãos abrindo caixa do Kit Torcedor 12 Itens Brasil Copa 2026, mostrando item por item sobre mesa. Voz em off: "Olha tudo o que vem nesse kit: bandeira, corneta, óculos, adesivos, boné e mais! Tudo por menos de cinquenta reais. Perfeito pra assistir o Brasil com a família!"`,
      movimento: `Avatar feminino com boné do Brasil segurando cada item do kit e exibindo um a um com energia e animação. Cores verde e amarelo dominando o cenário. Música de torcida viral ao fundo.`
    }
  },
  {
    id: "copa2026-album-figurinhas-003",
    nome: "Álbum Copa do Mundo 2026 + 5 Envelopes Panini",
    imagem: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=400",
    tags: ["Copa 2026", "Figurinhas", "Colecionável", "Panini"],
    niche: "Entretenimento",
    preco: "34,90",
    rating: "4.9",
    scoreViralidade: 97,
    afiliado: {
      link: "https://shope.ee/album-copa-2026-panini",
      comissao: "10%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem abrindo envelopes de figurinhas da Copa 2026 com reação exagerada. Ele grita ao achar uma figurinha brilhante: "CARA! Achei o Vini Jr brilhante! Gente isso é vício demais, já to no décimo envelope!" Muito engajamento, comentários e compartilhamentos garantidos.`,
      pov: `Cena POV: mãos abrindo envelopes de figurinhas da Copa 2026 sobre mesa de madeira. Sons de papel rasgando claramente audíveis. Voz animada: "Olha só que figurinhas vieram! Cada envelope é uma surpresa. Garanta o seu álbum antes que esgote — tá voando em todo lugar!"`,
      movimento: `Avatar jovem empolgado segurando o Álbum Copa 2026 aberto, mostrando páginas preenchidas e depois abrindo um envelope ao vivo com reação animada. Transições rápidas entre cenas.`
    }
  },
  {
    id: "beleza-escova-eletrica-004",
    nome: "Escova Alisadora Elétrica 5 em 1 Profissional",
    imagem: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400",
    tags: ["Beleza", "Cabelo", "Elétrico", "Feminino"],
    niche: "Beleza",
    preco: "127,90",
    rating: "4.8",
    scoreViralidade: 95,
    afiliado: {
      link: "https://shope.ee/escova-alisadora-5em1",
      comissao: "15%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem no banheiro mostrando o antes e depois do cabelo usando a Escova Alisadora 5 em 1. Cabelo cacheado no início, liso e brilhante no final em menos de dois minutos. Ela fala: "Minha vida mudou com essa escova! Alisei em dois minutos sem precisar de progressiva. TEM QUE TER!"`,
      pov: `Cena POV: mãos passando a Escova Alisadora 5 em 1 no cabelo, mostrando o vapor saindo e o fio ficando liso instantaneamente. Close nas cerdas e na tela de temperatura. Voz em off: "Cinco funções em uma só escova: alisa, ondula, seca e dá brilho. Resultado de salão em casa, sem sair do pijama."`,
      movimento: `Avatar feminina com cabelo antes bagunçado passa a Escova 5 em 1 e o cabelo fica liso e brilhante em transição rápida. Close no produto com luz estúdio revelando os detalhes premium.`
    }
  },
  {
    id: "casa-air-fryer-mini-005",
    nome: "Air Fryer Mini 3,5L Digital Touch",
    imagem: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=400",
    tags: ["Casa", "Cozinha", "Eletrônico", "Air Fryer"],
    niche: "Casa",
    preco: "189,90",
    rating: "4.7",
    scoreViralidade: 93,
    afiliado: {
      link: "https://shope.ee/air-fryer-mini-digital",
      comissao: "10%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem na cozinha preparando batata frita na Air Fryer Mini enquanto fala: "Fiz batata frita SEM óleo em vinte minutos e ficou crocante demais! Essa air fryer mini cabe em qualquer canto e usa menos energia. Sem desculpa pra não comer saudável!" Mostra o resultado saindo da fritadeira.`,
      pov: `Cena POV: mãos colocando batatas temperadas na Air Fryer Mini 3.5L, fechando a gaveta e configurando no painel touch. Voz em off: "Sem óleo, sem fumaça, sem bagunça. Essa air fryer mini faz de tudo: frango, legumes, batata frita, até bolo! E ainda cabe na bancada pequena."`,
      movimento: `Avatar feminino abrindo a gaveta da Air Fryer Mini cheia de batatas douradas e crocantes, reagindo com expressão de quem aprova. Close no painel digital touch e no resultado final.`
    }
  },
  {
    id: "gadget-mini-aspirador-006",
    nome: "Mini Aspirador de Pó Mesa USB Portátil",
    imagem: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
    tags: ["Gadget", "Tecnologia", "Casa", "USB"],
    niche: "Tecnologia",
    preco: "39,90",
    rating: "4.6",
    scoreViralidade: 90,
    afiliado: {
      link: "https://shope.ee/mini-aspirador-usb",
      comissao: "20%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem no escritório mostrando migalhas no teclado e depois passando o Mini Aspirador USB que limpa tudo em segundos. Ela fala rindo: "Minha mesa era uma vergonha. Esse aspiradorinho USB mudou minha vida no home office! É tão pequeno que fica dentro da gaveta. Amei demais!"`,
      pov: `Cena POV: mãos passando o Mini Aspirador USB sobre teclado cheio de migalhas, mostrando o reservatório ficando cheio rapidamente. Voz em off: "Portátil, silencioso e recarrega pelo USB. Limpa teclado, mesa, carro e estante em segundos. O gadget que todo home office precisava."`,
      movimento: `Avatar masculino no escritório moderno exibindo o Mini Aspirador USB, demonstrando o uso no teclado e mostrando o reservatório transparente. Transições rápidas e dinâmicas.`
    }
  },
  {
    id: "skincare-protetor-solar-007",
    nome: "Protetor Solar Facial FPS 60 com Cor",
    imagem: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=400",
    tags: ["Beleza", "Skincare", "Protetor Solar", "Maquiagem"],
    niche: "Beleza",
    preco: "59,90",
    rating: "4.9",
    scoreViralidade: 96,
    afiliado: {
      link: "https://shope.ee/protetor-solar-fps60-cor",
      comissao: "18%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem fazendo skincare matinal e aplicando o Protetor Solar FPS 60 com Cor. Ela mostra que ficou sem aspecto branco e com leve cobertura natural: "Minha pele tá perfeita e protegida! FPS 60, não deixa aquele branco, ainda uniformiza o tom. Isso aqui é meu produto do ano! Quem usa sabe."`,
      pov: `Cena POV: mãos aplicando o Protetor Solar FPS 60 com Cor no rosto próximo ao espelho, mostrando a textura leve e a absorção rápida. Voz em off: "FPS 60, com cor, toque seco e zero aspecto branco. Protege do sol e ainda funciona como base leve. O produto favorito das dermatos no TikTok."`,
      movimento: `Avatar feminino com pele radiante aplicando o Protetor Solar FPS 60 e mostrando o resultado final com pele uniforme e brilhante. Close no frasco e na textura do produto.`
    }
  },
  {
    id: "casa-difusor-aromas-008",
    nome: "Difusor Umidificador Aromatizador LED 400ml",
    imagem: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=400",
    tags: ["Casa", "Decoração", "Aromaterapia", "LED"],
    niche: "Casa",
    preco: "69,90",
    rating: "4.7",
    scoreViralidade: 88,
    afiliado: {
      link: "https://shope.ee/difusor-umidificador-led",
      comissao: "22%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem no quarto escuro com o Difusor LED aceso, vapor saindo e luz colorida criando ambiente incrível para TikTok. Ela fala: "Esse difusor transformou meu quarto! Fica cheiroso, com aquele vapor lindo e ainda serve de luz noturna. Meus vídeos ficaram muito mais estéticos com ele de fundo!"`,
      pov: `Cena POV: mãos colocando gotas de óleo essencial no Difusor Umidificador LED e ligando. Vapor suave começa a sair enquanto a luz muda de cor automaticamente. Voz em off: "Umidifica o ar, aromatiza o ambiente e cria a vibe perfeita pro quarto. Modo noturno com luz LED muda de cor sozinho. Vale muito pelo preço."`,
      movimento: `Avatar feminino em quarto escuro com o Difusor LED aceso ao fundo, vapor saindo e cores mudando. Close no produto com vapor em slow motion. Música relaxante ao fundo.`
    }
  },
  {
    id: "fitness-corda-pular-009",
    nome: "Corda de Pular Profissional com Contador Digital",
    imagem: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400",
    tags: ["Fitness", "Esporte", "Treino", "Casa"],
    niche: "Fitness",
    preco: "44,90",
    rating: "4.7",
    scoreViralidade: 87,
    afiliado: {
      link: "https://shope.ee/corda-pular-contador-digital",
      comissao: "15%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem em casa pulando corda rapidamente e mostrando o contador digital no cabo: "Pulei mil vezes e nem vi a hora passar! Essa corda tem contador de pulos, calorias e tempo. Perfeito pra quem treina em casa sem gastar nada. Cardio intenso em dez minutos!"`,
      pov: `Cena POV: mãos segurando a Corda de Pular com contador digital, mostrando o display com número de pulos e calorias queimadas. Voz em off: "Contador digital de pulos, calorias e tempo. Cabo rolamentado que não enrola. O equipamento fitness favorito de quem treina em apartamento."`,
      movimento: `Avatar masculino fitness pulando corda em ritmo acelerado no estúdio. Close no display digital mostrando os números subindo. Transições em slow motion das passadas da corda.`
    }
  },
  {
    id: "gadget-luz-led-gaming-010",
    nome: "Fita LED RGB Inteligente 5m para Quarto e Setup",
    imagem: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400",
    tags: ["Gadget", "LED", "Decoração", "Gaming", "Setup"],
    niche: "Tecnologia",
    preco: "49,90",
    rating: "4.6",
    scoreViralidade: 92,
    afiliado: {
      link: "https://shope.ee/fita-led-rgb-inteligente",
      comissao: "18%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem gamer mostrando o quarto antes (sem iluminação) e depois com a Fita LED RGB instalada atrás do monitor e embaixo da cama. Ele fala: "Transformei meu setup com cinquenta reais! Controlo pelo celular, sincroniza com a música e tem mil cores. Virou outro ambiente!"`,
      pov: `Cena POV: mãos instalando a Fita LED RGB 5m atrás do monitor e controlando as cores pelo app no celular. Voz em off: "Cinco metros de LED RGB inteligente, controle pelo Wi-Fi, sincroniza com música e tem mais de duzentos efeitos. Transformou meu quarto e meu setup por menos de cinquenta reais."`,
      movimento: `Avatar masculino em setup gamer com a Fita LED RGB mudando de cor ao fundo. Close nas luzes em diferentes cores e modos. Música eletrônica sincronizada com os efeitos de luz.`
    }
  },
  {
    id: "moda-conjunto-fitness-011",
    nome: "Conjunto Fitness Feminino Calça + Top Academia",
    imagem: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400",
    tags: ["Moda", "Fitness", "Feminino", "Academia"],
    niche: "Moda",
    preco: "79,90",
    rating: "4.8",
    scoreViralidade: 91,
    afiliado: {
      link: "https://shope.ee/conjunto-fitness-feminino",
      comissao: "12%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem fazendo transição de roupa do dia a dia para o Conjunto Fitness: calça modeladora + top. Ela faz um giro na frente do espelho: "Esse conjunto modela, sustenta e ainda fica incrível! Fui pra academia e recebi elogio de todo mundo. O tecido é grosso, não marca e não desce. Aprovadíssimo!"`,
      pov: `Cena POV: mãos segurando o Conjunto Fitness, mostrando a textura do tecido modelador, o elástico interno da calça e as costuras reforçadas. Voz em off: "Tecido cirré modelador, cós duplo que não corta, top com bojo removível. Esse conjunto foi feito pra quem quer se sentir bem na academia e nas fotos."`,
      movimento: `Avatar feminina com o Conjunto Fitness Academia fazendo poses dinâmicas de treino. Close no tecido modelador e na silhueta. Iluminação de estúdio profissional valorizando as cores do conjunto.`
    }
  },
  {
    id: "cozinha-processador-usb-012",
    nome: "Mini Processador Triturador Recarregável USB",
    imagem: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=400",
    tags: ["Casa", "Cozinha", "Gadget", "USB"],
    niche: "Casa",
    preco: "29,90",
    rating: "4.7",
    scoreViralidade: 89,
    afiliado: {
      link: "https://shope.ee/processador-triturador-usb",
      comissao: "25%"
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem na cozinha picando alho, cebola e temperos no Mini Processador USB em segundos. Ela segura o produto na câmera: "Chega de choro na cozinha! Esse triturador recarregável picou meu alho em dois segundos. É pequenininho, lava fácil e recarrega pelo USB. PRECISA TER!"`,
      pov: `Cena POV: mãos colocando alho inteiro no Mini Processador USB, fechando e pressionando o botão. Em dois segundos o alho está perfeitamente picado. Voz em off: "Sem fio, recarregável via USB e com três lâminas de aço inox. Tritura alho, cebola, ervas e pimenta em segundos. O gadget de cozinha mais viral do TikTok!"`,
      movimento: `Avatar feminino em cozinha moderna demonstrando o Mini Processador USB triturando temperos com uma mão só. Close nas lâminas em aço e no resultado final. Transições rápidas e dinâmicas.`
    }
  }
];