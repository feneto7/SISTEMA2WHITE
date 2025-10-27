import React, { useState } from 'react';
import { modalStyles } from '../../styles/modalStyles';
import { systemStyles, systemColors } from '../../styles/systemStyle';
import { useClickSound } from '../../hooks/useClickSound';
import { MainTab, TaxTab, WholesaleTab, IngredientsTab, VariationsTab } from './components';

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

  const styles = modalStyles;

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={{
        ...styles.container,
        ...systemStyles.window,
        background: systemColors.background.window
      }}>
        {/* Header com botões de controle macOS */}
        <div style={{
          ...systemStyles.titleBar,
          position: 'relative'
        }}>
          {/* Botões de controle (traffic lights) */}
          <div style={systemStyles.trafficLights.container}>
            <button
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.red
              }}
              onClick={() => {
                playClickSound();
                onClose();
              }}
              onMouseEnter={() => setIsCloseHovered(true)}
              onMouseLeave={() => setIsCloseHovered(false)}
              title="Fechar"
            />
            <button
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.yellow
              }}
              onClick={() => {
                playClickSound();
                // Minimizar modal (implementar depois)
              }}
              title="Minimizar"
            />
            <button
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.green
              }}
              onClick={() => {
                playClickSound();
                // Maximizar modal (implementar depois)
              }}
              title="Maximizar"
            />
          </div>

          <h2 style={systemStyles.titleBarTitle}>Novo Produto</h2>
          <div style={{ width: '60px' }}></div> {/* Espaçador para centralizar o título */}
        </div>

        {/* Seletor de tipo */}
        <div style={{
          padding: '16px 20px',
          background: systemColors.background.primary,
          borderBottom: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
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
        <div style={systemStyles.tabs.container}>
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
          ...styles.tabContent,
          background: systemColors.background.content,
          flex: 1,
          overflow: 'auto',
          padding: '20px'
        }}>
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          background: systemColors.background.primary,
          borderTop: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button 
            style={{
              ...systemStyles.button.default,
              ...(isCancelHovered ? systemStyles.button.defaultHover : {})
            }}
            onMouseEnter={() => setIsCancelHovered(true)}
            onMouseLeave={() => setIsCancelHovered(false)}
            onClick={() => {
              playClickSound();
              onClose();
            }}
          >
            Cancelar
          </button>
          <button 
            style={{
              ...systemStyles.button.primary,
              ...(isSaveHovered ? systemStyles.button.primaryHover : {})
            }}
            onMouseEnter={() => setIsSaveHovered(true)}
            onMouseLeave={() => setIsSaveHovered(false)}
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

