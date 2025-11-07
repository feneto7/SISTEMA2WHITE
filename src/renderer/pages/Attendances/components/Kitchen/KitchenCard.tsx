//--------------------------------------------------------------------
// CARD DA ESTAÇÃO DE COZINHA
// Exibe somente o nome da cozinha com ações rápidas ao lado
//--------------------------------------------------------------------

import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../components/Icons/AppIcons';
import { KitchenStation } from './types';

interface KitchenCardProps {
  station: KitchenStation;
  onOpenKDS: (stationId: string) => void;
  onEdit: (stationId: string) => void;
  onDelete: (stationId: string) => void;
  disableDelete?: boolean;
}

export function KitchenCard({
  station,
  onOpenKDS,
  onEdit,
  onDelete,
  disableDelete
}: KitchenCardProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<'edit' | 'delete' | null>(null);

  return (
    <div
      style={{
        ...systemStyles.kitchen.card.container,
        ...(isHovered ? systemStyles.kitchen.card.containerHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenKDS(station.id)}
    >
      <div style={systemStyles.kitchen.card.mainArea}>
        <h3 style={systemStyles.kitchen.card.title}>{station.kdsName}</h3>
      </div>

      <div style={systemStyles.kitchen.card.actionPanel}>
        <button
          style={{
            ...systemStyles.kitchen.card.actionButton,
            ...(hoveredAction === 'edit' ? systemStyles.kitchen.card.actionButtonHover : {})
          }}
          onClick={(event) => {
            event.stopPropagation();
            onEdit(station.id);
          }}
          onMouseEnter={() => setHoveredAction('edit')}
          onMouseLeave={() => setHoveredAction(null)}
        >
          <AppIcons.Edit size={16} color={systemColors.selection.blueDark} />
        </button>

        <button
          style={{
            ...systemStyles.kitchen.card.actionButton,
            ...(hoveredAction === 'delete' && !disableDelete ? systemStyles.kitchen.card.actionButtonHover : {}),
            opacity: disableDelete ? 0.5 : 1,
            cursor: disableDelete ? 'not-allowed' : 'pointer'
          }}
          disabled={disableDelete}
          onClick={(event) => {
            event.stopPropagation();
            if (!disableDelete) {
              onDelete(station.id);
            }
          }}
          onMouseEnter={() => {
            if (!disableDelete) {
              setHoveredAction('delete');
            }
          }}
          onMouseLeave={() => setHoveredAction(null)}
        >
          <AppIcons.Delete size={16} color={systemColors.selection.blueDark} />
        </button>
      </div>
    </div>
  );
}


