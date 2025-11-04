//--------------------------------------------------------------------
// DIALOG - CAIXA DE DIÁLOGO BASE
// Componente base para caixas de diálogo inspiradas no estilo do sistema
// Utilizado em todo o sistema para confirmações e avisos
//--------------------------------------------------------------------
import React, { ReactNode } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { useClickSound } from '../../hooks/useClickSound';

export interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  icon?: ReactNode;
  warning?: string;
  hint?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  width?: string;
}

// Componente base de diálogo seguindo o padrão do sistema
export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  icon,
  warning,
  hint,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  showCancel = true,
  width = '422px'
}: DialogProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  if (!isOpen) return null;

  const handleConfirm = () => {
    playClickSound();
    onConfirm?.();
  };

  const handleCancel = () => {
    playClickSound();
    onClose?.();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div style={systemStyles.dialog.overlay} onClick={handleOverlayClick}>
      <div style={{ ...systemStyles.dialog.container, width }} onClick={(e) => e.stopPropagation()}>
        {/* Title Bar */}
        <div style={systemStyles.dialog.titleBar} />

        {/* Body */}
        <div style={{
          ...systemStyles.dialog.body,
          paddingLeft: icon ? '108px' : '12px',
          minHeight: icon ? '92px' : 'auto'
        }}>
          {/* Icon - Container separado para garantir que não ultrapasse */}
          {icon && (
            <div style={systemStyles.dialog.icon}>
              {icon}
            </div>
          )}

          {/* Content - Container para textos */}
          <div style={{
            position: 'relative' as const,
            zIndex: 2
          }}>
            {/* Warning Message */}
            {warning && (
              <div style={systemStyles.dialog.warning}>
                {warning}
              </div>
            )}

            {/* Hint Message */}
            {hint && (
              <div style={{
                ...systemStyles.dialog.hint,
                whiteSpace: 'pre-line' as const
              }}>
                {hint}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={systemStyles.dialog.actions}>
          {showCancel && (
            <button
              type="button"
              style={systemStyles.dialog.button}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, systemStyles.dialog.buttonHover);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, systemStyles.dialog.button);
              }}
              onMouseDown={(e) => {
                Object.assign(e.currentTarget.style, systemStyles.dialog.buttonActive);
              }}
              onMouseUp={(e) => {
                Object.assign(e.currentTarget.style, systemStyles.dialog.buttonHover);
              }}
              onClick={handleCancel}
            >
              {cancelLabel}
            </button>
          )}
          {onConfirm && (
            <button
              type="button"
              style={{
                ...systemStyles.dialog.button,
                ...systemStyles.dialog.buttonConfirm
              }}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...systemStyles.dialog.button,
                  ...systemStyles.dialog.buttonConfirm,
                  ...systemStyles.dialog.buttonConfirmHover
                });
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...systemStyles.dialog.button,
                  ...systemStyles.dialog.buttonConfirm
                });
              }}
              onMouseDown={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...systemStyles.dialog.button,
                  ...systemStyles.dialog.buttonConfirm,
                  ...systemStyles.dialog.buttonConfirmActive
                });
              }}
              onMouseUp={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...systemStyles.dialog.button,
                  ...systemStyles.dialog.buttonConfirm,
                  ...systemStyles.dialog.buttonConfirmHover
                });
              }}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

