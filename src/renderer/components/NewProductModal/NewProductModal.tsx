import React, { useState } from 'react';
import { modalStyles } from '../../styles/modalStyles';
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
      <div style={styles.container}>
        {/* Header com botões de controle macOS */}
        <div style={styles.header}>
          {/* Botões de controle (traffic lights) */}
          <div style={styles.trafficLights}>
            <button
              style={{
                ...styles.trafficLight,
                ...styles.trafficLightRed
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
                ...styles.trafficLight,
                ...styles.trafficLightYellow
              }}
              onClick={() => {
                playClickSound();
                // Minimizar modal (implementar depois)
              }}
              title="Minimizar"
            />
            <button
              style={{
                ...styles.trafficLight,
                ...styles.trafficLightGreen
              }}
              onClick={() => {
                playClickSound();
                // Maximizar modal (implementar depois)
              }}
              title="Maximizar"
            />
          </div>

          <h2 style={styles.title}>Novo Produto</h2>
          <div style={{ width: '60px' }}></div> {/* Espaçador para centralizar o título */}
        </div>

        {/* Seletor de tipo */}
        <div style={styles.typeSelector}>
          <span style={styles.typeLabel}>Tipo de cadastro:</span>
          <div style={styles.checkboxGroup}>
            <div style={styles.checkboxItem} onClick={() => {
              playClickSound();
              setProductType('simple');
            }}>
              <div style={{
                ...styles.checkbox,
                ...(productType === 'simple' ? styles.checkboxChecked : {})
              }}>
                {productType === 'simple' && <div style={styles.checkboxDot} />}
              </div>
              <span style={styles.checkboxLabel}>Simples</span>
            </div>
            <div style={styles.checkboxItem} onClick={() => {
              playClickSound();
              setProductType('variation');
            }}>
              <div style={{
                ...styles.checkbox,
                ...(productType === 'variation' ? styles.checkboxChecked : {})
              }}>
                {productType === 'variation' && <div style={styles.checkboxDot} />}
              </div>
              <span style={styles.checkboxLabel}>Com Variação</span>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div style={styles.tabsContainer}>
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              style={{
                ...styles.tab,
                ...(activeTab === tab.key ? styles.tabActive : {})
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
        <div style={styles.tabContent}>
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button 
            style={{
              ...styles.button,
              ...(isCancelHovered ? styles.buttonHover : {})
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
              ...styles.button,
              ...styles.buttonPrimary,
              ...(isSaveHovered ? styles.buttonPrimaryHover : {})
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

