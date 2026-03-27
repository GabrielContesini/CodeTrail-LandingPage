# Performance Budget

## Alvos pragmáticos

- `hero e auth`: LCP abaixo de `2.5s` em desktop e abaixo de `3.2s` em mobile intermediário.
- `interações`: INP abaixo de `200ms` nos CTAs principais.
- `motion`: animações decorativas não podem competir com legibilidade nem com o carregamento inicial.

## Pontos críticos observados

- Prova social redundante empurrava conteúdo importante e piorava o ritmo da página.
- Motion intenso em background sem gating consistente aumenta custo visual sem converter mais.
- Glassmorphism excessivo reduz contraste em painéis e feedbacks menores.

## Decisões aplicadas

- A narrativa da landing foi enxugada para concentrar hero, prova social principal, benefícios, planos e CTA final.
- O fundo com parallax usa camadas leves, pausa em aba inativa e reduz automaticamente em dispositivos sensíveis.
- Contraste de texto secundário e placeholders foi elevado para melhorar leitura em brilho baixo.
- Classes legadas isoladas foram removidas para reduzir dívida visual e facilitar manutenção.
