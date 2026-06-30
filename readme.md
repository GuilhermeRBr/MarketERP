# 🛒 MarketERP

Sistema completo de gerenciamento para pequenos mercados e mercearias.

## 📁 Estrutura do Projeto

```
MarketERP/
├── backend/              # API REST (FastAPI + Python)
│   ├── src/             # Código fonte
│   ├── tests/           # Testes
│   ├── venv/            # Ambiente virtual
│   ├── main.py          # Ponto de entrada
│   └── run.py           # Script de inicialização
├── frontend/            # Interface Web (Next.js + React)
│   ├── app/             # Páginas e rotas
│   ├── components/      # Componentes React
│   ├── services/        # Serviços de API
│   └── types/           # Tipos TypeScript
├── alembic/             # Migrações do banco
├── docs/                # Documentação
```

## 🚀 Tecnologias

### Backend
- **Python 3.14** com FastAPI
- **PostgreSQL** como banco de dados
- **Alembic** para migrações
- **JWT** para autenticação

### Frontend
- **Next.js 16** com TypeScript
- **React 18** com Hooks
- **TailwindCSS** para estilização
- **React Query** para gerenciamento de estado

## 📋 Pré-requisitos

- Python 3.14+
- Node.js 18+
- PostgreSQL 12+

## 🔧 Instalação e Execução


#### Backend

```bash
# 1. Entrar na pasta backend
cd backend

# 2. Ativar ambiente virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# 3. Instalar dependências (primeira vez)
pip install -r requirements.txt

# 4. Configurar .env (primeira vez)
# Edite backend/.env com suas credenciais do PostgreSQL

# 5. Executar migrações (primeira vez)
cd ..
alembic upgrade head
cd backend

# 6. Iniciar servidor
python run.py
```

✅ Backend rodando em: **http://localhost:8000**  
✅ Documentação: **http://localhost:8000/docs**

#### Frontend

```bash
# 1. Entrar na pasta frontend
cd frontend

# 2. Instalar dependências (primeira vez)
npm install

# 3. Configurar .env (primeira vez)
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env

# 4. Iniciar servidor
npm run dev
```

✅ Frontend rodando em: **http://localhost:3000**

## 🔐 Credenciais de Teste

**Dono:**
- Email: `emailowner@example.com`
- Senha: `Owner@123`

**Funcionário:**
- Email: `emailoperator@example.com`
- Senha: `Operator@123`

## 🎯 Funcionalidades

- ✅ Autenticação e autorização (JWT)
- ✅ Gerenciamento de usuários (Dono/Funcionário)
- ✅ Cadastro de produtos com controle de estoque
- ✅ Sistema de vendas (PDV)
- ✅ Múltiplas formas de pagamento (Dinheiro, PIX, Cartão)
- ✅ Relatórios e dashboard
- ✅ Histórico de vendas e pagamentos

## 📚 Documentação da API

Após iniciar o backend:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/docs

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra issues e pull requests.

## 📝 Licença

MIT License

## 👨‍💻 Autor

**Guilherme Rebouças**
- GitHub: [@GuilhermeRBr](https://github.com/GuilhermeRBr)
