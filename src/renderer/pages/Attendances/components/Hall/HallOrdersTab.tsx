//--------------------------------------------------------------------
// ABA: PEDIDOS SALÃO
// Gestão de mesas e pedidos por mesa com status
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';

export function HallOrdersTab(): JSX.Element {
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
      Pedidos Salão (placeholder)
    </div>
  );
}


