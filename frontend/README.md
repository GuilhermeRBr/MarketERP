# Mercadinho GR - Frontend

Frontend moderno desenvolvido com Next.js, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Query** (para gerenciamento de estado e cache)
- **Axios** (para requisições HTTP)
- **Lucide React** (ícones)

## 📁 Estrutura de Pastas

```
app/
├── app/                      # Rotas e páginas (App Router)
│   ├── (dashboard)/         # Grupo de rotas com layout
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── produtos/        # Gestão de produtos
│   │   ├── vendas/          # Gestão de vendas
│   │   ├── usuarios/        # Gestão de usuários
│   │   ├── pagamentos/      # Gestão de pagamentos
│   │   └── layout.tsx       # Layout do dashboard
│   ├── layout.tsx           # Layout raiz
│   ├── page.tsx             # Página inicial
│   └── globals.css          # Estilos globais
├── components/              # Componentes React
│   ├── layout/             # Componentes de layout
│   │   ├── Sidebar.tsx     # Menu lateral
│   │   ├── Header.tsx      # Cabeçalho
│   │   └── MainLayout.tsx  # Layout principal
│   └── ui/                 # Componentes reutilizáveis
├── services/               # Integração com API
├── hooks/                  # Custom hooks
├── types/                  # Definições TypeScript
└── utils/                  # Funções utilitárias
```

## 🎯 Status de Desenvolvimento

### ✅ STEP 1 - Setup do Projeto (CONCLUÍDO)
- [x] Configuração do Next.js com TypeScript
- [x] Configuração do Tailwind CSS
- [x] Estrutura de pastas organizada
- [x] Layout base (Sidebar + Header)
- [x] Páginas base criadas

### ✅ STEP 2 - Integração Base com API (CONCLUÍDO)
- [x] Axios configurado com interceptors
- [x] React Query Provider configurado
- [x] Camada de serviços implementada
- [x] Custom hooks criados
- [x] Tipos TypeScript definidos
- [x] Utilitários implementados
- [x] Página de teste funcionando

### ✅ STEP 3 - Autenticação (CONCLUÍDO)
- [x] Tela de login implementada
- [x] Integração com API de autenticação
- [x] JWT storage e gerenciamento
- [x] Proteção de rotas
- [x] Refresh token automático
- [x] Logout funcional
- [x] Persistência de sessão

### ✅ STEP 4 - Produtos (CRUD) (CONCLUÍDO)
- [x] Listagem de produtos
- [x] Criação de produtos
- [x] Edição de produtos
- [x] Busca e filtros
- [x] Soft delete (ativar/desativar)
- [x] Validação de formulários
- [x] Componentes reutilizáveis

### ✅ STEP 5 - Usuários (CONCLUÍDO)
- [x] Listagem de usuários
- [x] Cadastro de funcionários
- [x] Soft delete (ativar/desativar)
- [x] Diferenciação de roles (Dono/Funcionário)
- [x] Validação de formulários
- [x] Proteção (não pode desativar própria conta)
- [x] Componentes reutilizáveis

### ✅ STEP 6 - Caixa (Vendas) (CONCLUÍDO)
- [x] Tela de PDV (Ponto de Venda)
- [x] Listagem de produtos disponíveis
- [x] Busca de produtos
- [x] Adicionar produtos ao carrinho
- [x] Controle de quantidade
- [x] Cálculo automático de total
- [x] Verificação de estoque
- [x] Finalizar venda
- [x] Histórico de vendas
- [x] Cancelamento de vendas

### ✅ STEP 7 - Pagamentos (CONCLUÍDO)
- [x] Backend: Módulo de pagamentos completo
- [x] Frontend: Tela de seleção de pagamento
- [x] Métodos: PIX, Crédito, Débito, Dinheiro, Outro
- [x] Integração com vendas
- [x] Registro de pagamento no banco
- [x] Interface visual com ícones
- [x] Fluxo completo: Carrinho → Pagamento → Finalização

### ✅ STEP 8 - Dashboard (CONCLUÍDO)
- [x] Cards principais (Receita, Vendas Hoje, Produtos, Usuários)
- [x] Alertas de estoque (sem estoque, estoque baixo)
- [x] Resumo de vendas (concluídas/canceladas)
- [x] Top produtos com indicadores visuais
- [x] Cálculos eficientes com useMemo
- [x] Loading states
- [x] Design responsivo e moderno

### 🎉 Projeto Completo!
Todos os 8 steps foram concluídos com sucesso. O sistema está pronto para uso!

## 🛠️ Como Rodar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse: [http://localhost:3000](http://localhost:3000)

## 🔗 Integração com Backend

O frontend está configurado para se comunicar com o backend FastAPI rodando em `http://localhost:8000`.

As requisições para `/api/*` são automaticamente redirecionadas para o backend através do `next.config.mjs`.

## 📝 Convenções

- **Componentes**: PascalCase (ex: `Sidebar.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAuth.ts`)
- **Services**: camelCase (ex: `productService.ts`)
- **Types**: PascalCase (ex: `Product.ts`)
- **Utils**: camelCase (ex: `formatCurrency.ts`)

## 🎨 Design System

- **Cores primárias**: Tons de azul (blue-50 a blue-900)
- **Fonte**: Inter (Google Fonts)
- **Espaçamento**: Sistema de grid do Tailwind
- **Componentes**: Design limpo e moderno

## 🔐 Regras de Negócio

- Soft delete implementado (campo `is_active`)
- Autenticação via JWT
- Proteção de rotas
- Validação de formulários
