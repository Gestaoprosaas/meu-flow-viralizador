export interface ProdutoPronto {
  id: string;
  nome: string;
  link: string;
  valor: string;
  tendencia: 'em_alta' | 'muito_quente' | 'viral' | 'destaque';
  nicho?: string;
  imagem?: string;
  comissao?: string;
}

export const PRODUTOS_PRONTOS: ProdutoPronto[] = [
  {
    id: 'tt-1734328794865829770',
    nome: 'Saia Longa Feminina Suplex com Fenda Confortável Moda Gringa Casual Elegante',
    link: 'https://vt.tiktok.com/ZS9MJ1dEF3G49-VxyuJ/',
    valor: 'R$ 59,90',
    tendencia: 'viral',
    nicho: 'Moda',
    imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_686733-MLB98556735473_112025-F.webp',
    comissao: '10%'
  },
  {
    id: 'tt-1736006832172206018',
    nome: 'Baby Tee Feminino BRASIL GRANDE Copa Do Mundo Futebol',
    link: 'https://www.tiktok.com/view/product/1736006832172206018',
    valor: 'R$ 39,90',
    tendencia: 'muito_quente',
    nicho: 'Moda',
    imagem: 'https://http2.mlstatic.com/D_NQ_NP_852362-MLB112675739801_062026-O.webp',
    comissao: '10%'
  },
  {
    id: 'tt-1735795672285022052',
    nome: 'Conjunto Mila Feminino Blusa Assimétrica Manga Comprida + Calça Pantalona Malha Ribana Moda Inverno',
    link: 'https://www.tiktok.com/view/product/1735795672285022052',
    valor: 'R$ 89,90',
    tendencia: 'em_alta',
    nicho: 'Moda',
    imagem: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/16255e8edce048c38700263541e76097~tplv-aphluv4xwc-resize-png:630:630.png',
    comissao: '10%'
  },
  {
    id: 'tt-1734457838700693223',
    nome: 'Conjunto Branco De Luxo Cropped e Saia Feminina Nova Tendência',
    link: 'https://www.tiktok.com/view/product/1734457838700693223',
    valor: 'R$ 79,90',
    tendencia: 'viral',
    nicho: 'Moda',
    imagem: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/d181c33fb1a04b7b8f1dbcb7e60a6697~tplv-aphluv4xwc-resize-png:630:840.png',
    comissao: '10%'
  },
  {
    id: 'tt-1735383994749256799',
    nome: 'Casaco Feminino Colado Suplex Brasil Copa Estampado Time',
    link: 'https://www.tiktok.com/view/product/1735383994749256799',
    valor: 'R$ 49,90',
    tendencia: 'muito_quente',
    nicho: 'Moda',
    imagem: 'https://img.ltwebstatic.com/v4/j/spmp/2026/04/27/31/1777294302a78d64d00bde508a2798476a17e7b058_thumbnail_405x552.jpg',
    comissao: '10%'
  },
  {
    id: 'tt-1734849518614185477',
    nome: 'Macaquinho Feminino Fitness Curto Com Listras Laterais Gola Alta Lycra Ziper',
    link: 'https://www.tiktok.com/view/product/1734849518614185477',
    valor: 'R$ 69,90',
    tendencia: 'em_alta',
    nicho: 'Fitness',
    imagem: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/13627967b60c4eee94983f8bea0a5e42~tplv-o3syd03w52-resize-png:630:630.png',
    comissao: '10%'
  },
  {
    id: 'tt-1734638341575247274',
    nome: 'Vestido Curto Manga Longa com Fenda Suplex Premium Moda Gringa',
    link: 'https://www.tiktok.com/view/product/1734638341575247274',
    valor: 'R$ 64,90',
    tendencia: 'viral',
    nicho: 'Moda',
    imagem: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/0fdd640b177e4261a38523ffc9cc755f~tplv-aphluv4xwc-resize-png:630:839.png',
    comissao: '10%'
  },
  {
    id: 'tt-1732377645642187964',
    nome: 'Calça Boca de Sino Flare Bailarina Suplex Academia Cintura Alta',
    link: 'https://www.tiktok.com/view/product/1732377645642187964',
    valor: 'R$ 54,90',
    tendencia: 'muito_quente',
    nicho: 'Fitness',
    imagem: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/735302160a2045f795ed23ae420c366f~tplv-o3syd03w52-resize-png:630:630.png',
    comissao: '10%'
  },
  {
    id: 'tt-1731782218529670752',
    nome: 'Calça Jeans Feminina Wide Leg Cintura Alta Marmorizada Pantalona Boca Larga Premium',
    link: 'https://www.tiktok.com/view/product/1731782218529670752',
    valor: 'R$ 89,90',
    tendencia: 'viral',
    nicho: 'Moda',
    imagem: 'https://p16-oec-general.tiktokcdn.com/tos-maliva-i-o3syd03w52-us/8b3a3ed1641d40cf80fc20f33ae77ac8~tplv-o3syd03w52-resize-png:630:630.png',
    comissao: '10%'
  },
  {
    id: 'tt-1731253549015795410',
    nome: 'Calça Legging Esportiva Academia Yoga Tie Dye Aurora Levanta Bumbum Cintura Alta',
    link: 'https://www.tiktok.com/view/product/1731253549015795410',
    valor: 'R$ 59,90',
    tendencia: 'em_alta',
    nicho: 'Fitness',
    imagem: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/cd23711869104e6d8e1e9f908acf7e73~tplv-aphluv4xwc-resize-png:630:839.png',
    comissao: '10%'
  },
  {
    id: 'tt-1736066910351885738',
    nome: 'Conjunto Academia Letras Feminino Top e Short Esportivo',
    link: 'https://www.tiktok.com/view/product/1736066910351885738',
    valor: 'R$ 49,90',
    tendencia: 'muito_quente',
    nicho: 'Fitness',
    imagem: 'https://p16-oec-general.tiktokcdn.com/tos-alisg-i-aphluv4xwc-sg/252f32aa250d4f3e9b206a3d8b1d7e15~tplv-aphluv4xwc-resize-png:630:630.png',
    comissao: '10%'
  },
  {
    id: 'tt-1734648746290873770',
    nome: 'Vestido Longo Esther Suplex Premium Costa Nua',
    link: 'https://www.tiktok.com/view/product/1734648746290873770',
    valor: 'R$ 74,90',
    tendencia: 'viral',
    nicho: 'Moda',
    imagem: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/aff6c97350394f9e88ce617ac4b2b703~tplv-aphluv4xwc-resize-png:630:630.png',
    comissao: '10%'
  },
  {
    id: 'tt-1735846352675309358',
    nome: 'Corset Morcego Courinho Trançado Top Cropped Corselet Couro Fake com Barbatanas Feminino',
    link: 'https://www.tiktok.com/view/product/1735846352675309358',
    valor: 'R$ 69,90',
    tendencia: 'destaque',
    nicho: 'Moda',
    imagem: 'https://img.ltwebstatic.com/v4/p/spmp/2026/05/25/35/17796409264f27d971b4bc801e9c1d4b619e361286_thumbnail_560x.avif',
    comissao: '10%'
  },
  {
    id: 'tt-1733333212122219622',
    nome: 'Bermuda Estampa Dry Fit Masculina Esportiva Seca Rápida Respirável Verão',
    link: 'https://www.tiktok.com/view/product/1733333212122219622',
    valor: 'R$ 44,90',
    tendencia: 'em_alta',
    nicho: 'Fitness',
    imagem: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/f4e2ff63b80c44adb7d8403e24078f3e~tplv-aphluv4xwc-resize-png:630:630.png',
    comissao: '10%'
  },
  {
    id: 'tt-1732481693711304301',
    nome: 'Espelho Quebra Sol LED Retrovisor Carro Recarregável Para Maquiagem 3 Tons de Cor',
    link: 'https://www.tiktok.com/view/product/1732481693711304301',
    valor: 'R$ 49,90',
    tendencia: 'viral',
    nicho: 'Casa',
    imagem: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/156d87be17204ea2922b2c2f4c3794ef~tplv-o3syd03w52-resize-png:630:630.png',
    comissao: '10%'
  },
  {
    id: 'tt-1733219786209134263',
    nome: 'DJI Neo Mini Drone com Câmera UHD 2 Baterias Decolagem de Palma QuickShots Vídeo Estabilizado',
    link: 'https://www.tiktok.com/view/product/1733219786209134263',
    valor: 'R$ 799,90',
    tendencia: 'destaque',
    nicho: 'Tecnologia',
    imagem: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/c3929b2b9809401994ce64ab2f6c52a1~tplv-aphluv4xwc-resize-png:630:630.png',
    comissao: '10%'
  },
];
