//--------------------------------------------------------------------
// TELA KDS DA COZINHA
// Mostra a fila de pedidos para a equipe da cozinha
//--------------------------------------------------------------------

import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../components/Icons/AppIcons';
import { useClickSound } from '../../../../hooks/useClickSound';
import { useOrderBellSound } from '../../../../hooks/useOrderBellSound';
import { useSystemNotification } from '../../../../hooks/useSystemNotification';
import { KitchenStation, KitchenOrder } from './types';

interface KitchenKDSViewProps {
  kitchen: KitchenStation;
  onClose: () => void;
  onRefresh: (kitchenId: string) => void;
  onMarkAsReady: (kitchenId: string, orderId: string) => void;
  onToggleItemReady: (kitchenId: string, orderId: string, itemId: string) => void;
  onOpenFullscreen?: (kitchenId: string) => void;
  isFullscreen?: boolean;
}

const priorityLabel: Record<KitchenOrder['priority'], string> = {
  normal: 'Normal',
  high: 'Prioritário'
};

export function KitchenKDSView({
  kitchen,
  onClose,
  onRefresh: _onRefresh,
  onMarkAsReady,
  onToggleItemReady,
  onOpenFullscreen,
  isFullscreen = false
}: KitchenKDSViewProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();
  const playOrderBell = useOrderBellSound();
  const showNotification = useSystemNotification();

  const preparingOrders = kitchen.orders.filter(order => order.status === 'preparing');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const formatElapsedTime = (minutes: number) => {
    if (minutes <= 60) {
      return `${minutes} min`;
    }
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  };

  return (
    <div style={{
      ...systemStyles.kitchen.kdsOverlay,
      ...(isFullscreen ? systemStyles.kitchen.kdsOverlayFullscreen : {})
    }}>
      <header style={systemStyles.kitchen.kdsHeader}>
        <div style={systemStyles.kitchen.kdsTitleGroup}>
          <h2 style={systemStyles.kitchen.kdsTitle}>{kitchen.kdsName}</h2>
          <p style={systemStyles.kitchen.kdsSubtitle}>
            Monitorando {preparingOrders.length} pedido(s) • Tempo médio {kitchen.averagePrepTime} min • Última sincronização {kitchen.lastSync}
          </p>
        </div>

        <div style={systemStyles.kitchen.kdsControls}>
          <button
            style={systemStyles.kitchen.kdsButton}
            onClick={() => {
              playClickSound();
              onClose();
            }}
          >
            <AppIcons.Back size={16} />
            Voltar
          </button>
          {onOpenFullscreen && !isFullscreen && (
            <button
              style={{
                ...systemStyles.kitchen.kdsButton,
                ...systemStyles.kitchen.kdsButtonPrimary
              }}
              onClick={() => {
                playClickSound();
                onOpenFullscreen(kitchen.id);
              }}
            >
              <AppIcons.Maximize size={16} />
              Tela cheia
            </button>
          )}
        </div>
      </header>

      {preparingOrders.length === 0 ? (
        <div style={systemStyles.kitchen.emptyState}>
          <AppIcons.CheckCircle size={28} color={systemColors.selection.blue} />
          <strong>Sem pedidos em preparo.</strong>
          <span>Assim que um novo pedido chegar ele aparece aqui automaticamente.</span>
        </div>
      ) : (
        <div style={systemStyles.kitchen.kdsOrdersGrid}>
          {preparingOrders.map(order => {
            const orderCode = order.code.startsWith('#') ? order.code : `#${order.code}`;
            const elapsedText = formatElapsedTime(order.elapsedMinutes);

            return (
              <article key={order.id} style={systemStyles.kitchen.kdsOrderCard}>
                <header style={systemStyles.kitchen.kdsOrderTopHeader}>
                  <div style={systemStyles.kitchen.kdsOrderTitleGroup}>
                    <span style={systemStyles.kitchen.kdsOrderLabel}>Pedido</span>
                    <span style={systemStyles.kitchen.kdsOrderCode}>{orderCode}</span>
                  </div>
                  <button
                    style={systemStyles.kitchen.kdsFinalizeButton}
                    onClick={() => {
                      playClickSound();
                      onMarkAsReady(kitchen.id, order.id);
                    }}
                  >
                    Finalizar pedido
                  </button>
                </header>

                <div style={systemStyles.kitchen.kdsOrderBody}>
                  {order.items.map(item => (
                    (() => {
                      const itemKey = `${order.id}-${item.id}`;
                      const isHovered = hoveredItemId === itemKey;
                      const isReady = Boolean(item.isReady);
                      const itemStyle = {
                        ...systemStyles.kitchen.kdsOrderProduct,
                        ...(isHovered && !isReady ? systemStyles.kitchen.kdsOrderProductHover : {}),
                        ...(isReady ? systemStyles.kitchen.kdsOrderProductReady : {})
                      };

                      return (
                        <button
                          key={item.id}
                          type="button"
                          style={itemStyle}
                          onMouseEnter={() => setHoveredItemId(itemKey)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          onClick={() => {
                            playClickSound();
                            onToggleItemReady(kitchen.id, order.id, item.id);
                            if (!item.isReady) {
                              playOrderBell();
                              showNotification('Item Pronto!', `${item.quantity}x ${item.name}`);
                            }
                          }}
                        >
                          <div style={systemStyles.kitchen.kdsOrderProductHeader}>
                            <span style={systemStyles.kitchen.kdsOrderProductName}>
                              <strong>{item.quantity}x</strong> {item.name}
                            </span>
                          </div>

                          {item.notes && (
                            <span style={systemStyles.kitchen.kdsOrderProductNote}>{item.notes}</span>
                          )}

                          {item.complements && item.complements.length > 0 && (
                            <ul style={systemStyles.kitchen.kdsComplementList}>
                              {item.complements.map(complement => (
                                <li key={complement} style={systemStyles.kitchen.kdsComplementItem}>
                                  • {complement}
                                </li>
                              ))}
                            </ul>
                          )}

                          {isReady && (
                            <div style={systemStyles.kitchen.kdsOrderProductReadyOverlay}>
                              <AppIcons.Check size={20} color={systemColors.status.authorized.color} />
                            </div>
                          )}
                        </button>
                      );
                    })()
                  ))}
                </div>

                <footer style={systemStyles.kitchen.kdsFooter}>
                  <span style={systemStyles.kitchen.kdsFooterTag}>{priorityLabel[order.priority]}</span>
                  <span style={systemStyles.kitchen.kdsFooterTime}>Mesa: {order.table}</span>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}


