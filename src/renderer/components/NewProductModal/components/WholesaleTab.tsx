import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';

// Componente da aba Atacado - Lista de preços por quantidade
// Seguindo o estilo macOS e modularização do projeto
interface WholesaleTabProps {
  onFormDataChange?: (data: any) => void;
}

interface WholesalePrice {
  id: string;
  minimumQuantity: string;
  unitPrice: string;
}

export function WholesaleTab({ onFormDataChange }: WholesaleTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  
  // Estados dos preços de atacado
  const [wholesalePrices, setWholesalePrices] = useState<WholesalePrice[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Estados para os campos de entrada
  const [newQuantity, setNewQuantity] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Função para formatar valor monetário
  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    const amount = parseFloat(numericValue) / 100;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Função para adicionar novo preço de atacado
  const addWholesalePrice = () => {
    if (!newQuantity || !newPrice) return;
    
    playClickSound();
    const newPriceItem: WholesalePrice = {
      id: Date.now().toString(),
      minimumQuantity: newQuantity,
      unitPrice: newPrice
    };
    
    const newPrices = [...wholesalePrices, newPriceItem];
    setWholesalePrices(newPrices);
    
    // Limpar campos
    setNewQuantity('');
    setNewPrice('');
    
    if (onFormDataChange) {
      // Envia preços de atacado atualizados para o formulário pai
      onFormDataChange({ wholesalePrices: newPrices });
    }
  };

  // Função para remover preço de atacado
  const removeWholesalePrice = (id: string) => {
    playClickSound();
    const newPrices = wholesalePrices.filter(price => price.id !== id);
    setWholesalePrices(newPrices);
    
    if (onFormDataChange) {
      // Envia preços de atacado atualizados para o formulário pai
      onFormDataChange({ wholesalePrices: newPrices });
    }
  };

  // Usar a ordem original de adição (sem ordenação)
  const sortedPrices = wholesalePrices;

  return (
    <div>
      <h3 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: systemColors.text.primary,
        marginBottom: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        Preços de Atacado
      </h3>
      
      {/* Seção de configuração */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>Lista de Preços por Quantidade</h4>
        
        <div style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Como funciona:</strong> Defina preços especiais para vendas em quantidade. O sistema aplicará automaticamente o preço correspondente baseado na quantidade vendida.
          </p>
          <p style={{ margin: '0' }}>
            <strong>Exemplo:</strong> Se você vender 10 unidades, o preço unitário será o definido para "10 unidades ou mais".
          </p>
        </div>

        {/* Campos para adicionar novo preço */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          marginBottom: '16px',
          padding: '16px'
        }}>
          {/* Campo Quantidade */}
          <div style={{ flex: 1 }}>
            <label style={systemStyles.input.label}>Quantidade:</label>
            <input
              type="text"
              style={{
                ...systemStyles.input.field
              }}
              value={newQuantity}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                setNewQuantity(numericValue);
              }}
              onFocus={() => setFocusedField('newQuantity')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: 10"
            />
          </div>

          {/* Campo Preço */}
          <div style={{ flex: 1 }}>
            <label style={systemStyles.input.label}>Preço Unitário:</label>
            <input
              type="text"
              style={{
                ...systemStyles.input.field
              }}
              value={newPrice}
              onChange={(e) => {
                const formatted = formatCurrency(e.target.value);
                  setNewPrice(formatted);
              }}
              onFocus={() => setFocusedField('newPrice')}
              onBlur={() => setFocusedField(null)}
              placeholder="R$ 0,00"
            />
          </div>

          {/* Botão Adicionar */}
          <button
            type="button"
            style={{
              ...systemStyles.button.primary,
              minWidth: '100px',
              height: '28px',
              alignSelf: 'flex-end'
            }}
            onClick={addWholesalePrice}
            disabled={!newQuantity || !newPrice}
          >
            Adicionar
          </button>
        </div>

        {/* Lista de preços */}
        {sortedPrices.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '8px'
          }}>
            {sortedPrices.map((price, index) => (
              <div
                key={price.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d0d0d0',
                  borderRadius: '6px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    minWidth: '60px'
                  }}>
                    #{index + 1}
                  </span>
                  
                  <div style={{
                    fontSize: '13px',
                    color: '#333',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    <strong>{price.minimumQuantity} unidades</strong> ou mais
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#007aff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    {price.unitPrice}
                  </div>
                </div>
                
                <button
                  type="button"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1px solid #ff3b30',
                    background: '#ff3b30',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => removeWholesalePrice(price.id)}
                  title="Remover preço"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center' as const,
            padding: '40px 20px',
            color: '#999',
            fontStyle: 'italic',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            Nenhum preço de atacado cadastrado
            <br />
            Preencha os campos acima e clique em "Adicionar" para começar
          </div>
        )}
      </div>

      {/* Seção de exemplo */}
      <div style={{
        marginBottom: '24px',
        backgroundColor: '#f0f8ff',
        borderColor: '#b0d4f1',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #b0d4f1'
      }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#0066cc',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          Exemplo Prático
        </h4>
        
        <div style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.5',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Produto:</strong> Arroz 1KG - Preço normal: R$ 5,00
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Preços de atacado:</strong>
          </p>
          <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }}>
            <li>10 unidades ou mais: R$ 4,50</li>
            <li>30 unidades ou mais: R$ 4,00</li>
          </ul>
          <p style={{ margin: '0' }}>
            <strong>Resultado:</strong> Venda de 1-9 unidades = R$ 5,00 | 10-29 unidades = R$ 4,50 | 30+ unidades = R$ 4,00
          </p>
        </div>
      </div>
    </div>
  );
}
