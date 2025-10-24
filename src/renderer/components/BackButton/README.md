# Componente BackButton

Botão voltar estilo macOS reutilizável para navegação entre páginas.

## Características

- **Design macOS**: Gradiente sutil, bordas arredondadas e sombras
- **Interatividade**: Hover effects e animações suaves
- **Som integrado**: Reproduz som de clique usando `useClickSound`
- **Acessibilidade**: Tooltip com label descritivo
- **Modular**: Componente reutilizável em todo o sistema

## Uso

```tsx
import { BackButton } from '@components/BackButton';

function MinhaPagina() {
  const { navigate } = useNavigation();

  return (
    <div>
      <BackButton 
        onClick={() => navigate('home')} 
        label="Voltar para Home" 
      />
      {/* resto do conteúdo */}
    </div>
  );
}
```

## Props

- `onClick` (function): Função chamada quando o botão é clicado
- `label` (string, opcional): Texto do tooltip (padrão: "Voltar")

## Estilo

- **Tamanho**: 28x28px
- **Bordas**: 6px de raio
- **Gradiente**: `#f5f5f5` para `#e8e8e8`
- **Sombra**: Sombra sutil com highlight interno
- **Ícone**: Seta para esquerda (SVG)
- **Hover**: Gradiente mais claro e elevação

## Onde é usado

- Página de Produtos: botão voltar para Home
- Futuras páginas do sistema que precisem de navegação

