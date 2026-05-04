# 🚀 Guia de Instalação - Frontend Mercadinho GR

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Backend FastAPI rodando em `http://localhost:8000`

## Instalação

### 1. Navegue até a pasta do frontend
```bash
cd app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o servidor de desenvolvimento
```bash
npm run dev
```

### 4. Acesse a aplicação
Abra seu navegador em: [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm start

# Lint
npm run lint
```

## Estrutura Inicial

Após a instalação, você verá:

- **Página inicial**: Landing page simples
- **Dashboard**: Estrutura básica com cards de estatísticas
- **Menu lateral**: Navegação entre módulos
- **Header**: Busca e perfil do usuário

## Próximos Passos

O STEP 1 está concluído! As próximas etapas incluem:

1. **STEP 2**: Integração com API
2. **STEP 3**: Sistema de autenticação
3. **STEP 4**: CRUD de produtos
4. E mais...

## Troubleshooting

### Erro ao instalar dependências
```bash
# Limpe o cache do npm
npm cache clean --force

# Tente novamente
npm install
```

### Porta 3000 já está em uso
```bash
# Execute em outra porta
npm run dev -- -p 3001
```

### Backend não está respondendo
Certifique-se de que o backend FastAPI está rodando:
```bash
# Na pasta raiz do projeto
python run.py
```

## Suporte

Para dúvidas ou problemas, consulte:
- `README.md` - Documentação geral
- `docs/PROGRESS.md` - Progresso do desenvolvimento
