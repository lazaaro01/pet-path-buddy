# PetTracker

## Visão Geral

PetTracker é um sistema avançado para rastreamento de pets em tempo real, com mapas interativos, alertas inteligentes e histórico de trajetos.

## Stacks Utilizadas

- **Vite**: Bundler moderno para desenvolvimento rápido.
- **TypeScript**: Tipagem estática para JavaScript.
- **React**: Biblioteca para construção de interfaces.
- **shadcn-ui**: Componentes UI modernos e acessíveis.
- **Tailwind CSS**: Framework utilitário para estilização.
- **React Router**: Gerenciamento de rotas.
- **TanStack Query**: Gerenciamento de dados assíncronos.
- **Lucide Icons**: Ícones SVG.
- **date-fns**: Manipulação de datas.
- **leaflet**: Mapas interativos.
- **Radix UI**: Componentes acessíveis (usados via shadcn-ui).
- **Sonner**: Sistema de notificações.
- **eslint**: Linter para manter a qualidade do código.

## Instalação e Execução

### Pré-requisitos

- **Node.js** (recomendado versão 18+)
- **npm** (gerenciador de pacotes)

### Passos para rodar localmente

```sh
# 1. Clone o repositório
git clone <https://github.com/lazaaro01/pet-path-buddy>
cd <pet-path-buddy>

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080` (ou outra porta definida).

### Scripts principais

- `npm run dev`: Inicia o servidor de desenvolvimento com hot reload.
- `npm run build`: Gera a versão de produção.
- `npm run lint`: Executa o linter (ESLint).

## Estrutura de Pastas

- `src/`: Código-fonte principal.
  - `components/`: Componentes React reutilizáveis.
  - `hooks/`: Hooks customizados.
  - `lib/`: Utilitários.
  - `pages/`: Páginas principais.
  - `types/`: Tipos TypeScript.
- `public/`: Arquivos públicos (imagens, robots.txt, etc).
---
