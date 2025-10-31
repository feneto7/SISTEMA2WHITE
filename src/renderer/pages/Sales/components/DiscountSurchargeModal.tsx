//--------------------------------------------------------------------
// MODAL DE DESCONTO / ACRÉSCIMO
// Permite informar desconto ou acréscimo por Porcentagem ou Valor
// Acionado por CTRL+O no PDV (Sales)
//--------------------------------------------------------------------

import React from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { formatMoneyInput, convertReaisToCents, convertCentsToReais } from '../../../utils/money';
import { formatPercentageInput, parsePercentage } from '../../../utils/percentageFormatter';
import { WindowHeader } from '../../../components/WindowHeader/WindowHeader';

type AdjustmentMode = 'discount' | 'addition';
type InputKind = 'percent' | 'value';

interface DiscountSurchargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (params: { mode: AdjustmentMode; kind: InputKind; amount: number }) => void; // amount: percent (0-100) ou cents
  referenceCents: number; // usado para exibir placeholder
}

export function DiscountSurchargeModal({ isOpen, onClose, onConfirm, referenceCents }: DiscountSurchargeModalProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const [mode, setMode] = React.useState<AdjustmentMode>('discount');
  const [kind, setKind] = React.useState<InputKind>('percent');
  const [value, setValue] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setMode('discount');
      setKind('percent');
      setValue('');
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
      const t = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (kind === 'percent') {
      const percent = Math.max(0, Math.min(100, parsePercentage(value || '0')));
      onConfirm({ mode, kind, amount: percent });
    } else {
      const cents = Math.max(0, convertReaisToCents(value || '0'));
      onConfirm({ mode, kind, amount: cents });
    }
    onClose();
  };

  const styles = {
    modal: { ...systemStyles.modal.container, width: '420px', height: 'auto', maxHeight: 'unset' },
    content: { padding: '12px', display: 'flex', flexDirection: 'column' as const, gap: '10px' },
    summaryInline: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 10px',
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '8px',
      background: systemColors.background.primary
    },
    summaryTitle: { fontSize: '11px', color: systemColors.text.secondary, margin: 0 },
    summaryValue: { fontSize: '14px', fontWeight: 700, color: systemColors.text.primary, margin: 0 },
    sectionTitle: { fontSize: '11px', color: systemColors.text.secondary, margin: '2px 0 4px 2px', fontWeight: 600 },
    group: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
    segButton: {
      padding: '10px 12px',
      height: '48px',
      borderRadius: '10px',
      border: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary,
      color: systemColors.text.primary,
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    segButtonActive: {
      background: systemColors.selection.background,
      color: systemColors.selection.blue,
      border: `1px solid ${systemColors.selection.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    label: { fontSize: '12px', color: systemColors.text.secondary, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '10px',
      border: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary,
      color: systemColors.text.primary,
      fontSize: '18px',
      fontWeight: 700,
      outline: 'none',
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
    },
    footer: { display: 'flex', justifyContent: 'space-between', gap: '8px', paddingTop: '8px' },
    footerLeft: { display: 'flex', gap: '8px' },
    footerRight: { display: 'flex', gap: '8px' },
    button: {
      padding: '8px 12px', borderRadius: '10px', border: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary, color: systemColors.text.primary, cursor: 'pointer', fontSize: '12px', fontWeight: 700
    },
    buttonPrimary: { background: systemColors.selection.background, color: systemColors.selection.blue, border: `1px solid ${systemColors.selection.border}` }
  } as const;

  const handleChange = (v: string) => {
    setValue(kind === 'percent' ? formatPercentageInput(v) : formatMoneyInput(v));
  };

  const placeholder = kind === 'percent' ? '0,00' : convertCentsToReais(referenceCents);
  const fieldTitle = kind === 'percent'
    ? `${mode === 'discount' ? 'Desconto' : 'Acréscimo'} (%)`
    : `${mode === 'discount' ? 'Desconto' : 'Acréscimo'} (R$)`;

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={styles.modal}>
        <WindowHeader title="Desconto / Acréscimo" onClose={onClose} />

        {/* Conteúdo */}
        <div style={styles.content}>
          {/* Total Original (compact) */}
          <div style={styles.summaryInline}>
            <p style={styles.summaryTitle as React.CSSProperties}>Total Original</p>
            <p style={styles.summaryValue as React.CSSProperties}>{convertCentsToReais(referenceCents)}</p>
          </div>

          {/* Tipo de Ajuste */}
          <div style={styles.sectionTitle}>Tipo de Ajuste</div>
          <div style={styles.group}>
            <button
              style={{ ...(styles.segButton as React.CSSProperties), ...(kind === 'percent' ? (styles.segButtonActive as React.CSSProperties) : {}) }}
              onClick={() => setKind('percent')}
            >
              %
              <br />
              Porcentagem
            </button>
            <button
              style={{ ...(styles.segButton as React.CSSProperties), ...(kind === 'value' ? (styles.segButtonActive as React.CSSProperties) : {}) }}
              onClick={() => setKind('value')}
            >
              R$
              <br />
              Valor Fixo
            </button>
          </div>

          {/* Natureza do Ajuste */}
          <div style={styles.sectionTitle}>Natureza do Ajuste</div>
          <div style={styles.group}>
            <button
              style={{ ...(styles.segButton as React.CSSProperties), ...(mode === 'discount' ? (styles.segButtonActive as React.CSSProperties) : {}) }}
              onClick={() => setMode('discount')}
            >
              –
              <br />
              Desconto
            </button>
            <button
              style={{ ...(styles.segButton as React.CSSProperties), ...(mode === 'addition' ? (styles.segButtonActive as React.CSSProperties) : {}) }}
              onClick={() => setMode('addition')}
            >
              +
              <br />
              Acréscimo
            </button>
          </div>

          <div style={styles.label}>{fieldTitle}</div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); } }}
            style={styles.input as React.CSSProperties}
            placeholder={placeholder}
            autoFocus
          />

          <div style={styles.footer}>
            <div style={styles.footerLeft as React.CSSProperties}>
              <button style={styles.button as React.CSSProperties} onClick={onClose}>Cancelar</button>
            </div>
            <div style={styles.footerRight as React.CSSProperties}>
              <button style={{ ...(styles.button as React.CSSProperties), ...(styles.buttonPrimary as React.CSSProperties) }} onClick={handleConfirm}>Aplicar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


