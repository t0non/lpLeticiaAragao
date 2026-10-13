# Letícia Nogueira Aragão

Landing page da psicóloga Letícia Nogueira Aragão, CRP 04/26390, com atendimento presencial em Belo Horizonte e on-line. Conteúdo baseado na apresentação profissional fornecida pelo usuário.

## Executar

- `npm run dev`: inicia o preview em http://localhost:5173/ e procura outra porta caso esteja ocupada.
- `npm run check`: verifica a sintaxe do JavaScript.
- `npm run build`: gera a versão estática em `dist/`.

Também é possível abrir `index.html` diretamente no navegador.

## Estrutura

- `index.html`: todas as seções da página.
- `styles.css`: composição, cores e adaptações para celular.
- `app.js`: carrosséis, abas, contato e privacidade.
- `assets/`: imagens, fontes e biblioteca de ícones locais.
- `assets/sources.json`: URLs de origem dos arquivos baixados.

A estrutura visual e a fonte principal foram preservadas do modelo. Os retratos, depoimentos, credenciais, endereços e contatos da profissional anterior foram retirados da página. Permanecem apenas imagens ilustrativas de relações familiares, sem apresentá-las como retratos da Letícia ou fotos de seu consultório.

Todos os botões de WhatsApp apontam para (32) 98804-2418. O endereço presencial e a disponibilidade são confirmados pelo contato, pois não foram fornecidos detalhes de localização. A página não usa mapas externos, rastreadores ou ferramentas de análise de visitas e mantém `noindex,nofollow`.

## Verificação

O script `tools/verify.cjs` usa o Playwright fornecido pelo ambiente local do Codex. Ele verifica a identificação profissional, a ausência dos dados antigos, o destino dos contatos, os carrosséis, as abas, o FAQ, a privacidade, as imagens e o encaixe dos textos em 320, 390, 768, 1440 e 1920 px. As capturas e o relatório ficam em `.reference/`, fora da versão de distribuição.
