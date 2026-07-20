<div align="center">
  <img src="./frontend/public/icons/Logo.svg" width="400" alt="MarketERP Logo" />
  <p align="center">
    <strong>MarketERP é uma plataforma open-source para gerenciamento de mercado/ERP, desenvolvida para controle de produtos, vendas, usuários e pagamentos com Next.js, React, TypeScript e Tailwind CSS.</strong><br />
    Backend feito com FastAPI + Python + PostgreSQL
  </p>

  <p align="center">
    <a href="#">
      <img alt="License" src="https://img.shields.io/badge/license-MIT-blue">
    </a>
    <a href="#">
      <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/GuilhermeRBr/MercadinhoGR?color=green">
    </a>
    <a href="#">
      <img alt="Last Commit" src="https://img.shields.io/github/last-commit/GuilhermeRBr/MercadinhoGR?color=purple">
    </a>
  </p>

  <br />

  <p align="center">
    <img src="https://skillicons.dev/icons?i=react,nextjs,ts,tailwind,python,fastapi,postgres" alt="Tech Stack Icons" />
  </p>
</div>

---

## Sobre o projeto

O **MercadinhoGR** é uma aplicação web do tipo **ERP para pequenos mercados**, com foco em **controle de estoque, vendas e pagamentos** de forma simples e eficiente.

> Desenvolvido para donos de mercadinhos e pequenos comércios que precisam de uma solução prática para gerenciar seu negócio com tecnologia.

Funcionalidades:

- 📊 Dashboard com visão geral do negócio
- 📦 Cadastro e gerenciamento de produtos com código de barras
- 🛍️ Registro e acompanhamento de vendas
- 👥 Gestão de usuários com controle de acesso (admin/operador)
- 💳 Controle de pagamentos
- 🔐 Autenticação com JWT e refresh token
- 📈 Histórico de vendas e movimentações
- 🌱 Seed automático de usuário administrador
- 📱 Design responsivo com foco em UX

---

## ⚙️ Tecnologias Usadas

| Tecnologia | Descrição |
|------------|-----------|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=white) | Biblioteca para UI |
| ![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat&logo=next.js&logoColor=white) | Framework fullstack |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Tipagem estática |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Estilização moderna |
| ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat&logo=fastapi&logoColor=white) | Backend rápido e moderno |
| ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white) | Lógica e integração |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) | Banco de dados relacional |
| ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-D71F00?style=flat&logo=sqlalchemy&logoColor=white) | ORM Python |
| ![Alembic](https://img.shields.io/badge/-Alembic-6BA539?style=flat&logo=alembic&logoColor=white) | Migrations de banco |

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- Python 3.11+
- PostgreSQL

```bash
# Clone o repositório
git clone https://github.com/GuilhermeRBr/MercadinhoGR.git

# Acesse o diretório
cd MercadinhoGR
```

### Backend

```bash
# Acesse o diretório do backend
cd backend

# Crie e ative o ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
copy .env.exemple .env
# Edite o arquivo .env com suas credenciais do banco

# Rode as migrations
alembic upgrade head

# Inicie o servidor
python run.py
```

> O backend estará disponível em `http://localhost:8000`  
> Documentação da API: `http://localhost:8000/docs`

### Frontend

```bash
# Em outro terminal, acesse o diretório do frontend
cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
copy .env.example .env.local
# Edite com a URL do backend

# Rode o app localmente
npm run dev
```

> O frontend estará disponível em `http://localhost:3000`

> ⚠️ Certifique-se de configurar corretamente o banco PostgreSQL antes de rodar o backend.

---

## Estrutura de Pastas

```
📦 MercadinhoGR
├── 📂 alembic/               # Migrations do banco de dados
│   └── 📂 versions/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 common/        # Exceções e mensagens globais
│   │   ├── 📂 core/          # Config, segurança e dependências
│   │   ├── 📂 data/          # Conexão com o banco
│   │   ├── 📂 login/         # Autenticação e refresh token
│   │   ├── 📂 payments/      # Módulo de pagamentos
│   │   ├── 📂 products/      # Módulo de produtos
│   │   ├── 📂 sales/         # Módulo de vendas
│   │   ├── 📂 seed/          # Seed de dados iniciais
│   │   └── 📂 user/          # Módulo de usuários
│   ├── 📄 main.py
│   ├── 📄 run.py
│   └── 📄 requirements.txt
├── 📂 frontend/
│   ├── 📂 app/               # Rotas Next.js (App Router)
│   │   └── 📂 (dashboard)/   # Rotas protegidas
│   ├── 📂 components/        # Componentes React
│   │   ├── 📂 layout/        # Sidebar, Header, MainLayout
│   │   └── 📂 ui/            # Componentes reutilizáveis
│   ├── 📂 contexts/          # Contextos React
│   ├── � hooks/             # Custom hooks
│   ├── 📂 services/          # Integração com a API
│   ├── 📂 types/             # Tipos TypeScript
│   └── 📂 utils/             # Funções utilitárias
├── 📂 docs/                  # Documentação e progresso
└── 📄 README.md
```

---

## 📍 Rotas da Aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/dashboard` | Dashboard principal |
| `/produtos` | Gestão de produtos |
| `/vendas` | Gestão de vendas |
| `/usuarios` | Gestão de usuários |
| `/pagamentos` | Gestão de pagamentos |

---

## Colaboradores

<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/GuilhermeRBr.png" width="100px;" alt="Guilherme Rebouças"/><br />
      <sub><b>Guilherme Rebouças</b></sub><br />
      <a href="https://github.com/GuilhermeRBr" target="_blank">@GuilhermeRBr</a>
    </td>
  </tr>
</table>

---

## 📄 License

Este projeto está licenciado sob a [MIT License](LICENSE).
