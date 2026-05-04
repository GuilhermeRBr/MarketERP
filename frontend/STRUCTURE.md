# 📁 Estrutura do Projeto Frontend

## Árvore de Arquivos

```
app/
├── 📄 .env.example              # Exemplo de variáveis de ambiente
├── 📄 .eslintrc.json            # Configuração ESLint
├── 📄 .gitignore                # Arquivos ignorados pelo Git
├── 📄 INSTALL.md                # Guia de instalação
├── 📄 next.config.mjs           # Configuração Next.js
├── 📄 package.json              # Dependências e scripts
├── 📄 postcss.config.mjs        # Configuração PostCSS
├── 📄 README.md                 # Documentação principal
├── 📄 tailwind.config.ts        # Configuração Tailwind CSS
├── 📄 tsconfig.json             # Configuração TypeScript
│
├── 📁 app/                      # Rotas Next.js (App Router)
│   ├── 📄 globals.css          # Estilos globais
│   ├── 📄 layout.tsx           # Layout raiz
│   ├── 📄 page.tsx             # Página inicial
│   │
│   └── 📁 (dashboard)/         # Grupo de rotas com layout
│       ├── 📄 layout.tsx       # Layout do dashboard
│       │
│       ├── 📁 dashboard/       # Dashboard principal
│       │   └── 📄 page.tsx
│       │
│       ├── 📁 produtos/        # Módulo de produtos
│       │   └── 📄 page.tsx
│       │
│       ├── 📁 vendas/          # Módulo de vendas
│       │   └── 📄 page.tsx
│       │
│       ├── 📁 usuarios/        # Módulo de usuários
│       │   └── 📄 page.tsx
│       │
│       └── 📁 pagamentos/      # Módulo de pagamentos
│           └── 📄 page.tsx
│
├── 📁 components/              # Componentes React
│   ├── 📁 layout/             # Componentes de layout
│   │   ├── 📄 Header.tsx      # Cabeçalho
│   │   ├── 📄 MainLayout.tsx  # Layout principal
│   │   └── 📄 Sidebar.tsx     # Menu lateral
│   │
│   └── 📁 ui/                 # Componentes reutilizáveis
│       └── 📄 .gitkeep
│
├── 📁 hooks/                   # Custom hooks
│   └── 📄 .gitkeep
│
├── 📁 services/                # Integração com API
│   └── 📄 .gitkeep
│
├── 📁 types/                   # Tipos TypeScript
│   └── 📄 .gitkeep
│
└── 📁 utils/                   # Funções utilitárias
    └── 📄 .gitkeep
```

## 📝 Descrição dos Diretórios

### `/app` - Rotas Next.js
Contém todas as rotas da aplicação usando o App Router do Next.js 14.

**Estrutura:**
- `layout.tsx` - Layout raiz com configurações globais
- `page.tsx` - Página inicial (landing page)
- `globals.css` - Estilos globais com Tailwind

**Grupo `(dashboard)`:**
- Rotas protegidas que compartilham o mesmo layout
- Inclui: dashboard, produtos, vendas, usuários, pagamentos

### `/components` - Componentes React
Componentes reutilizáveis organizados por categoria.

**`/layout`:**
- `Sidebar.tsx` - Menu lateral com navegação
- `Header.tsx` - Cabeçalho com busca e perfil
- `MainLayout.tsx` - Composição do layout principal

**`/ui`:**
- Componentes de interface reutilizáveis
- Botões, inputs, modais, etc. (a ser implementado)

### `/services` - Integração com API
Camada de comunicação com o backend.

**Será implementado no STEP 2:**
- Configuração do Axios
- Serviços por módulo (products, users, sales, etc.)
- Interceptors para autenticação
- Tratamento de erros

### `/hooks` - Custom Hooks
Hooks personalizados para lógica reutilizável.

**Exemplos futuros:**
- `useAuth.ts` - Autenticação
- `useProducts.ts` - Gestão de produtos
- `useDebounce.ts` - Debounce para busca
- `useLocalStorage.ts` - Persistência local

### `/types` - Tipos TypeScript
Definições de tipos e interfaces.

**Exemplos futuros:**
- `Product.ts` - Tipo de produto
- `User.ts` - Tipo de usuário
- `Sale.ts` - Tipo de venda
- `Payment.ts` - Tipo de pagamento

### `/utils` - Funções Utilitárias
Funções auxiliares reutilizáveis.

**Exemplos futuros:**
- `formatCurrency.ts` - Formatação de moeda
- `formatDate.ts` - Formatação de data
- `validators.ts` - Validações
- `constants.ts` - Constantes da aplicação

## 🎨 Convenções de Nomenclatura

### Arquivos
- **Componentes**: PascalCase - `Sidebar.tsx`
- **Hooks**: camelCase com prefixo `use` - `useAuth.ts`
- **Services**: camelCase - `productService.ts`
- **Types**: PascalCase - `Product.ts`
- **Utils**: camelCase - `formatCurrency.ts`

### Pastas
- **Rotas**: kebab-case - `produtos/`, `usuarios/`
- **Componentes**: kebab-case - `layout/`, `ui/`
- **Outros**: camelCase - `services/`, `hooks/`

## 🔄 Fluxo de Dados

```
Componente (UI)
    ↓
Custom Hook
    ↓
Service (API)
    ↓
Backend (FastAPI)
    ↓
Database (PostgreSQL)
```

## 📦 Dependências Principais

```json
{
  "next": "^14.2.0",           // Framework React
  "react": "^18.3.0",          // Biblioteca React
  "typescript": "^5",          // TypeScript
  "tailwindcss": "^3.4.0",    // CSS Framework
  "axios": "^1.6.8",          // HTTP Client
  "@tanstack/react-query": "^5.28.0",  // State Management
  "lucide-react": "^0.363.0"  // Ícones
}
```

## 🚀 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm start        # Executar build de produção
npm run lint     # Verificar código
```

## 📍 Rotas da Aplicação

| Rota | Descrição | Status |
|------|-----------|--------|
| `/` | Página inicial | ✅ Criada |
| `/dashboard` | Dashboard principal | ✅ Criada |
| `/produtos` | Gestão de produtos | ✅ Criada |
| `/vendas` | Gestão de vendas | ✅ Criada |
| `/usuarios` | Gestão de usuários | ✅ Criada |
| `/pagamentos` | Gestão de pagamentos | ✅ Criada |
| `/login` | Autenticação | ⏳ STEP 3 |

## 🎯 Próximos Passos

1. **STEP 2** - Implementar camada de serviços
2. **STEP 3** - Implementar autenticação
3. **STEP 4** - Implementar CRUD de produtos
4. **STEP 5** - Implementar gestão de usuários
5. **STEP 6** - Implementar sistema de vendas
6. **STEP 7** - Implementar gestão de pagamentos
7. **STEP 8** - Implementar dashboard com estatísticas

---

**Estrutura criada no STEP 1 ✅**
