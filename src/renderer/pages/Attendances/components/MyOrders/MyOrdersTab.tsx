//--------------------------------------------------------------------
// ABA: MEUS PEDIDOS
// Quadro Kanban com três colunas de status: Em análise, Em produção e Pronto para entrega
// Mantém o padrão visual do sistema utilizando systemStyles e systemColors
//--------------------------------------------------------------------
import React from 'react';
import { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { SearchField } from '../../../../components/SearchField';
import { OrderCard } from './components/OrderCard';

type KanbanColumnId = 'review' | 'inProgress' | 'ready';

export function MyOrdersTab(): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [orderStatus, setOrderStatus] = useState<KanbanColumnId>('review');

  const handleAdvance = () => {
    if (orderStatus === 'review') {
      setOrderStatus('inProgress');
    } else if (orderStatus === 'inProgress') {
      setOrderStatus('ready');
    }
  };

  const handleDeliver = () => {
    setOrderStatus('review');
  };

  const columns: { id: KanbanColumnId; title: string; color: string; accent: string; emptyMessage: string; actionLabel?: string }[] = [
    {
      id: 'review',
      title: 'Em análise',
      color: '#E8762B',
      accent: '#B55E22',
      emptyMessage: 'Nenhum pedido no momento. Compartilhe os seus links nas redes sociais e receba pedidos!'
    },
    {
      id: 'inProgress',
      title: 'Em produção',
      color: '#F8A832',
      accent: '#C78729',
      emptyMessage: 'Nenhum pedido no momento. Receba pedidos e visualize os que estão em produção.'
    },
    {
      id: 'ready',
      title: 'Pronto para entrega',
      color: '#49A64E',
      accent: '#3B8440',
      emptyMessage: 'Nenhum pedido no momento. Receba pedidos e visualize os prontos para entrega.',
      actionLabel: 'Finalizar'
    }
  ];

  const styles = {
    topBar: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12
    },
    pageTitle: {
      ...systemStyles.page.title,
      margin: 0,
      justifySelf: 'center'
    },
    searchWrapper: {
      width: '100%',
      justifySelf: 'start'
    },
    newOrderButton: (): React.CSSProperties => (
      isPressed
        ? (systemStyles as any).neumorphicButton.containerActive
        : (systemStyles as any).neumorphicButton.container
    ),
    kanban: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16,
      height: '100%'
    },
    column: (bg: string) => ({
      display: 'flex',
      flexDirection: 'column' as const,
      background: bg,
      borderRadius: 10,
      overflow: 'hidden',
      border: `1px solid ${systemColors.border.light}`
    }),
    header: (accent: string) => ({
      ...systemStyles.page.header,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      background: accent,
      color: '#FFFFFF',
      border: 'none'
    }),
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    headerTitle: {
      ...systemStyles.page.title,
      fontSize: 16,
      margin: 0,
      color: '#FFFFFF'
    },
    headerCounter: {
      fontWeight: 600,
      color: '#FFFFFF'
    },
    headerAction: {
      ...systemStyles.button?.primary,
      padding: '6px 10px',
      borderRadius: 6,
      background: '#2E7D32',
      color: '#FFFFFF',
      border: 'none',
      cursor: 'pointer'
    } as React.CSSProperties,
    body: {
      flex: 1,
      padding: 12,
      overflow: 'auto'
    },
    bodyEmpty: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    emptyText: {
      textAlign: 'center' as const,
      color: '#FFFFFF',
      fontSize: 14,
      lineHeight: 1.4,
      maxWidth: 360
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={styles.topBar}>
        <div style={styles.searchWrapper}>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nº do pedido ou nome do cliente"
          />
        </div>
        <h2 style={styles.pageTitle}>Meus Pedidos</h2>
        <button
          style={styles.newOrderButton()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
        >
          Novo Pedido
        </button>
      </div>
      <div style={styles.kanban}>
        {columns.map((col) => (
          <div key={col.id} style={styles.column(col.color)}>
            <div style={styles.header(col.accent)}>
              <div style={styles.headerLeft}>
                <h2 style={styles.headerTitle}>{col.title}</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {col.actionLabel && (
                  <button style={styles.headerAction}>{col.actionLabel}</button>
                )}
                <span style={styles.headerCounter}>0</span>
              </div>
            </div>
            <div style={styles.body}>
              {col.id === orderStatus ? (
                <OrderCard
                  orderNumber="0001"
                  customerName="João Silva"
                  orderTime="14:30"
                  total={87.50}
                  itemsCount={3}
                  showAdvanceButton={true}
                  buttonLabel={orderStatus === 'ready' ? 'Entregue' : 'Avançar →'}
                  onAdvance={orderStatus === 'ready' ? handleDeliver : handleAdvance}
                />
              ) : (
                <div style={styles.bodyEmpty}>
                  <div style={styles.emptyText}>{col.emptyMessage}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


