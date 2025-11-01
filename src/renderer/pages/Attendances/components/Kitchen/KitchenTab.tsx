//--------------------------------------------------------------------
// ABA: COZINHA
// Visualização de pedidos em produção para a equipe da cozinha
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';

export function KitchenTab(): JSX.Element {
  const { systemColors } = useTheme();

  const styles = {
    placeholder: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontSize: '18px',
      fontWeight: '500',
      color: systemColors.text.secondary
    }
  };

  return (
    <div style={styles.placeholder}>
      Cozinha (placeholder)
    </div>
  );
}

