import React, { useState } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { useClickSound } from '../../hooks/useClickSound';
import { MainTab, TaxTab, WholesaleTab, IngredientsTab, VariationsTab } from './components';
import { WindowHeader } from '../WindowHeader/WindowHeader';

// Modal de cadastro de novo produto
// Componente modularizado seguindo as regras do projeto
interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProductType = 'simple' | 'variation';
type TabType = 'principal' | 'fiscal' | 'atacado' | 'insumos' | 'variacoes';

export function NewProductModal({ isOpen, onClose }: NewProductModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [productType, setProductType] = useState<ProductType>('simple');
  const [activeTab, setActiveTab] = useState<TabType>('principal');
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  
  // Estado para dados do formulário principal
  const [principalFormData, setPrincipalFormData] = useState<any>(null);
  
  // Contador para códigos de produto (simulado)
  const [productCounter, setProductCounter] = useState(1);

  if (!isOpen) return null;

  // Definir abas disponíveis baseado no tipo de produto
  const availableTabs: { key: TabType; label: string }[] = [
    { key: 'principal', label: 'Principal' },
    { key: 'fiscal', label: 'Fiscal' },
    { key: 'atacado', label: 'Atacado' },
    { key: 'insumos', label: 'Insumos' }
  ];

  // Adicionar aba de variações apenas se for produto com variação
  if (productType === 'variation') {
    availableTabs.push({ key: 'variacoes', label: 'Variações' });
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'principal':
        return <MainTab onFormDataChange={setPrincipalFormData} />;
      case 'fiscal':
        return <TaxTab />;
      case 'atacado':
        return <WholesaleTab />;
      case 'insumos':
        return <IngredientsTab />;
      case 'variacoes':
        return <VariationsTab />;
      default:
        return <MainTab onFormDataChange={setPrincipalFormData} />;
    }
  };

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={{
        ...systemStyles.window,
        background: systemColors.background.window,
        width: '900px',
        maxWidth: '90vw',
        height: '85vh',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden'
      }}>
        <WindowHeader title="Novo Produto" onClose={onClose} />

        {/* Seletor de tipo */}
        <div style={{
          padding: '16px 20px',
          background: systemColors.background.primary,
          borderBottom: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: systemColors.text.label,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>Tipo de cadastro:</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={systemStyles.radio.container} onClick={() => {
              playClickSound();
              setProductType('simple');
            }}>
              <div style={{
                ...systemStyles.radio.circle,
                ...(productType === 'simple' ? systemStyles.radio.circleChecked : {})
              }}>
                {productType === 'simple' && <div style={systemStyles.radio.dot} />}
              </div>
              <span style={systemStyles.radio.label}>Simples</span>
            </div>
            <div style={systemStyles.radio.container} onClick={() => {
              playClickSound();
              setProductType('variation');
            }}>
              <div style={{
                ...systemStyles.radio.circle,
                ...(productType === 'variation' ? systemStyles.radio.circleChecked : {})
              }}>
                {productType === 'variation' && <div style={systemStyles.radio.dot} />}
              </div>
              <span style={systemStyles.radio.label}>Com Variação</span>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div style={{
          ...systemStyles.tabs.container,
          flexShrink: 0
        }}>
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              style={{
                ...systemStyles.tabs.tab,
                ...(activeTab === tab.key ? systemStyles.tabs.tabActive : {})
              }}
              onClick={() => {
                playClickSound();
                setActiveTab(tab.key);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo da aba */}
        <div style={{
          background: systemColors.background.content,
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          minHeight: 0
        }}>
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          background: systemColors.background.primary,
          borderTop: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <button 
            style={{
              ...systemStyles.button.default
            }}
            onClick={() => {
              playClickSound();
              onClose();
            }}
          >
            Cancelar
          </button>
          <button 
            style={{
              ...systemStyles.button.primary
            }}
            onClick={() => {
              playClickSound();
              
              // Gerar código do produto
              const productCode = productCounter.toString();
              
              // Preparar dados completos do produto
              const productData = {
                codigo: productCode,
                tipo: productType,
                ...principalFormData
              };
              
              // TODO: Implementar salvamento do produto
              console.log('Salvando produto:', productData);
              
              // Incrementar contador para próximo produto
              setProductCounter(prev => prev + 1);
              
              // Fechar modal
              onClose();
            }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

