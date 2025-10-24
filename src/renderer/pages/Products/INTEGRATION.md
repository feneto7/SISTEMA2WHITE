# Como Integrar a Página de Produtos

## Opção 1: Substituir a Home temporariamente (para testes)

```tsx
// src/renderer/App.tsx
import React from 'react';
import { Products } from './pages/Products/Products';
import { globalStyles } from './styles/style';

export function App(): JSX.Element {
  React.useEffect(() => {
    const root = document.documentElement;
    Object.entries(globalStyles.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return <Products />;
}
```

## Opção 2: Adicionar botão no TopMenu

```tsx
// src/renderer/pages/Home/components/TopMenu.tsx
// Adicionar um novo botão que navega para produtos

import { ProductsIcon } from '../../../components/Icons/Icons';

// No TopMenu, adicionar:
<MenuButton 
  icon={ProductsIcon} 
  label="Produtos" 
  onClick={() => navigate('/products')} 
/>
```

## Opção 3: Adicionar no DockMenu

```tsx
// src/renderer/pages/Home/components/DockMenu.tsx
// Adicionar botão no dock

import { ProductsIcon } from '../../../components/Icons/Icons';

// No DockMenu, adicionar:
<DockButton 
  icon={ProductsIcon} 
  label="Produtos" 
/>
```

## Opção 4: Sistema de Rotas (Recomendado)

Instalar React Router:
```bash
npm install react-router-dom
```

Configurar rotas:
```tsx
// src/renderer/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Products } from './pages/Products/Products';
import { globalStyles } from './styles/style';

export function App(): JSX.Element {
  React.useEffect(() => {
    const root = document.documentElement;
    Object.entries(globalStyles.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Então nos botões, usar:
```tsx
import { useNavigate } from 'react-router-dom';

function MenuButton() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    playClickSound();
    navigate('/products');
  };
  
  // ...
}
```

