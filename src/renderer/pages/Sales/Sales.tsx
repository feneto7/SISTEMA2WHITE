//--------------------------------------------------------------------
// PÁGINA DE VENDAS (PDV)
// Sistema de Ponto de Venda - Interface principal para vendas
// Integra todos os componentes do sistema de vendas
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../router/Navigation';
import { BackButton } from '../../components/BackButton';
import { SalesSidebar, ProductInput, ProductList, SalesFooter, ClientSelectModal, PaymentModal, DiscountSurchargeModal, FinishSaleModal } from './components';
import { formatPercentage } from '../../utils/percentageFormatter';
import { SaleProduct } from './components/ProductList';
import { convertReaisToCents } from '../../utils/money';
import { useTheme } from '../../styles/ThemeProvider';

interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  phone?: string;
  city?: string;
}

interface PaymentEntry {
  method: string; // Dinheiro, Débito, Crédito, PIX, Carnê
  amountCents: number;
}

function Sales(): JSX.Element {
  const { navigate } = useNavigation();
  const { systemStyles, systemColors } = useTheme();
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustment, setAdjustment] = useState<{ mode: 'discount' | 'addition'; kind: 'percent' | 'value'; amount: number } | null>(null);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  // Calcula totais da venda
  const subtotal = products.reduce((sum, product) => sum + product.subtotal, 0);
  // Aplica desconto/acréscimo
  let adjustmentCents = 0;
  if (adjustment) {
    if (adjustment.kind === 'percent') {
      const base = subtotal;
      adjustmentCents = Math.round(base * (adjustment.amount / 100));
    } else {
      adjustmentCents = adjustment.amount;
    }
    if (adjustment.mode === 'discount') {
      adjustmentCents = -Math.abs(adjustmentCents);
    } else {
      adjustmentCents = Math.abs(adjustmentCents);
    }
  }
  const total = Math.max(subtotal + adjustmentCents, 0);
  const discount = adjustment && adjustment.mode === 'discount' ? Math.abs(adjustmentCents) : 0;
  const totalPaid = payments.reduce((sum, p) => sum + p.amountCents, 0);
  const remaining = Math.max(total - totalPaid, 0);
  const itemsCount = products.length;

  // Adiciona produto à lista
  const handleAddProduct = (productName: string, quantity: string, unitPrice: string) => {
    const qty = parseFloat(quantity.replace(',', '.')) || 0;
    const price = convertReaisToCents(unitPrice);
    const subtotal = Math.round(qty * price);

    const newProduct: SaleProduct = {
      id: Date.now().toString(),
      name: productName,
      quantity: quantity,
      unitPrice: price,
      subtotal: subtotal
    };

    setProducts([...products, newProduct]);
  };

  // Remove produto da lista
  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Handler para selecionar cliente
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    console.log('Cliente selecionado:', client);
  };

  // Listener de teclado para abrir modal de cliente (CTRL+I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsClientModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listener de teclado para formas de pagamento (F1..F5)
  useEffect(() => {
    const handlePaymentKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let method = '';
      if (key === 'f1') method = 'Dinheiro';
      if (key === 'f2') method = 'Débito';
      if (key === 'f3') method = 'Crédito';
      if (key === 'f4') method = 'PIX';
      if (key === 'f5') method = 'Carnê';
      // Bloqueia quando já usado ou sem saldo restante
      const alreadyUsed = payments.some(p => p.method === method);
      if (method && !alreadyUsed && remaining > 0) {
        e.preventDefault();
        setPaymentMethod(method);
        setIsPaymentModalOpen(true);
      }
    };

    window.addEventListener('keydown', handlePaymentKeys);
    return () => window.removeEventListener('keydown', handlePaymentKeys);
  }, [payments, remaining]);

  // Atalho CTRL+O para abrir modal de desconto/acréscimo
  useEffect(() => {
    const handleAdjustShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsAdjustModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleAdjustShortcut);
    return () => window.removeEventListener('keydown', handleAdjustShortcut);
  }, []);

  // Tecla Delete: limpa todos os pagamentos informados
  useEffect(() => {
    const handleClearPayments = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        if (payments.length > 0) {
          e.preventDefault();
          setPayments([]);
        }
      }
    };
    window.addEventListener('keydown', handleClearPayments);
    return () => window.removeEventListener('keydown', handleClearPayments);
  }, [payments]);

  // F11: alterna tela cheia
  useEffect(() => {
    const handleFullscreen = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === 'F11' || key.toLowerCase() === 'f11') {
        // Intercepta antes do atalho do navegador
        e.preventDefault();
        e.stopPropagation();

        const doc: any = document as any;
        const el: any = document.documentElement as any;
        const isFull = !!(document.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);

        try {
          if (!isFull) {
            const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
            req && req.call(el);
          } else {
            const exit = document.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
            exit && exit.call(document);
          }
        } catch (err) {
          // Silencia erros de fullscreen (policy/permissions)
        }
      }
    };
    // Usa capture true para pegar antes do default do navegador
    window.addEventListener('keydown', handleFullscreen, { capture: true });
    return () => window.removeEventListener('keydown', handleFullscreen, { capture: true } as any);
  }, []);

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      background: systemColors.background.content,
      padding: '20px',
      gap: '20px'
    },
    header: {
      ...systemStyles.page.header,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '12px 20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    headerCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerRight: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    clientBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      background: systemColors.background.primary,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '500',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.2s ease'
    },
    clientIcon: {
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #5A9EDD, #3B7BC4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontSize: '9px',
      fontWeight: '600'
    },
    clientName: {
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const
    },
    title: {
      ...systemStyles.page.title,
      fontSize: '28px',
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      margin: 0
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden',
      gap: '20px',
      background: systemColors.background.content
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px'
    },
    footer: {
      background: systemColors.background.primary,
      padding: '12px 0',
      borderRadius: '10px',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${systemColors.border.light}`
    }
  };

  return (
    <div style={styles.container}>
      {/* Header com botão voltar e título */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <BackButton onClick={() => navigate('home')} label="Voltar para Home" />
        </div>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>PDV</h1>
        </div>
        <div style={styles.headerRight}>
          {selectedClient && (
            <div style={styles.clientBadge}>
              <div style={styles.clientIcon}>
                {selectedClient.name.charAt(0).toUpperCase()}
              </div>
              <span style={styles.clientName}>{selectedClient.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div style={styles.mainContent}>
        {/* Sidebar esquerdo com totais */}
      <SalesSidebar
          subtotal={subtotal}
          discount={discount}
          total={remaining}
          itemsCount={itemsCount}
          payments={payments}
          adjustment={adjustment ? {
            label: (() => {
              const base = subtotal || 1; // evita divisão por zero
              const pct = adjustment.kind === 'percent' ? adjustment.amount : (Math.abs(adjustmentCents) / base * 100);
              const pctLabel = formatPercentage(Number(pct.toFixed(2)));
              return `${adjustment.mode === 'discount' ? 'Desconto' : 'Acréscimo'} (${pctLabel})`;
            })(),
            valueCents: Math.abs(adjustmentCents)
          } : undefined}
        />

        {/* Painel direito com input e lista */}
        <div style={styles.rightPanel}>
          {/* Input de produtos */}
          <ProductInput onAddProduct={handleAddProduct} />

          {/* Lista de produtos */}
          <ProductList products={products} onRemoveProduct={handleRemoveProduct} />
        </div>
      </div>

      {/* Footer com teclas de atalho */}
      <div style={styles.footer}>
        <SalesFooter />
      </div>

      {/* Modal de seleção de cliente */}
      <ClientSelectModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSelectClient={handleSelectClient}
      />

      {/* Modal de pagamento (F1..F5) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        methodLabel={paymentMethod}
        totalCents={remaining}
        onConfirm={(paidCents) => {
          if (paidCents <= 0) return;
          
          // Adiciona o pagamento
          setPayments(prev => {
            const newPayments = [...prev, { method: paymentMethod, amountCents: paidCents }];
            
            // Verifica se o total pago >= total da venda (após adicionar este pagamento)
            const newTotalPaid = newPayments.reduce((sum, p) => sum + p.amountCents, 0);
            if (newTotalPaid >= total) {
              // Abre modal de finalização automaticamente
              setTimeout(() => setIsFinishModalOpen(true), 100);
            }
            
            return newPayments;
          });
          
          console.log('Pagamento confirmado:', { method: paymentMethod, paidCents });
        }}
        allowOverpayment={paymentMethod === 'Dinheiro'}
      />

      {/* Modal de Finalização de Venda */}
      <FinishSaleModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onFinish={() => {
          console.log('Venda finalizada!', { total, payments });
          // TODO: Implementar lógica de finalização da venda
          setIsFinishModalOpen(false);
          // Opcional: limpar estado e voltar para home
        }}
        totalSaleCents={total}
        payments={payments}
      />

      {/* Modal de Desconto/Acréscimo (CTRL+O) */}
      <DiscountSurchargeModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        referenceCents={subtotal}
        onConfirm={({ mode, kind, amount }) => {
          setAdjustment({ mode, kind, amount });
        }}
      />
    </div>
  );
}

export default Sales;


