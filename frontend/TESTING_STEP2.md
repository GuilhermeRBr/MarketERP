# 🧪 Guia de Teste - STEP 2

## Testando a Integração com API

### Pré-requisitos

1. **Backend rodando**
   ```bash
   # Na raiz do projeto
   python run.py
   ```
   Backend deve estar em: `http://localhost:8000`

2. **Frontend instalado**
   ```bash
   cd app
   npm install
   ```

---

## 🚀 Teste 1: Verificar Conexão com Backend

### Passo 1: Iniciar Frontend
```bash
cd app
npm run dev
```

### Passo 2: Acessar Página de Produtos
Abra: [http://localhost:3000/produtos](http://localhost:3000/produtos)

### Resultados Esperados:

#### ✅ Se backend está rodando COM produtos:
- Loading aparece brevemente
- Tabela de produtos é exibida
- Dados aparecem formatados:
  - Nome do produto
  - Preço em R$
  - Estoque em unidades
  - Status (Ativo/Inativo)
- Mensagem azul no final: "STEP 2 - Integração com API funcionando!"

#### ✅ Se backend está rodando SEM produtos:
- Loading aparece brevemente
- Ícone de pacote vazio
- Mensagem: "Nenhum produto cadastrado"
- Botão "Adicionar Produto"
- Mensagem azul: "Conectado ao backend"

#### ❌ Se backend NÃO está rodando:
- Loading aparece brevemente
- Box vermelho com erro
- Mensagem: "Erro ao carregar produtos"
- Instrução: "Certifique-se de que o backend está rodando em http://localhost:8000"

---

## 🔍 Teste 2: Verificar React Query Devtools

### Passo 1: Abrir Devtools
Na página de produtos, procure no canto inferior direito um ícone do React Query.

### Passo 2: Clicar no Ícone
Abre painel com informações de queries.

### O que verificar:
- ✅ Query `["products", "list"]` aparece
- ✅ Status: `success` (se backend rodando)
- ✅ Data: Array de produtos
- ✅ Cache time visível

---

## 🧪 Teste 3: Verificar Network (DevTools do Navegador)

### Passo 1: Abrir DevTools
Pressione `F12` ou `Ctrl+Shift+I`

### Passo 2: Ir para aba Network
Recarregue a página de produtos

### O que verificar:
- ✅ Requisição para `http://localhost:8000/api/products`
- ✅ Method: `GET`
- ✅ Status: `200 OK` (se backend rodando)
- ✅ Response: JSON com array de produtos

---

## 🎯 Teste 4: Verificar Cache do React Query

### Passo 1: Carregar Produtos
Acesse `/produtos` e aguarde carregar

### Passo 2: Navegar para Outra Página
Clique em "Dashboard" no menu

### Passo 3: Voltar para Produtos
Clique em "Produtos" no menu

### Resultado Esperado:
- ✅ Produtos aparecem INSTANTANEAMENTE (do cache)
- ✅ Não há loading
- ✅ Não há nova requisição (verificar Network)

---

## 🔧 Teste 5: Verificar Tratamento de Erros

### Cenário 1: Backend Parado
1. Pare o backend (`Ctrl+C`)
2. Recarregue `/produtos`
3. ✅ Deve mostrar erro vermelho

### Cenário 2: URL Errada
1. Edite `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:9999/api
   ```
2. Reinicie frontend
3. Acesse `/produtos`
4. ✅ Deve mostrar erro de conexão

### Cenário 3: Restaurar
1. Volte `.env.local` para:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
2. Reinicie backend e frontend
3. ✅ Deve funcionar normalmente

---

## 📊 Teste 6: Verificar Formatação de Dados

### Na tabela de produtos, verifique:
- ✅ Preço formatado: `R$ 10,50` (não `10.5`)
- ✅ Estoque com unidade: `100 un.`
- ✅ Status com badge colorido:
  - Verde para "Ativo"
  - Vermelho para "Inativo"

---

## 🎨 Teste 7: Verificar Estados Visuais

### Loading State:
- ✅ Spinner animado azul
- ✅ Texto "Carregando produtos..."
- ✅ Centralizado

### Error State:
- ✅ Box vermelho
- ✅ Ícone de alerta
- ✅ Mensagem de erro
- ✅ Instruções para resolver

### Empty State:
- ✅ Ícone de pacote cinza
- ✅ Título "Nenhum produto cadastrado"
- ✅ Texto explicativo
- ✅ Botão "Adicionar Produto"

### Success State:
- ✅ Tabela com cabeçalhos
- ✅ Linhas com hover effect
- ✅ Dados formatados
- ✅ Responsivo

---

## 🐛 Troubleshooting

### Problema: "Cannot GET /api/products"
**Solução**: Backend não está rodando
```bash
python run.py
```

### Problema: "Network Error"
**Solução**: Verificar URL no `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Problema: Produtos não aparecem
**Solução**: Adicionar produtos no backend
- Use Postman/Insomnia
- Ou crie via API diretamente

### Problema: "Module not found"
**Solução**: Reinstalar dependências
```bash
cd app
rm -rf node_modules
npm install
```

---

## ✅ Checklist de Validação

Marque cada item após testar:

- [ ] Frontend inicia sem erros
- [ ] Página de produtos carrega
- [ ] Loading state aparece
- [ ] Produtos são exibidos (se houver)
- [ ] Empty state funciona (se não houver)
- [ ] Error state funciona (backend parado)
- [ ] React Query Devtools funciona
- [ ] Cache funciona (navegação rápida)
- [ ] Formatação de dados correta
- [ ] Responsivo em mobile
- [ ] Console sem erros

---

## 🎉 Sucesso!

Se todos os testes passaram, o **STEP 2 está funcionando perfeitamente!**

Você pode prosseguir para o **STEP 3 - Autenticação**.
