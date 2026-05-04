# 🧪 Guia de Teste - STEP 3 (Autenticação)

## Testando o Sistema de Autenticação

### Pré-requisitos

1. **Backend rodando**
   ```bash
   python run.py
   ```

2. **Frontend rodando**
   ```bash
   cd app
   npm run dev
   ```

---

## 🔐 Teste 1: Login Bem-Sucedido

### Passo 1: Acessar Página de Login
- Abra: [http://localhost:3000/login](http://localhost:3000/login)
- Ou clique em "Fazer Login" na home

### Passo 2: Preencher Credenciais
```
Email: emailowner@example.com
Senha: Owner@123
```

### Passo 3: Clicar em "Entrar"

### Resultados Esperados:
- ✅ Botão muda para "Entrando..." com spinner
- ✅ Campos ficam desabilitados
- ✅ Após ~1 segundo, redireciona para `/dashboard`
- ✅ Dashboard carrega normalmente
- ✅ Header mostra email do usuário
- ✅ Header mostra role "Dono"

---

## 🚫 Teste 2: Login com Credenciais Inválidas

### Passo 1: Acessar Login
- Abra: [http://localhost:3000/login](http://localhost:3000/login)

### Passo 2: Usar Credenciais Erradas
```
Email: teste@teste.com
Senha: senha123
```

### Passo 3: Clicar em "Entrar"

### Resultados Esperados:
- ✅ Loading aparece brevemente
- ✅ Box vermelho de erro aparece
- ✅ Mensagem: "Erro ao fazer login"
- ✅ Detalhes do erro exibidos
- ✅ NÃO redireciona
- ✅ Campos permanecem preenchidos

---

## 🔒 Teste 3: Proteção de Rotas

### Cenário 1: Usuário Não Autenticado

#### Passo 1: Abrir Navegador Anônimo
- Pressione `Ctrl+Shift+N` (Chrome) ou `Ctrl+Shift+P` (Firefox)

#### Passo 2: Tentar Acessar Dashboard
- Digite: `http://localhost:3000/dashboard`

#### Resultado Esperado:
- ✅ Loading aparece brevemente
- ✅ Redireciona automaticamente para `/login`

#### Passo 3: Tentar Outras Rotas Protegidas
- `/produtos`
- `/vendas`
- `/usuarios`
- `/pagamentos`

#### Resultado Esperado:
- ✅ Todas redirecionam para `/login`

### Cenário 2: Usuário Autenticado

#### Passo 1: Fazer Login
- Faça login normalmente

#### Passo 2: Acessar Rotas Protegidas
- Clique nos itens do menu
- Ou digite URLs diretamente

#### Resultado Esperado:
- ✅ Todas as rotas carregam normalmente
- ✅ Não há redirecionamento

---

## 💾 Teste 4: Persistência de Sessão

### Cenário 1: Recarregar Página

#### Passo 1: Fazer Login
- Faça login e acesse o dashboard

#### Passo 2: Recarregar Página
- Pressione `F5`

#### Resultado Esperado:
- ✅ Loading breve
- ✅ Dashboard carrega normalmente
- ✅ Usuário continua logado
- ✅ Dados do usuário aparecem no header

### Cenário 2: Fechar e Abrir Navegador

#### Passo 1: Fazer Login
- Faça login normalmente

#### Passo 2: Fechar Navegador
- Feche completamente o navegador

#### Passo 3: Abrir Novamente
- Abra o navegador
- Acesse: `http://localhost:3000/dashboard`

#### Resultado Esperado:
- ✅ Dashboard carrega diretamente
- ✅ Usuário continua logado
- ✅ Não precisa fazer login novamente

### Cenário 3: Múltiplas Abas

#### Passo 1: Fazer Login
- Faça login em uma aba

#### Passo 2: Abrir Nova Aba
- Pressione `Ctrl+T`
- Acesse: `http://localhost:3000/dashboard`

#### Resultado Esperado:
- ✅ Dashboard carrega diretamente
- ✅ Usuário já está logado
- ✅ Dados aparecem normalmente

---

## 🚪 Teste 5: Logout

### Passo 1: Fazer Login
- Faça login normalmente

### Passo 2: Clicar em "Sair"
- No menu lateral, clique no botão "Sair"

### Passo 3: Confirmar
- Clique em "OK" na confirmação

### Resultados Esperados:
- ✅ Redireciona para `/login`
- ✅ Dados do usuário são limpos

### Passo 4: Tentar Acessar Dashboard
- Digite: `http://localhost:3000/dashboard`

### Resultado Esperado:
- ✅ Redireciona para `/login`
- ✅ Usuário não está mais autenticado

---

## 🔄 Teste 6: Refresh Token (Avançado)

### Preparação:
Este teste requer modificar o tempo de expiração do token no backend ou esperar o token expirar.

### Cenário: Token Expirado

#### Passo 1: Fazer Login
- Faça login normalmente

#### Passo 2: Aguardar Token Expirar
- Aguarde o tempo de expiração do access_token

#### Passo 3: Fazer Requisição
- Navegue para `/produtos`
- Ou recarregue a página

#### Resultado Esperado:
- ✅ Requisição falha com 401
- ✅ Interceptor detecta erro
- ✅ Tenta renovar token automaticamente
- ✅ Se sucesso: requisição é refeita
- ✅ Se falha: redireciona para login

---

## 🔍 Teste 7: Verificar LocalStorage

### Passo 1: Fazer Login
- Faça login normalmente

### Passo 2: Abrir DevTools
- Pressione `F12`

### Passo 3: Ir para Application/Storage
- Aba "Application" (Chrome) ou "Storage" (Firefox)
- Expandir "Local Storage"
- Clicar em `http://localhost:3000`

### Resultado Esperado:
- ✅ `access_token` presente
- ✅ `refresh_token` presente
- ✅ `user` presente (JSON com dados do usuário)

### Passo 4: Fazer Logout
- Clique em "Sair"

### Resultado Esperado:
- ✅ Todos os itens são removidos
- ✅ LocalStorage fica vazio

---

## 🌐 Teste 8: Verificar Network (Requisições)

### Passo 1: Abrir DevTools
- Pressione `F12`
- Ir para aba "Network"

### Passo 2: Fazer Login
- Preencha credenciais
- Clique em "Entrar"

### Resultado Esperado:
- ✅ Requisição POST para `/api/auth/login`
- ✅ Status: 200 OK
- ✅ Response contém:
  - `access_token`
  - `refresh_token`

### Passo 3: Acessar Produtos
- Clique em "Produtos" no menu

### Resultado Esperado:
- ✅ Requisição GET para `/api/products`
- ✅ Header `Authorization: Bearer <token>` presente
- ✅ Status: 200 OK

---

## 🎨 Teste 9: Interface do Login

### Verificar Elementos:
- ✅ Logo azul com ícone
- ✅ Título "Mercadinho GR"
- ✅ Subtítulo "Faça login para continuar"
- ✅ Campo de email
- ✅ Campo de senha
- ✅ Botão "Entrar"
- ✅ Box azul com credenciais de teste
- ✅ Footer com versão

### Verificar Estados:
- **Normal**: Campos habilitados, botão azul
- **Loading**: Spinner no botão, campos desabilitados
- **Erro**: Box vermelho com mensagem

### Verificar Responsividade:
- ✅ Desktop: Card centralizado
- ✅ Tablet: Card ajustado
- ✅ Mobile: Card ocupa largura total

---

## 🐛 Teste 10: Tratamento de Erros

### Cenário 1: Backend Offline

#### Passo 1: Parar Backend
- Pressione `Ctrl+C` no terminal do backend

#### Passo 2: Tentar Login
- Preencha credenciais
- Clique em "Entrar"

#### Resultado Esperado:
- ✅ Loading aparece
- ✅ Erro de rede é exibido
- ✅ Mensagem clara sobre o problema

### Cenário 2: Email Inválido

#### Passo 1: Preencher Email Inválido
```
Email: teste (sem @)
Senha: qualquer
```

#### Passo 2: Tentar Enviar
- Clicar em "Entrar"

#### Resultado Esperado:
- ✅ Validação HTML impede envio
- ✅ Mensagem "Please include an '@' in the email address"

### Cenário 3: Senha Curta

#### Passo 1: Preencher Senha Curta
```
Email: teste@teste.com
Senha: 123 (menos de 8 caracteres)
```

#### Passo 2: Tentar Enviar
- Clicar em "Entrar"

#### Resultado Esperado:
- ✅ Validação HTML impede envio
- ✅ Mensagem sobre tamanho mínimo

---

## 📱 Teste 11: Responsividade

### Desktop (1920x1080):
- ✅ Card de login centralizado
- ✅ Largura máxima de 28rem
- ✅ Espaçamento adequado

### Tablet (768x1024):
- ✅ Card ajustado
- ✅ Margens laterais
- ✅ Elementos legíveis

### Mobile (375x667):
- ✅ Card ocupa largura total
- ✅ Padding lateral
- ✅ Botões tocáveis
- ✅ Campos grandes o suficiente

---

## ✅ Checklist de Validação

Marque cada item após testar:

### Login
- [ ] Login com credenciais válidas funciona
- [ ] Login com credenciais inválidas mostra erro
- [ ] Loading state aparece durante login
- [ ] Redirecionamento após login funciona
- [ ] Dados do usuário aparecem no header

### Proteção de Rotas
- [ ] Rotas protegidas redirecionam para login
- [ ] Usuário autenticado acessa rotas normalmente
- [ ] Loading durante verificação funciona

### Persistência
- [ ] Sessão persiste ao recarregar página
- [ ] Sessão persiste ao fechar navegador
- [ ] Sessão persiste entre abas

### Logout
- [ ] Botão de logout funciona
- [ ] Confirmação aparece
- [ ] Redireciona para login
- [ ] LocalStorage é limpo
- [ ] Não consegue acessar rotas protegidas

### Interface
- [ ] Design está correto
- [ ] Responsivo funciona
- [ ] Estados visuais corretos
- [ ] Mensagens de erro claras

### Segurança
- [ ] Tokens salvos no localStorage
- [ ] Token enviado nas requisições
- [ ] Refresh token automático (se testado)
- [ ] Logout invalida tokens

---

## 🎉 Sucesso!

Se todos os testes passaram, o **STEP 3 está funcionando perfeitamente!**

Você pode prosseguir para o **STEP 4 - Produtos (CRUD Completo)**.

---

## 🆘 Troubleshooting

### Problema: "Erro ao fazer login"
**Solução**: Verificar se backend está rodando e credenciais estão corretas

### Problema: Redireciona para login mesmo após login
**Solução**: Limpar localStorage e fazer login novamente

### Problema: Dados do usuário não aparecem
**Solução**: Verificar se token está sendo decodificado corretamente

### Problema: Logout não funciona
**Solução**: Verificar console para erros e se backend está respondendo
