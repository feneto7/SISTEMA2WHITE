import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';

// Componente da aba Variações - Sistema flexível para diferentes tipos de variações
// Seguindo o estilo macOS e modularização do projeto
interface VariationsTabProps {
  onFormDataChange?: (data: any) => void;
}

interface VariationAttribute {
  id: string;
  name: string;
  type: 'texto' | 'numero' | 'moeda' | 'dropdown';
  options?: string[];
  required: boolean;
}

interface ProductVariation {
  id: string;
  attributes: { [key: string]: string };
  price: string;
  stock: string;
  barcode: string;
}

export function VariationsTab({ onFormDataChange }: VariationsTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  
  // Estados das variações do produto
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [variationAttributes, setVariationAttributes] = useState<VariationAttribute[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Estados para os campos de entrada
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeType, setNewAttributeType] = useState<'texto' | 'numero' | 'moeda' | 'dropdown'>('texto');
  const [newAttributeOptions, setNewAttributeOptions] = useState('');
  const [newAttributeRequired, setNewAttributeRequired] = useState(false);
  
  // Estados para nova variação
  const [newVariationAttributes, setNewVariationAttributes] = useState<{ [key: string]: string }>({});
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newBarcode, setNewBarcode] = useState('');

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

  // Função para adicionar novo atributo de variação
  const addAttribute = () => {
    if (!newAttributeName) return;
    
    playClickSound();
    const newAttribute: VariationAttribute = {
      id: Date.now().toString(),
      name: newAttributeName,
      type: newAttributeType,
      options: newAttributeType === 'dropdown' ? newAttributeOptions.split(',').map(op => op.trim()).filter(op => op) : undefined,
      required: newAttributeRequired
    };
    
    setVariationAttributes([...variationAttributes, newAttribute]);
    
    // Limpar campos
    setNewAttributeName('');
    setNewAttributeType('texto');
    setNewAttributeOptions('');
    setNewAttributeRequired(false);
  };

  // Função para remover atributo
  const removeAttribute = (id: string) => {
    playClickSound();
    const newAttributes = variationAttributes.filter(attribute => attribute.id !== id);
    setVariationAttributes(newAttributes);
    
    // Limpar variações existentes se removemos um atributo obrigatório
    if (newAttributes.length === 0) {
      setVariations([]);
      if (onFormDataChange) {
        // Envia estrutura de variações limpa para o formulário pai
        onFormDataChange({ variations: [], variationAttributes: newAttributes });
      }
    }
  };

  // Função para adicionar nova variação
  const addVariation = () => {
    const requiredAttributes = variationAttributes.filter(attr => attr.required);
    const allFilled = requiredAttributes.every(attr => newVariationAttributes[attr.name]);
    
    if (!allFilled || !newPrice) return;
    
    playClickSound();
    const newVariation: ProductVariation = {
      id: Date.now().toString(),
      attributes: { ...newVariationAttributes },
      price: newPrice,
      stock: newStock || '0',
      barcode: newBarcode || ''
    };
    
    const newVariations = [...variations, newVariation];
    setVariations(newVariations);
    
    // Limpar campos
    setNewVariationAttributes({});
    setNewPrice('');
    setNewStock('');
    setNewBarcode('');
    
    if (onFormDataChange) {
      // Envia variações atualizadas para o formulário pai
      onFormDataChange({ variations: newVariations, variationAttributes });
    }
  };

  // Função para remover variação
  const removeVariation = (id: string) => {
    playClickSound();
    const newVariations = variations.filter(variation => variation.id !== id);
    setVariations(newVariations);
    
    if (onFormDataChange) {
      // Envia variações atualizadas para o formulário pai
      onFormDataChange({ variations: newVariations, variationAttributes });
    }
  };

  // Renderizar campo de input baseado no tipo do atributo
  const renderAttributeInput = (attribute: VariationAttribute, value: string, onChange: (value: string) => void) => {
    const baseStyle = {
      ...systemStyles.input.field
    };

    switch (attribute.type) {
      case 'dropdown':
        return (
          <div style={{ position: 'relative' as const }}>
            <select
              style={{ ...baseStyle, width: '100%' }}
              value={value}
              onChange={(e) => {
                playClickSound();
                onChange(e.target.value);
              }}
              onFocus={() => setFocusedField(`attribute_${attribute.id}`)}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">Selecione</option>
              {attribute.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div style={systemStyles.select.arrow}>
              <div style={systemStyles.select.arrowIcon} />
            </div>
          </div>
        );
      
      case 'numero':
        return (
          <input
            type="text"
            style={baseStyle}
            value={value}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              onChange(numericValue);
            }}
            onFocus={() => setFocusedField(`attribute_${attribute.id}`)}
            onBlur={() => setFocusedField(null)}
            placeholder="Ex: 40"
          />
        );
      
      case 'moeda':
        return (
          <input
            type="text"
            style={baseStyle}
            value={value}
            onChange={(e) => {
              const formatted = formatCurrency(e.target.value);
              onChange(formatted);
            }}
            onFocus={() => setFocusedField(`attribute_${attribute.id}`)}
            onBlur={() => setFocusedField(null)}
            placeholder="R$ 0,00"
          />
        );
      
      default: // texto
        return (
          <input
            type="text"
            style={baseStyle}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocusedField(`attribute_${attribute.id}`)}
            onBlur={() => setFocusedField(null)}
            placeholder="Digite o valor"
          />
        );
    }
  };

  return (
    <div>
      <h3 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: systemColors.text.primary,
        marginBottom: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        Variações do Produto
      </h3>
      
      {/* Seção de configuração de atributos */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>Configurar Tipos de Variação</h4>
        
        <div style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Como funciona:</strong> Primeiro defina os tipos de variação do seu produto (ex: Tamanho, Cor, Material, etc.). Depois cadastre as variações específicas.
          </p>
          <p style={{ margin: '0' }}>
            <strong>Exemplos:</strong> Tênis (Tamanho + Cor), Camiseta (Tamanho + Cor + Material), Livro (Idioma + Capa), etc.
          </p>
        </div>

        {/* Campos para adicionar novo atributo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 2fr 1fr auto',
          gap: '12px',
          marginBottom: '16px',
          padding: '16px',
          alignItems: 'end'
        }}>
          {/* Nome do Atributo */}
          <div>
            <label style={systemStyles.input.label}>Nome do Atributo:</label>
            <input
              type="text"
              style={{
                ...systemStyles.input.field
              }}
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
              onFocus={() => setFocusedField('novoAtributoNome')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: Tamanho, Cor, Material"
            />
          </div>

          {/* Tipo do Atributo */}
          <div style={{ position: 'relative' as const }}>
            <label style={systemStyles.input.label}>Tipo:</label>
            <div style={{ position: 'relative' as const }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  width: '100%'
                }}
                value={newAttributeType}
                onChange={(e) => {
                  playClickSound();
                  setNewAttributeType(e.target.value as any);
                }}
                onFocus={() => setFocusedField('novoAtributoTipo')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="texto">Texto</option>
                <option value="numero">Número</option>
                <option value="moeda">Moeda</option>
                <option value="dropdown">Lista</option>
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon} />
              </div>
            </div>
          </div>

          {/* Opções (apenas para dropdown) */}
          <div>
            <label style={systemStyles.input.label}>Opções (separadas por vírgula):</label>
            <input
              type="text"
              style={{
                ...systemStyles.input.field,
                ...(newAttributeType !== 'dropdown' ? { opacity: 0.5, cursor: 'not-allowed' } : {})
              }}
              value={newAttributeOptions}
              onChange={(e) => setNewAttributeOptions(e.target.value)}
              onFocus={() => setFocusedField('novoAtributoOpcoes')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: P, M, G, GG"
              disabled={newAttributeType !== 'dropdown'}
            />
          </div>

          {/* Obrigatório */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
            <input
              type="checkbox"
              checked={newAttributeRequired}
              onChange={(e) => setNewAttributeRequired(e.target.checked)}
              style={{ margin: 0, width: '14px', height: '14px' }}
            />
            <label style={{ fontSize: '11px', fontWeight: '400', color: systemColors.text.primary, margin: 0 }}>Obrigatório</label>
          </div>

          {/* Botão Adicionar */}
          <button
            type="button"
            style={{
              ...systemStyles.button.primary,
              minWidth: '80px',
              height: '28px',
              alignSelf: 'flex-end',
              backgroundColor: '#34C759',
              background: 'linear-gradient(to bottom, #34C759, #2FAD4F)',
              border: '0.5px solid #2FAD4F'
            }}
            onClick={addAttribute}
            disabled={!newAttributeName}
          >
            Adicionar
          </button>
        </div>

        {/* Lista de atributos configurados */}
        {variationAttributes.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h5 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: systemColors.text.secondary,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px',
              marginBottom: '8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              Atributos Configurados:
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {variationAttributes.map((attribute) => (
                <div
                  key={attribute.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d0d0',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}
                >
                  <span style={{ fontWeight: '600' }}>{attribute.name}</span>
                  <span style={{ color: '#666' }}>({attribute.type})</span>
                  {attribute.required && (
                    <span style={{ color: '#ff3b30', fontSize: '10px' }}>OBRIGATÓRIO</span>
                  )}
                  <button
                    type="button"
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '1px solid #ff3b30',
                      background: '#ff3b30',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                    onClick={() => removeAttribute(attribute.id)}
                    title="Remover atributo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Seção de cadastro de variações */}
      {variationAttributes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{
            fontSize: '13px',
            fontWeight: '600',
            color: systemColors.text.secondary,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            marginBottom: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>Cadastrar Variações</h4>
          
          {/* Campos para nova variação */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${variationAttributes.length}, 1fr) 1fr 1fr 1fr`,
            gap: '12px',
            marginBottom: '16px',
            padding: '16px'
          }}>
            {/* Campos dinâmicos para atributos */}
            {variationAttributes.map((attribute) => (
              <div key={attribute.id}>
                <label style={systemStyles.input.label}>{attribute.name}:</label>
                {renderAttributeInput(
                  attribute,
                  newVariationAttributes[attribute.name] || '',
                  (value) => setNewVariationAttributes(prev => ({ ...prev, [attribute.name]: value }))
                )}
              </div>
            ))}

            {/* Preço */}
            <div>
              <label style={systemStyles.input.label}>Preço:</label>
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
                onFocus={() => setFocusedField('novoPreco')}
                onBlur={() => setFocusedField(null)}
                placeholder="R$ 0,00"
              />
            </div>

            {/* Estoque */}
            <div>
              <label style={systemStyles.input.label}>Estoque:</label>
              <input
                type="text"
                style={{
                  ...systemStyles.input.field
                }}
                value={newStock}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setNewStock(numericValue);
                }}
                onFocus={() => setFocusedField('novoEstoque')}
                onBlur={() => setFocusedField(null)}
                placeholder="0"
              />
            </div>

            {/* Código de Barras */}
            <div>
              <label style={systemStyles.input.label}>Código:</label>
              <input
                type="text"
                style={{
                  ...systemStyles.input.field
                }}
                value={newBarcode}
                onChange={(e) => setNewBarcode(e.target.value)}
                onFocus={() => setFocusedField('novoCodigoBarras')}
                onBlur={() => setFocusedField(null)}
                placeholder="Opcional"
              />
            </div>
          </div>

          {/* Botão Adicionar Variação */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <button
              type="button"
              style={{
                ...systemStyles.button.primary,
                padding: '8px 24px',
                height: '32px',
                minWidth: '120px'
              }}
              onClick={addVariation}
              disabled={!newPrice || !variationAttributes.every(attr => !attr.required || newVariationAttributes[attr.name])}
            >
              Adicionar Variação
            </button>
          </div>

          {/* Lista de variações */}
          {variations.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '8px'
            }}>
              {/* Cabeçalho da tabela */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `60px repeat(${variationAttributes.length}, 1fr) 1fr 1fr 1fr 60px`,
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: '#f0f0f0',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '12px',
                color: '#666',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}>
                <div>#</div>
                {variationAttributes.map(attribute => (
                  <div key={attribute.id}>{attribute.name}</div>
                ))}
                <div>Preço</div>
                <div>Estoque</div>
                <div>Código</div>
                <div>Ação</div>
              </div>

              {/* Linhas das variações */}
              {variations.map((variation, index) => (
                <div
                  key={variation.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `60px repeat(${variationAttributes.length}, 1fr) 1fr 1fr 1fr 60px`,
                    gap: '12px',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d0d0d0',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    #{index + 1}
                  </span>
                  
                  {variationAttributes.map(attribute => (
                    <div key={attribute.id} style={{
                      fontSize: '13px',
                      color: '#333',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: '500'
                    }}>
                      {variation.attributes[attribute.name] || '-'}
                    </div>
                  ))}
                  
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#007aff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    {variation.price}
                  </div>
                  
                  <div style={{
                    fontSize: '13px',
                    color: '#333',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    {variation.stock}
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    {variation.barcode || '-'}
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
                    onClick={() => removeVariation(variation.id)}
                    title="Remover variação"
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
              Nenhuma variação cadastrada
              <br />
              Preencha os campos acima e clique em "Adicionar Variação" para começar
            </div>
          )}
        </div>
      )}

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
          Exemplos Práticos
        </h4>
        
        <div style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.5',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Tênis:</strong> Atributos: Tamanho (dropdown: 40,41,42,43) + Cor (dropdown: Preto,Branco,Azul)
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Camiseta:</strong> Atributos: Tamanho (dropdown: P,M,G,GG) + Cor (dropdown: Preto,Branco) + Material (dropdown: Algodão,Poliester)
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Livro:</strong> Atributos: Idioma (dropdown: Português,Inglês) + Capa (dropdown: Brochura,Capa Dura)
          </p>
          <p style={{ margin: '0' }}>
            <strong>Resultado:</strong> Sistema flexível que se adapta a qualquer tipo de produto com suas variações específicas.
          </p>
        </div>
      </div>
    </div>
  );
}
