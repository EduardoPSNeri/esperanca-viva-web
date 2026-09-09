# ONG Esperança Viva

Site institucional estático desenvolvido como projeto de front-end para apresentar a ONG fictícia **Esperança Viva**, divulgar projetos sociais e demonstrar um fluxo de cadastro de interesse para voluntariado com persistência local no navegador.

## Visão geral

O projeto utiliza **HTML5, CSS3 e JavaScript puro**, sem frameworks e sem dependências externas. A aplicação é formada por três páginas:

- `index.html` — apresentação institucional, missão, história, equipe e transparência;
- `projetos.html` — projetos, voluntariado e informações de doação;
- `cadastro.html` — formulário de interesse e listagem dos cadastros salvos no navegador.

> **Importante:** este é um projeto demonstrativo. Não existe back-end, banco de dados ou envio real do formulário. Os dados cadastrados ficam apenas no `LocalStorage` do navegador utilizado.

## Funcionalidades

- Layout responsivo para desktop, tablet e celular;
- navegação consistente entre páginas;
- estrutura semântica e melhorias de acessibilidade;
- formulário com validação nativa e feedback visual;
- máscara de telefone;
- prevenção de cadastro duplicado por e-mail no mesmo navegador;
- persistência local de voluntários;
- remoção individual e limpeza dos cadastros locais;
- renderização segura da tabela via DOM, sem interpolação de dados do usuário em `innerHTML`;
- links de transparência para os PDFs incluídos no repositório;
- ano do rodapé atualizado automaticamente.

## Tecnologias

| Área | Tecnologia |
| --- | --- |
| Estrutura | HTML5 semântico |
| Estilos | CSS3 responsivo |
| Interatividade | JavaScript ES6+ / DOM API |
| Persistência | Web Storage (`LocalStorage`) |
| Versionamento | Git e GitHub |

## Estrutura

```text
esperanca-viva-web/
│
├── index.html
├── projetos.html
├── cadastro.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── img/
│   ├── vol.webp
│   ├── aularef.webp
│   ├── logo-header.webp
│   ├── logo-circle.webp
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   └── android-chrome-192.png
│
├── docs/
│   ├── Prestacao_de_Contas_2024.pdf
│   └── Relatorio_Anual_2024.pdf
│
└── README.md
```

## Executando localmente

### Opção 1 — abrir diretamente

Abra o arquivo `index.html` no navegador.

### Opção 2 — servidor local

Com Python instalado:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Clonar o repositório

```bash
git clone https://github.com/EduardoPSNeri/esperanca-viva-web.git
cd esperanca-viva-web
```

## Decisões da refatoração

A versão refatorada corrige problemas da implementação anterior e reduz riscos comuns em aplicações front-end:

- remoção de IDs HTML duplicados no formulário;
- correção dos rótulos invertidos dos documentos de transparência;
- substituição da renderização de dados com `innerHTML` por criação segura de elementos DOM;
- tratamento de falhas ao ler ou gravar o `LocalStorage`;
- retirada de CPF, endereço completo e data de nascimento do cadastro inicial demonstrativo, reduzindo coleta desnecessária de dados pessoais;
- reorganização completa do CSS, removendo duplicações e seletores sem uso;
- melhoria de contraste, foco visível, navegação por teclado e suporte a `prefers-reduced-motion`;
- correção da documentação: o projeto é multipágina, e não uma SPA.

## Limitações atuais

Para uso real por uma ONG, ainda seriam necessários:

- API e banco de dados;
- autenticação e autorização;
- política de privacidade e base legal adequada para tratamento de dados pessoais;
- proteção contra abuso e spam;
- validação no servidor;
- serviço real de envio/gestão de inscrições;
- otimização das imagens para reduzir o peso da página.

## Autor

Desenvolvido por **Eduardo Neri** como projeto de estudo e portfólio.
