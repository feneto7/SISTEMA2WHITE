import React, { useState } from 'react';
import { modalStyles } from '../../../styles/modalStyles';
import { useClickSound } from '../../../hooks/useClickSound';

// Componente da aba Principal - Formulário de cadastro básico de produto
// Seguindo o estilo macOS e modularização do projeto
interface MainTabProps {
  onFormDataChange?: (data: any) => void;
}

export function MainTab({ onFormDataChange }: MainTabProps): JSX.Element {
  const playClickSound = useClickSound();
  
  // Estados dos campos do formulário
  const [formData, setFormData] = useState({
    descricao: '',
    categoria: '',
    unidadeMedida: '',
    codigoBarras: '',
    precoCusto: '',
    margem: '',
    precoVenda: '',
    referencia: '',
    marca: '',
    fornecedor: ''
  });

  // Estados de foco dos campos
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Função para atualizar dados do formulário
  const handleInputChange = (field: string, value: string) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    
    // Notificar componente pai sobre mudanças
    if (onFormDataChange) {
      onFormDataChange(newData);
    }
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: string): string => {
    // Remover tudo exceto números
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    // Converter para centavos e depois para reais
    const amount = parseFloat(numericValue) / 100;
    
    // Formatar para moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Função para calcular preço de venda baseado na margem
  const calculateSellingPrice = (cost: string, margin: string): string => {
    // Remover formatação e converter para número
    const costValue = parseFloat(cost.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const marginValue = parseFloat(margin.replace(/[^\d]/g, '')) || 0;
    
    if (costValue > 0 && marginValue > 0) {
      // Calcular preço de venda: custo * (1 + margem/100)
      const sellingPrice = costValue * (1 + marginValue / 100);
      
      // Formatar para moeda brasileira
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(sellingPrice);
    }
    
    return '';
  };

  // Opções para dropdowns
  const categorias = [
    'Eletrônicos',
    'Roupas',
    'Casa e Jardim',
    'Esportes',
    'Livros',
    'Beleza',
    'Automotivo',
    'Outros'
  ];

  const unidadesMedida = [
    'Unidade',
    'Kg',
    'Litro',
    'Metro',
    'Caixa',
    'Pacote',
    'Dúzia',
    'Grama'
  ];

  const marcas = [
    'Apple',
    'Samsung',
    'Nike',
    'Adidas',
    'Sony',
    'LG',
    'Philips',
    'Outros'
  ];

  const fornecedores = [
    'Fornecedor A',
    'Fornecedor B',
    'Fornecedor C',
    'Distribuidor X',
    'Distribuidor Y',
    'Outros'
  ];

  return (
    <div>
      <h3 style={modalStyles.tabContentTitle}>
        Informações Principais
      </h3>
      
      {/* Seção de Identificação */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Identificação</h4>
        
        <div style={modalStyles.formGrid}>
           {/* Código */}
           <div style={modalStyles.formGroup}>
             <label style={modalStyles.formLabel}>Código:</label>
             <input
               type="text"
               style={{
                 ...modalStyles.formInput,
                 backgroundColor: '#f5f5f5',
                 color: '#666',
                 cursor: 'not-allowed',
                 opacity: 0.7
               }}
               value=""
               readOnly
               disabled
               placeholder="Será gerado automaticamente ao salvar"
             />
           </div>

          {/* Descrição */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Descrição:</label>
            <input
              type="text"
               style={{
                 ...modalStyles.formInput,
                 ...(focusedField === 'descricao' ? modalStyles.formInputFocus : {})
               }}
              value={formData.descricao}
              onChange={(e) => {
                handleInputChange('descricao', e.target.value);
              }}
              onClick={playClickSound}
              onFocus={() => setFocusedField('descricao')}
              onBlur={() => setFocusedField(null)}
              placeholder="Nome do produto"
            />
          </div>

          {/* Categoria */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Categoria:</label>
            <select
               style={{
                 ...modalStyles.formSelect,
                 ...(focusedField === 'categoria' ? modalStyles.formInputFocus : {})
               }}
              value={formData.categoria}
              onChange={(e) => {
                handleInputChange('categoria', e.target.value);
              }}
              onClick={playClickSound}
              onFocus={() => setFocusedField('categoria')}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          {/* Unidade de Medida */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Unidade de Medida:</label>
            <select
               style={{
                 ...modalStyles.formSelect,
                 ...(focusedField === 'unidadeMedida' ? modalStyles.formInputFocus : {})
               }}
              value={formData.unidadeMedida}
              onChange={(e) => {
                handleInputChange('unidadeMedida', e.target.value);
              }}
              onClick={playClickSound}
              onFocus={() => setFocusedField('unidadeMedida')}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">Selecione a unidade</option>
              {unidadesMedida.map(unidade => (
                <option key={unidade} value={unidade}>{unidade}</option>
              ))}
            </select>
          </div>

          {/* Código de Barras */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Código de Barras:</label>
            <input
              type="text"
               style={{
                 ...modalStyles.formInput,
                 ...(focusedField === 'codigoBarras' ? modalStyles.formInputFocus : {})
               }}
              value={formData.codigoBarras}
              onChange={(e) => {
                handleInputChange('codigoBarras', e.target.value);
              }}
              onClick={playClickSound}
              onFocus={() => setFocusedField('codigoBarras')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: 7891234567890"
            />
          </div>

          {/* Referência */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Referência:</label>
            <input
              type="text"
               style={{
                 ...modalStyles.formInput,
                 ...(focusedField === 'referencia' ? modalStyles.formInputFocus : {})
               }}
              value={formData.referencia}
              onChange={(e) => {
                playClickSound();
                handleInputChange('referencia', e.target.value);
              }}
              onFocus={() => setFocusedField('referencia')}
              onBlur={() => setFocusedField(null)}
              placeholder="Código de referência"
            />
          </div>
        </div>
      </div>

      {/* Seção de Preços */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Preços</h4>
        
        <div style={modalStyles.formGrid}>
          {/* Preço de Custo */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Preço de Custo:</label>
            <input
              type="text"
               style={{
                 ...modalStyles.formInput,
                 ...(focusedField === 'precoCusto' ? modalStyles.formInputFocus : {})
               }}
              value={formData.precoCusto}
              onChange={(e) => {
                playClickSound();
                const formatted = formatCurrency(e.target.value);
                handleInputChange('precoCusto', formatted);
                
                // Calcular preço de venda automaticamente se há margem
                if (formData.margem) {
                  const marginValue = formData.margem.replace(/\D/g, '');
                  if (marginValue) {
                    const sellingPrice = calculateSellingPrice(formatted, formData.margem);
                    handleInputChange('precoVenda', sellingPrice);
                  }
                }
              }}
              onFocus={() => setFocusedField('precoCusto')}
              onBlur={() => setFocusedField(null)}
              placeholder="R$ 0,00"
            />
          </div>

          {/* Margem */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Margem (%):</label>
            <input
              type="text"
               style={{
                 ...modalStyles.formInput,
                 ...(focusedField === 'margem' ? modalStyles.formInputFocus : {})
               }}
              value={formData.margem}
              onChange={(e) => {
                playClickSound();
                const numericValue = e.target.value.replace(/\D/g, '');
                const formatted = numericValue ? `${numericValue}%` : '';
                handleInputChange('margem', formatted);
                
                // Calcular preço de venda automaticamente
                if (formData.precoCusto && numericValue) {
                  const sellingPrice = calculateSellingPrice(formData.precoCusto, formatted);
                  handleInputChange('precoVenda', sellingPrice);
                }
              }}
              onFocus={() => setFocusedField('margem')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: 30%"
            />
          </div>

          {/* Preço de Venda */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Preço de Venda:</label>
            <input
              type="text"
               style={{
                 ...modalStyles.formInput,
                 ...(focusedField === 'precoVenda' ? modalStyles.formInputFocus : {})
               }}
              value={formData.precoVenda}
              onChange={(e) => {
                playClickSound();
                const formatted = formatCurrency(e.target.value);
                handleInputChange('precoVenda', formatted);
              }}
              onFocus={() => setFocusedField('precoVenda')}
              onBlur={() => setFocusedField(null)}
              placeholder="R$ 0,00"
            />
          </div>
        </div>
      </div>

      {/* Seção de Fornecedor */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Fornecedor</h4>
        
        <div style={modalStyles.formGrid}>
          {/* Marca */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Marca:</label>
            <select
               style={{
                 ...modalStyles.formSelect,
                 ...(focusedField === 'marca' ? modalStyles.formInputFocus : {})
               }}
              value={formData.marca}
              onChange={(e) => {
                playClickSound();
                handleInputChange('marca', e.target.value);
              }}
              onFocus={() => setFocusedField('marca')}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">Selecione uma marca</option>
              {marcas.map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          {/* Fornecedor */}
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Fornecedor:</label>
            <select
               style={{
                 ...modalStyles.formSelect,
                 ...(focusedField === 'fornecedor' ? modalStyles.formInputFocus : {})
               }}
              value={formData.fornecedor}
              onChange={(e) => {
                playClickSound();
                handleInputChange('fornecedor', e.target.value);
              }}
              onFocus={() => setFocusedField('fornecedor')}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map(fornecedor => (
                <option key={fornecedor} value={fornecedor}>{fornecedor}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
