# Página de Produtos/Serviços

Página para gerenciar produtos e serviços do sistema com interface estilo macOS.

## Características

- **Busca em tempo real**: Pesquisa produtos por nome, descrição ou categoria
- **Lista estilo macOS**: Design limpo e moderno com efeitos de vidro fosco
- **Animações suaves**: Itens aparecem com fadeIn sequencial
- **Indicadores visuais**: 
  - Badges coloridos para tipo (Produto/Serviço)
  - Cores de status para estoque (Verde/Laranja/Vermelho)
  - Formatação de moeda brasileira
- **Responsivo**: Grid adaptável com hover effects

## Estrutura

### Componentes Modulares

- `Products`: Componente principal da página (container)
- `SearchBox`: Componente de busca reutilizável
- `ProductList`: Componente de listagem de produtos
- `ProductRow`: Linha individual de produto na lista (interno ao ProductList)

### Interface Product

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // em centavos
  type: 'product' | 'service';
  category: string;
  stock?: number; // opcional para serviços
}
```

## Layout

### Seção Superior - Busca
- Campo de pesquisa com ícone
- Contador de itens encontrados
- Efeito de foco estilo macOS

### Seção Inferior - Lista
- Cabeçalho fixo com colunas:
  - Produto/Serviço (2fr)
  - Categoria (1fr)
  - Tipo (0.8fr)
  - Estoque (0.8fr)
  - Preço (1fr)
- Conteúdo scrollável
- Itens com hover effect

## Estilos

Todos os estilos são importados de `src/renderer/styles/style.ts`:

```typescript
import { macStyles } from '../../styles/style';
const styles = macStyles.pages.products;
```

### Variáveis CSS Utilizadas

- **Cores**: `--text-primary`, `--text-secondary`, `--accent`
- **Bordas**: `--border-radius-large`
- **Transições**: `--transition-fast`

### Fonte
- SF Pro Text (macOS) via sistema global

### Arquitetura Modular

1. **Products.tsx**: Container principal da página
2. **SearchBox.tsx**: Componente de busca reutilizável
3. **ProductList.tsx**: Componente de listagem modular
4. **style.ts**: Única fonte de estilos do sistema
5. **reset.css**: Animações e customizações globais

Esta arquitetura garante:
- ✅ Consistência visual em todo o sistema
- ✅ Componentes reutilizáveis e modulares
- ✅ Fácil manutenção e atualização de estilos
- ✅ Separação clara de responsabilidades

## Cores de Status

### Tipo
- **Produto**: Azul (`#0A84FF`)
- **Serviço**: Verde (`#34C759`)

### Estoque
- **Bom** (>10): Verde (`#34C759`)
- **Baixo** (1-10): Laranja (`#FF9500`)
- **Esgotado** (0): Vermelho (`#FF3B30`)
- **N/A**: Cinza (serviços)

## Uso

Para usar a página, importe e renderize:

```tsx
import { Products } from '@pages/Products';

function App() {
  return <Products />;
}
```

## Futuras Melhorias

- Adicionar botões de ação (Editar, Excluir)
- Implementar modal de criação/edição
- Adicionar filtros por categoria e tipo
- Ordenação por colunas
- Paginação para grandes volumes
- Exportar relatórios

