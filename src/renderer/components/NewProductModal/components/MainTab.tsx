import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';
import { AddButton } from '../../AddButton/AddButton';
import { NewCategoryModal } from '../../NewCategoryModal/NewCategoryModal';
import { AppIcons } from '../../Icons/AppIcons';

// Componente da aba Principal - Formulário de cadastro básico de produto
// Seguindo o estilo macOS e modularização do projeto
interface MainTabProps {
  onFormDataChange?: (data: any) => void;
}

export function MainTab({ onFormDataChange }: MainTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  
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

  // Opções para dropdowns (categorias mantidas em estado para permitir criação via modal)
  const [categories, setCategories] = useState<string[]>([
    'Eletrônicos',
    'Roupas',
    'Casa e Jardim',
    'Esportes',
    'Livros',
    'Beleza',
    'Automotivo',
    'Outros'
  ]);

  // Controle do modal de nova categoria
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

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

  // Estado do formulário de outras unidades de medida
  const [otherUnitMeasure, setOtherUnitMeasure] = useState('');
  const [otherUnitQuantity, setOtherUnitQuantity] = useState('');
  const [otherUnitUnitPrice, setOtherUnitUnitPrice] = useState('');
  const [additionalUnits, setAdditionalUnits] = useState<Array<{
    unit: string;
    quantity: number;
    unitPrice: number;
  }>>([]);

  return (
    <div>
      <h3 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: systemColors.text.primary,
        marginBottom: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        Informações Principais
      </h3>
      
      {/* Seção de Identificação */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>Identificação</h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
           {/* Código */}
           <div style={systemStyles.input.container}>
             <label style={systemStyles.input.label}>Código:</label>
             <input
               type="text"
               style={{
                 ...systemStyles.input.field,
                 ...systemStyles.button.disabled
               }}
               value=""
               readOnly
               disabled
               placeholder="Será gerado automaticamente ao salvar"
             />
           </div>

          {/* Descrição */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Descrição:</label>
            <input
              type="text"
               style={{
                 ...systemStyles.input.field
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

          {/* Categoria com botão de adicionar ao lado (mesma grid) */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Categoria:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
              <div style={{ ...systemStyles.select.container, flex: 1 }}>
                <select
                   style={{
                     ...systemStyles.select.field,
                     width: '100%'
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
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div style={systemStyles.select.arrow}>
                  <div style={systemStyles.select.arrowIcon} />
                </div>
              </div>
              <AddButton
                label="Adicionar categoria"
                onClick={() => {
                  playClickSound();
                  setIsCategoryModalOpen(true);
                }}
              />
            </div>
          </div>

          {/* Unidade de Medida com botão de adicionar ao lado */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Unidade de Medida:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
              <div style={{ ...systemStyles.select.container, flex: 1 }}>
                <select
                   style={{
                     ...systemStyles.select.field,
                     width: '100%'
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
                <div style={systemStyles.select.arrow}>
                  <div style={systemStyles.select.arrowIcon} />
                </div>
              </div>
              <AddButton
                label="Adicionar unidade"
                onClick={() => {
                  playClickSound();
                  console.log('Adicionar nova unidade de medida');
                }}
              />
            </div>
          </div>

          {/* Código de Barras */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Código de Barras:</label>
            <input
              type="text"
               style={{
                 ...systemStyles.input.field
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
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Referência:</label>
            <input
              type="text"
               style={{
                 ...systemStyles.input.field
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
      {/* Modal de Nova Categoria */}
      <NewCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        existingCategories={categories}
        onAdd={(newCategory) => {
          // newCategory: { description: string; inMenu: boolean }
          setCategories((prev) => {
            if (prev.includes(newCategory.description)) return prev;
            return [...prev, newCategory.description];
          });
          handleInputChange('categoria', newCategory.description);
        }}
        onEdit={(oldDescription, updated) => {
          setCategories((prev) => prev.map((c) => (c === oldDescription ? updated.description : c)));
          // se a selecionada era a antiga, atualizar seleção
          if (formData.categoria === oldDescription) {
            handleInputChange('categoria', updated.description);
          }
        }}
      />

      {/* Seção de Preços */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>Preços</h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          {/* Preço de Custo */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Preço de Custo:</label>
            <input
              type="text"
               style={{
                 ...systemStyles.input.field
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
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Margem (%):</label>
            <input
              type="text"
               style={{
                 ...systemStyles.input.field
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
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Preço de Venda:</label>
            <input
              type="text"
               style={{
                 ...systemStyles.input.field
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
      <div style={{
        marginBottom: '24px'
      }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>Fornecedor</h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {/* Marca */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Marca:</label>
            <div style={systemStyles.select.container}>
              <select
                 style={{
                   ...systemStyles.select.field
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
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon} />
              </div>
            </div>
          </div>

          {/* Fornecedor */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Fornecedor:</label>
            <div style={systemStyles.select.container}>
              <select
                 style={{
                   ...systemStyles.select.field
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
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Outras Unidades de Medida */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>Outras Unidades de Medida</h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          {/* UN Medida */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>UN Medida:</label>
            <div style={systemStyles.select.container}>
              <select
                 style={{
                   ...systemStyles.select.field
                 }}
                value={otherUnitMeasure}
                onChange={(e) => setOtherUnitMeasure(e.target.value)}
                onClick={playClickSound}
              >
                <option value="">Selecione</option>
                {unidadesMedida.map(unidade => (
                  <option key={unidade} value={unidade}>{unidade}</option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon} />
              </div>
            </div>
          </div>

          {/* QTD */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>QTD:</label>
            <input
              type="text"
               style={{
                 ...systemStyles.input.field
               }}
              value={otherUnitQuantity}
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^\d,.]/g, '').replace(',', '.');
                setOtherUnitQuantity(numeric);
              }}
              onClick={playClickSound}
              placeholder="Ex: 12"
            />
          </div>

          {/* Preço Unitário + Botão */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Preço Unitário:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
              <input
                type="text"
                 style={{
                   ...systemStyles.input.field,
                   flex: 1
                 }}
                value={otherUnitUnitPrice}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  setOtherUnitUnitPrice(formatted);
                }}
                onClick={playClickSound}
                placeholder="R$ 0,00"
              />
              <AddButton
                label="Adicionar unidade"
                disabled={!otherUnitMeasure || !otherUnitQuantity || !otherUnitUnitPrice}
                onClick={() => {
                  playClickSound();
                  const newUnit = {
                    unit: otherUnitMeasure,
                    quantity: parseFloat(otherUnitQuantity) || 0,
                    unitPrice: parseFloat(otherUnitUnitPrice.replace(/[^\d,]/g, '').replace(',', '.')) / 100
                  };
                  setAdditionalUnits(prev => [...prev, newUnit]);
                  setOtherUnitMeasure('');
                  setOtherUnitQuantity('');
                  setOtherUnitUnitPrice('');
                }}
              />
            </div>
          </div>
        </div>

        {/* Lista de unidades adicionais cadastradas */}
        {additionalUnits.length > 0 && (
          <div style={{ marginTop: 16 }}>
          <div style={{
            border: `1px solid ${systemColors.border.light}`,
            borderRadius: 10,
            background: systemColors.background.primary,
            padding: 8
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1.5fr auto',
              gap: 8,
              padding: '10px 8px',
              color: systemColors.text.secondary,
              fontSize: 12,
              borderBottom: `1px solid ${systemColors.border.light}`,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px'
            }}>
              <div>Unidade</div>
              <div>Quantidade</div>
              <div>Preço Unitário</div>
              <div style={{ textAlign: 'right' as const }}>Ações</div>
            </div>

            {additionalUnits.map((item, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1.5fr auto',
                gap: 8,
                padding: '10px 8px',
                alignItems: 'center',
                color: systemColors.text.primary,
                borderBottom: idx < additionalUnits.length - 1 ? `1px solid ${systemColors.border.light}` : 'none'
              }}>
                <div style={{ fontSize: 13 }}>{item.unit}</div>
                <div style={{ fontSize: 13 }}>{item.quantity}</div>
                <div style={{ fontSize: 13 }}>{formatCurrency((item.unitPrice * 100).toString())}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      playClickSound();
                      setAdditionalUnits(prev => prev.filter((_, i) => i !== idx));
                    }}
                    title="Remover"
                    aria-label="Remover"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: 4,
                      borderRadius: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <AppIcons.Delete size={14} color={systemColors.text.secondary} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
