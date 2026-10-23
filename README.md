# Impulso Social — loja de serviços

## O que vem neste pacote
- `index.html`: catálogo responsivo com preços, serviços, seleção de quantidade e formulário de pedido.
- `assets/banner.png`: banner visual.
- O pedido é gerado como arquivo de texto. Para abrir o WhatsApp automaticamente, edite `index.html` e preencha `const waNumber=''` com o número comercial em formato internacional, somente dígitos (ex.: 55DDDNUMERO).

## Publicar no Cloudflare Pages (sem comando de build)
1. Descompacte o ZIP.
2. No GitHub, abra o repositório `Impulsosocial`.
3. Envie/substitua `index.html` e a pasta `assets` (com `banner.png`) na raiz do repositório e confirme as alterações.
4. No Cloudflare, abra Workers & Pages e selecione o projeto. Configure a origem do GitHub e a pasta raiz `/`.
5. Para um site estático como este, use **Build command vazio/None** e publique como Pages/static assets. Não use `npx wrangler deploy` para esta pasta HTML estática.
6. Abra a URL pública e teste os botões.

## Importante
- Os valores são os que foram colocados no catálogo conforme a imagem enviada.
- Este pacote não inclui gateway de pagamento, estoque de serviços, automação de entrega, banco de dados nem painel de administração.
- O formulário não envia pedido ao servidor. Antes de vender, configure o WhatsApp, confirme os serviços que realmente consegue entregar, prazos e políticas das plataformas.
- Não prometa resultados garantidos nem use credenciais dos clientes.
