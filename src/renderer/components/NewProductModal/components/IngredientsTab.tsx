import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';

// Componente da aba Insumos - Lista de ingredientes/insumos necessários para produzir o produto
// Seguindo o estilo macOS e modularização do projeto
interface IngredientsTabProps {
  onFormDataChange?: (data: any) => void;
}

interface Ingredient {
  id: string;
  product: string;
  quantity: string;
  unit: string;
}

export function IngredientsTab({ onFormDataChange }: IngredientsTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  
  // Estados dos ingredientes/insumos
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Estados para os campos de entrada
  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnit, setNewUnit] = useState('');

  // Lista de produtos disponíveis no sistema (simulada)
  const availableProducts = [
    'Farinha de Trigo',
    'Açúcar',
    'Sal',
    'Óleo',
    'Fermento',
    'Leite',
    'Ovos',
    'Manteiga',
    'Queijo',
    'Tomate',
    'Cebola',
    'Alho',
    'Orégano',
    'Manjericão',
    'Pimenta',
    'Azeite',
    'Vinagre',
    'Limão',
    'Cenoura',
    'Batata',
    'Outros'
  ];

  // Unidades de medida comuns para ingredientes
  const measurementUnits = [
    'Gramas',
    'Kg',
    'Litros',
    'Ml',
    'Colheres de sopa',
    'Colheres de chá',
    'Xícaras',
    'Unidades',
    'Dentes',
    'Folhas',
    'Pitadas',
    'Outros'
  ];

  // Função para adicionar novo ingrediente
  const addIngredient = () => {
    if (!newProduct || !newQuantity || !newUnit) return;
    
    playClickSound();
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      product: newProduct,
      quantity: newQuantity,
      unit: newUnit
    };
    
    const newIngredients = [...ingredients, newIngredient];
    setIngredients(newIngredients);
    
    // Limpar campos
    setNewProduct('');
    setNewQuantity('');
    setNewUnit('');
    
    if (onFormDataChange) {
      // Envia ingredientes atualizados para o formulário pai
      onFormDataChange({ ingredients: newIngredients });
    }
  };

  // Função para remover ingrediente
  const removeIngredient = (id: string) => {
    playClickSound();
    const newIngredients = ingredients.filter(ingredient => ingredient.id !== id);
    setIngredients(newIngredients);
    
    if (onFormDataChange) {
      // Envia ingredientes atualizados para o formulário pai
      onFormDataChange({ ingredients: newIngredients });
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
        Insumos e Ingredientes
      </h3>
      
      {/* Seção de configuração */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>Lista de Insumos para Produção</h4>
        
        <div style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Como funciona:</strong> Defina os ingredientes e insumos necessários para produzir uma unidade deste produto. Isso ajudará no controle de estoque e custos de produção.
          </p>
          <p style={{ margin: '0' }}>
            <strong>Exemplo:</strong> Para produzir 1 pizza, você pode precisar de 200g de farinha, 2 ovos, 100g de queijo, etc.
          </p>
        </div>

        {/* Campos para adicionar novo ingrediente */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          marginBottom: '16px',
          padding: '16px'
        }}>
          {/* Campo Produto */}
          <div style={{ flex: 2, position: 'relative' as const }}>
            <label style={systemStyles.input.label}>Produto:</label>
            <div style={{ position: 'relative' as const }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  width: '100%'
                }}
                value={newProduct}
                onChange={(e) => {
                  playClickSound();
                  setNewProduct(e.target.value);
                }}
                onFocus={() => setFocusedField('newProduct')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">Selecione um produto</option>
                {availableProducts.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon} />
              </div>
            </div>
          </div>

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
                setNewQuantity(e.target.value);
              }}
              onFocus={() => setFocusedField('newQuantity')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: 200"
            />
          </div>

          {/* Campo Unidade */}
          <div style={{ flex: 1, position: 'relative' as const }}>
            <label style={systemStyles.input.label}>Unidade:</label>
            <div style={{ position: 'relative' as const }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  width: '100%'
                }}
                value={newUnit}
                onChange={(e) => {
                  playClickSound();
                  setNewUnit(e.target.value);
                }}
                onFocus={() => setFocusedField('newUnit')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">Selecione</option>
                {measurementUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon} />
              </div>
            </div>
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
            onClick={addIngredient}
            disabled={!newProduct || !newQuantity || !newUnit}
          >
            Adicionar
          </button>
        </div>

        {/* Lista de ingredientes */}
        {ingredients.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '8px'
          }}>
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
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
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: '500'
                  }}>
                    <strong>{ingredient.product}</strong>
                  </div>
                  
                  <div style={{
                    fontSize: '13px',
                    color: '#666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    {ingredient.quantity} {ingredient.unit}
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
                  onClick={() => removeIngredient(ingredient.id)}
                  title="Remover ingrediente"
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
            Nenhum ingrediente cadastrado
            <br />
            Selecione um produto, informe a quantidade e clique em "Adicionar" para começar
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
            <strong>Produto:</strong> Pizza Margherita
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Ingredientes necessários:</strong>
          </p>
          <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }}>
            <li>Farinha de Trigo - 200 Gramas</li>
            <li>Fermento - 10 Gramas</li>
            <li>Sal - 5 Gramas</li>
            <li>Óleo - 2 Colheres de sopa</li>
            <li>Tomate - 100 Gramas</li>
            <li>Queijo - 150 Gramas</li>
            <li>Orégano - 1 Pitadas</li>
          </ul>
          <p style={{ margin: '0' }}>
            <strong>Resultado:</strong> Para produzir 1 pizza Margherita, você precisará desses ingredientes nas quantidades especificadas.
          </p>
        </div>
      </div>
    </div>
  );
}
