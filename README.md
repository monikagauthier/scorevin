# Scorevin — página de vendas

Página estática (HTML/CSS/JS, sem build). Abra o `index.html` no navegador.

## Antes de publicar

1. O hero usa `assets/vin-hero.mp4` (vídeo animado) com `assets/vin-hero.jpg` como capa enquanto carrega.
   As demais ilustrações ficam em `assets/img/`, em WebP otimizado com duas larguras cada (ex.: `-400` e `-800`). Novas imagens devem ser convertidas antes de entrar na página: PNGs de 1–2 MB deixam o carregamento lento no celular.
   O `404.html` usa caminhos `/scorevin/...`; se o site passar a usar domínio próprio, troque por `/`.
2. Em `script.js`, preencha `CHECKOUT_URL` (link de pagamento) e `WHATSAPP_NUMBER` (ex.: `5511999999999`).
3. No rodapé do `index.html`, preencha razão social, CNPJ e contato, e aponte os links de Termos de Uso e Política de Privacidade para as páginas reais.
