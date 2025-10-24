# Componente Tooltip

Componente de tooltip padrão do sistema usado para exibir informações ao passar o mouse sobre botões e ícones.

## Uso

```tsx
import { Tooltip } from '@components/Tooltip';

function MeuComponente() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Meu Botão
      </button>
      <Tooltip text="Descrição do botão" visible={isHovered} position="bottom" />
    </div>
  );
}
```

## Props

- `text` (string): Texto a ser exibido no tooltip
- `visible` (boolean): Controla a visibilidade do tooltip
- `position` ('top' | 'bottom' | 'left' | 'right'): Posição do tooltip em relação ao elemento pai (padrão: 'bottom')

## Características

- Sombra suave para profundidade visual
- Animação de transição suave
- Borda sutil para contraste
- Posicionamento automático baseado na posição configurada
- Estilo consistente em todo o sistema
- `pointerEvents: 'none'` para não interferir com eventos do mouse

## Onde é usado

- TopMenu: tooltips aparecem abaixo dos botões
- DockMenu: tooltips aparecem acima dos botões

