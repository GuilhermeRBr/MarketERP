# 📚 Exemplos de Uso dos Hooks

## useProducts - Listar Produtos

```tsx
import { useProducts } from "@/hooks/useProducts";

function ProductList() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <ul>
      {products?.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

---

## useProduct - Buscar Produto por ID

```tsx
import { useProduct } from "@/hooks/useProducts";

function ProductDetail({ id }: { id: number }) {
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!product) return <div>Produto não encontrado</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>R$ {product.price.toFixed(2)}</p>
    </div>
  );
}
```

---

## useCreateProduct - Criar Produto

```tsx
import { useCreateProduct } from "@/hooks/useProducts";
import { useState } from "react";

function CreateProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  
  const { mutate: createProduct, isPending, error } = useCreateProduct();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createProduct(
      { name, price, stock: 0 },
      {
        onSuccess: (product) => {
          console.log("Produto criado:", product);
          // Limpar form
          setName("");
          setPrice(0);
        },
        onError: (error) => {
          console.error("Erro ao criar:", error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Preço"
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Criando..." : "Criar Produto"}
      </button>
      {error && <div>Erro: {error.message}</div>}
    </form>
  );
}
```

---

## useUpdateProduct - Atualizar Produto

```tsx
import { useUpdateProduct } from "@/hooks/useProducts";

function EditProductForm({ productId }: { productId: number }) {
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const handleUpdate = () => {
    updateProduct(
      {
        id: productId,
        data: { name: "Novo Nome", price: 99.99 },
      },
      {
        onSuccess: () => {
          console.log("Produto atualizado!");
        },
      }
    );
  };

  return (
    <button onClick={handleUpdate} disabled={isPending}>
      {isPending ? "Atualizando..." : "Atualizar"}
    </button>
  );
}
```

---

## useDeactivateProduct - Desativar Produto (Soft Delete)

```tsx
import { useDeactivateProduct } from "@/hooks/useProducts";

function ProductActions({ productId }: { productId: number }) {
  const { mutate: deactivate, isPending } = useDeactivateProduct();

  const handleDeactivate = () => {
    if (confirm("Deseja desativar este produto?")) {
      deactivate(productId, {
        onSuccess: () => {
          console.log("Produto desativado!");
        },
      });
    }
  };

  return (
    <button onClick={handleDeactivate} disabled={isPending}>
      {isPending ? "Desativando..." : "Desativar"}
    </button>
  );
}
```

---

## useActivateProduct - Reativar Produto

```tsx
import { useActivateProduct } from "@/hooks/useProducts";

function ReactivateButton({ productId }: { productId: number }) {
  const { mutate: activate, isPending } = useActivateProduct();

  return (
    <button
      onClick={() => activate(productId)}
      disabled={isPending}
    >
      {isPending ? "Reativando..." : "Reativar"}
    </button>
  );
}
```

---

## useProductSearch - Buscar Produtos com Filtros

```tsx
import { useProductSearch } from "@/hooks/useProducts";
import { useState } from "react";

function ProductSearch() {
  const [query, setQuery] = useState("");
  const { data: products, isLoading } = useProductSearch({ query });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar produtos..."
      />
      
      {isLoading && <div>Buscando...</div>}
      
      <ul>
        {products?.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Exemplo Completo - CRUD de Produtos

```tsx
"use client";

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeactivateProduct,
} from "@/hooks/useProducts";
import { useState } from "react";

export default function ProductManager() {
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Queries
  const { data: products, isLoading } = useProducts();
  
  // Mutations
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deactivateProduct } = useDeactivateProduct();

  const handleCreate = (name: string, price: number) => {
    createProduct({ name, price, stock: 0 });
  };

  const handleUpdate = (id: number, name: string) => {
    updateProduct({ id, data: { name } });
    setEditingId(null);
  };

  const handleDeactivate = (id: number) => {
    if (confirm("Desativar produto?")) {
      deactivateProduct(id);
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Gerenciar Produtos</h1>
      
      {/* Lista */}
      <ul>
        {products?.map((product) => (
          <li key={product.id}>
            {editingId === product.id ? (
              <input
                defaultValue={product.name}
                onBlur={(e) => handleUpdate(product.id, e.target.value)}
              />
            ) : (
              <span onClick={() => setEditingId(product.id)}>
                {product.name}
              </span>
            )}
            
            <button onClick={() => handleDeactivate(product.id)}>
              Desativar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Dicas de Uso

### 1. Sempre verifique estados
```tsx
const { data, isLoading, error, isSuccess } = useProducts();

if (isLoading) return <Loading />;
if (error) return <Error message={error.message} />;
if (isSuccess && data.length === 0) return <Empty />;
```

### 2. Use callbacks nas mutations
```tsx
mutate(data, {
  onSuccess: (result) => {
    // Sucesso
  },
  onError: (error) => {
    // Erro
  },
  onSettled: () => {
    // Sempre executa
  },
});
```

### 3. Desabilite botões durante loading
```tsx
<button disabled={isPending}>
  {isPending ? "Salvando..." : "Salvar"}
</button>
```

### 4. Use enabled para queries condicionais
```tsx
const { data } = useProduct(id, {
  enabled: !!id, // Só busca se id existir
});
```

---

## Próximos Hooks (STEP 3+)

- `useAuth()` - Autenticação
- `useUsers()` - Usuários
- `useSales()` - Vendas
- `usePayments()` - Pagamentos
