import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { GoogleGenAI } from '@google/genai';
import { withCreditsCheck } from '../../../lib/supabase/creditsMiddleware';

async function handleGenerate(request: Request, user: any) {
  try {
    const supabase = await createClient();

    const body = await request.json();
    const { 
      productName, 
      description, 
      targetAudience, 
      mainPain, 
      mainDesire, 
      tone, 
      platform, 
      duration,
      projectId 
    } = body;

    if (!productName || !description) {
      return NextResponse.json({ error: 'Os campos nome do produto e descrição são obrigatórios.' }, { status: 400 });
    }

    // Define standard systemPrompt & userPrompt
    const systemPrompt = `
Você é um copywriter sênior especialista em marketing de afiliados, lançamentos e vídeos virais para TikTok Shop, Instagram Reels e YouTube Shorts no Brasil.
Sua missão é gerar roteiros autênticos, engraçados ou urgentes que convertem de forma extraordinária.
Use linguagem coloquial brasileira legítima (gírias do dia a dia, humor sutil, interjeições como 'mano', 'véi', 'olha isso', 'sério').
Sempre responda exclusivamente com um objeto JSON absoluto válido contendo a estrutura pedida. Nunca inclua textos adicionais de início ou tags markdown fora do JSON.
`;

    const userPrompt = `
Crie uma campanha viral completa com roteiros persuasivos para o seguinte produto:
PRODUTO: ${productName}
DESCRIÇÃO: ${description}
PÚBLICO-ALVO: ${targetAudience || 'Afiliados de compras rápidas'}
DOR PRINCIPAL: ${mainPain || 'Problemas sem praticidade e preço alto'}
DESEJO PRINCIPAL: ${mainDesire || 'Praticidade, estilo de vida e facilidade'}
TOM DE VOZ: ${tone || 'empolgante'}
PLATAFORMA DESTINO: ${platform || 'tiktok'}
DURAÇÃO APROXIMADA: ${duration || '30s'}

Retorne EXATAMENTE esta estrutura JSON:
{
  "hook": "Gancho matador do Roteiro principal (primeiros 3 segundos)",
  "problema": "Construção da dor em uma frase de impacto (5 a 10s)",
  "solucao": "Revelação criativa do produto focado nos diferenciais (10 a 15s)",
  "prova": "Prova social ou garantia rápida de entrega hoje",
  "cta": "Chamada para ação clara direcionando para o clique da sacola",
  "script_completo": "Todo o escopo narrado do roteiro principal com indicações de cena entre colchetes como [CORTA PARA PRODUTO EM AÇÃO], [REAGINDO COM SURPRESA]",
  "legenda_sugerida": "Legenda pronta com hashtags de engajamento do TikTok Shop",
  "variacoes": [
    {
      "hook": "Gancho do Roteiro Alternativo 1 de curiosidade",
      "script_completo": "Transição de roteiro alternativo 1 completo com as marcações de filmagem em colchetes",
      "cta": "CTA alternativo pedindo para comentar QUERO no vídeo"
    },
    {
      "hook": "Gancho do Roteiro Alternativo 2 provocativo e direto",
      "script_completo": "Transição de roteiro alternativo 2 completo com as marcações de filmagem em colchetes",
      "cta": "CTA alternativo estimulando escassez profunda"
    }
  ],
  "dicas_gravacao": [
    "Dica essencial de filmagem 1",
    "Dica essencial de iluminação 2"
  ]
}
`;

    let generatedJSON: any = null;
    const openAIKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // A. Query OpenAI if API Key present
    if (openAIKey && openAIKey.startsWith('sk-')) {
      try {
        console.log('Utilizando OpenAI GPT-4o para geração...');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.85
          })
        });

        if (response.ok) {
          const completion = await response.json();
          const rText = completion.choices[0].message.content;
          generatedJSON = JSON.parse(rText);
        } else {
          console.error('Falha de resposta da OpenAI:', await response.text());
        }
      } catch (err) {
        console.error('Erro de conexão OpenAI:', err);
      }
    }

    // B. Fallback to Gemini API if OpenAI isn't configured or failed
    if (!generatedJSON && geminiKey) {
      try {
        console.log('Utilizando Gemini para geração de roteiro...');
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.85
          }
        });

        const text = geminiResponse.text || '{}';
        const cleaned = text.trim().substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        generatedJSON = JSON.parse(cleaned);
      } catch (err) {
        console.error('Erro ao gerar com Gemini:', err);
      }
    }

    // C. Static Template Fallback as safe mode
    if (!generatedJSON) {
      console.log('Utilizando fallback estático para salvar experiência do usuário...');
      generatedJSON = {
        hook: `Chocado com o que esse ${productName} consegue fazer! 😱`,
        problema: `Se você sofre porque ${mainPain || 'não tem tempo e vive cansado'}, você sabe que comprar soluções caras não resolve nada de verdade e só queima seu dinheiro.`,
        solucao: `É por isso que todo mundo na Shopee tá comprando isso aqui. Conta com tecnologia integrada, design ultra ergonômico e resolve sua vida em minutos.`,
        prova: `Já são mais de 10 mil unidades enviadas com avaliação máxima e frete grátis pra todo o Brasil neste mês.`,
        cta: `Clica agora no botão abaixo ou corre no link exclusivo da minha bio para garantir o seu com 45% de desconto cupom garantido!`,
        script_completo: `[NARRADOR SEGURA O PRODUTO APONTANDO PARA A CÂMERA] Chocado com o que esse ${productName} consegue fazer! [TRANSICÃO RÁPIDA COM ZOOM NO BOTÃO] Se você sofre porque ${mainPain || 'vive esgotado'}, você sabe o estresse que é. [NARRADOR SUSPIRA] É por isso que todo mundo na Shopee tá comprando isso. [MOSTRA PRODUTO FUNCIONANDO COM MÚSICA ANIMADA] Ele faz tudo automático. Já são 10 mil vendidos! [APONTA PRA BAIXO COM TEXTO NA TELA: LINK COM FRETE GRÁTIS]. Corre no link!`,
        legenda_sugerida: `O verdadeiro achadinho que vai salvar a sua rotina! 🛒✨ Link seguro na bio com desconto e frete grátis por tempo limitado! Comente QUERO se você quer o link no direct 👇 #achadosshopee #comprinhas #organizaçao #${productName.toLowerCase().replace(/\s+/g, '')}`,
        variacoes: [
          {
            hook: `Não compre o ${productName} sem ver esse aviso importante! ⚠️`,
            script_completo: `[TEXTO GRANDE PISCANDO] Não compre isso sem ver esse aviso! Todo mundo acha que é só mais um item comum, mas a verdade é que ele economiza horas do seu dia. Você só precisa ligar e deixar acontecer. É surreal. O link tá na bio, digite QUERO que eu te mando.`,
            cta: `Digite QUERO nos comentários para receber o link com desconto de 45%!`
          },
          {
            hook: `O dia que eu decidi testar esse tal de ${productName} mais falado do TikTok...`,
            script_completo: `[EFEITO DE FADE IN, MOSTRA PRODUTO NA CAIXA] Eu decidi testar esse tal produto pra ver se é tudo isso mesmo. E o resultado me chocou de verdade. A praticidade dele é incrível, o preço tá ridículo de barato. Vale cada centavo! Garanta o seu no link azul.`,
            cta: `Garanta o seu com desconto no link seguro fixado na bio!`
          }
        ],
        dicas_gravacao: [
          "Use iluminação natural ou ring light na frente para destacar os detalhes do produto.",
          "Faça cortes rápidos a cada 2 ou 3 segundos para manter a retenção do espectador lá no alto."
        ]
      };
    }

    // 4. Deduct exactly 1 credit from user profile using RPC
    const { data: rpcSuccess } = await supabase.rpc('decrement_credit', {
      user_id: user.id,
      credit_type: 'text'
    });

    if (!rpcSuccess) {
      console.warn('RPC decrement_credit failed. Performing manual fallback decrement.');
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits_text')
        .eq('id', user.id)
        .single();
      if (profile) {
        const fallbackCredits = Math.max(0, profile.credits_text - 1);
        await supabase
          .from('profiles')
          .update({ credits_text: fallbackCredits })
          .eq('id', user.id);
      }
    }

    // Retrieve updated credit balance
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('credits_text')
      .eq('id', user.id)
      .single();

    const finalCreditsText = updatedProfile?.credits_text ?? 0;

    // 5. Store completed result to script_generations table
    const { data: savedScript, error: insertError } = await supabase
      .from('script_generations')
      .insert({
        user_id: user.id,
        project_id: projectId || null,
        product_name: productName,
        target_audience: targetAudience || null,
        main_pain: mainPain || null,
        main_desire: mainDesire || null,
        tone: tone,
        platform: platform,
        hook: generatedJSON.hook,
        script_body: generatedJSON.script_completo || generatedJSON.solucao || '',
        cta: generatedJSON.cta,
        variations: generatedJSON.variacoes || []
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao registrar geração de roteiro no Supabase:', insertError);
    }

    return NextResponse.json({
      success: true,
      script: {
        id: savedScript?.id || `script-mock-${Date.now()}`,
        productName,
        hook: generatedJSON.hook,
        scriptBody: generatedJSON.script_completo || generatedJSON.solucao || '',
        cta: generatedJSON.cta,
        variations: {
          alternate_hook_1: generatedJSON.variacoes?.[0]?.hook || '',
          alternate_cta_1: generatedJSON.variacoes?.[0]?.cta || '',
          alternate_hook_2: generatedJSON.variacoes?.[1]?.hook || ''
        },
        platform
      },
      creditsLeft: finalCreditsText
    });

  } catch (err: any) {
    console.error('Route generation unhandled processing error:', err);
    return NextResponse.json({ error: err.message || 'Falha ao processar solicitação' }, { status: 500 });
  }
}

export const POST = withCreditsCheck(handleGenerate, 'text');

