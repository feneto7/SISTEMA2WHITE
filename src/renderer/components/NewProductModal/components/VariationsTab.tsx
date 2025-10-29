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
  nome: string;
  tipo: 'texto' | 'numero' | 'moeda' | 'dropdown';
  opcoes?: string[];
  obrigatorio: boolean;
}

interface ProductVariation {
  id: string;
  atributos: { [key: string]: string };
  preco: string;
  estoque: string;
  codigoBarras: string;
}

export function VariationsTab({ onFormDataChange }: VariationsTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  
  // Estados das variações do produto
  const [variacoes, setVariacoes] = useState<ProductVariation[]>([]);
  const [atributosVariacao, setAtributosVariacao] = useState<VariationAttribute[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Estados para os campos de entrada
  const [novoAtributoNome, setNovoAtributoNome] = useState('');
  const [novoAtributoTipo, setNovoAtributoTipo] = useState<'texto' | 'numero' | 'moeda' | 'dropdown'>('texto');
  const [novoAtributoOpcoes, setNovoAtributoOpcoes] = useState('');
  const [novoAtributoObrigatorio, setNovoAtributoObrigatorio] = useState(false);
  
  // Estados para nova variação
  const [novaVariacaoAtributos, setNovaVariacaoAtributos] = useState<{ [key: string]: string }>({});
  const [novoPreco, setNovoPreco] = useState('');
  const [novoEstoque, setNovoEstoque] = useState('');
  const [novoCodigoBarras, setNovoCodigoBarras] = useState('');

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
  const adicionarAtributo = () => {
    if (!novoAtributoNome) return;
    
    playClickSound();
    const novoAtributo: VariationAttribute = {
      id: Date.now().toString(),
      nome: novoAtributoNome,
      tipo: novoAtributoTipo,
      opcoes: novoAtributoTipo === 'dropdown' ? novoAtributoOpcoes.split(',').map(op => op.trim()).filter(op => op) : undefined,
      obrigatorio: novoAtributoObrigatorio
    };
    
    setAtributosVariacao([...atributosVariacao, novoAtributo]);
    
    // Limpar campos
    setNovoAtributoNome('');
    setNovoAtributoTipo('texto');
    setNovoAtributoOpcoes('');
    setNovoAtributoObrigatorio(false);
  };

  // Função para remover atributo
  const removerAtributo = (id: string) => {
    playClickSound();
    const novosAtributos = atributosVariacao.filter(atributo => atributo.id !== id);
    setAtributosVariacao(novosAtributos);
    
    // Limpar variações existentes se removemos um atributo obrigatório
    if (novosAtributos.length === 0) {
      setVariacoes([]);
      if (onFormDataChange) {
        onFormDataChange({ variacoes: [], atributosVariacao: novosAtributos });
      }
    }
  };

  // Função para adicionar nova variação
  const adicionarVariacao = () => {
    const atributosObrigatorios = atributosVariacao.filter(attr => attr.obrigatorio);
    const todosPreenchidos = atributosObrigatorios.every(attr => novaVariacaoAtributos[attr.nome]);
    
    if (!todosPreenchidos || !novoPreco) return;
    
    playClickSound();
    const novaVariacao: ProductVariation = {
      id: Date.now().toString(),
      atributos: { ...novaVariacaoAtributos },
      preco: novoPreco,
      estoque: novoEstoque || '0',
      codigoBarras: novoCodigoBarras || ''
    };
    
    const novasVariacoes = [...variacoes, novaVariacao];
    setVariacoes(novasVariacoes);
    
    // Limpar campos
    setNovaVariacaoAtributos({});
    setNovoPreco('');
    setNovoEstoque('');
    setNovoCodigoBarras('');
    
    if (onFormDataChange) {
      onFormDataChange({ variacoes: novasVariacoes, atributosVariacao });
    }
  };

  // Função para remover variação
  const removerVariacao = (id: string) => {
    playClickSound();
    const novasVariacoes = variacoes.filter(variacao => variacao.id !== id);
    setVariacoes(novasVariacoes);
    
    if (onFormDataChange) {
      onFormDataChange({ variacoes: novasVariacoes, atributosVariacao });
    }
  };

  // Renderizar campo de input baseado no tipo do atributo
  const renderAtributoInput = (atributo: VariationAttribute, value: string, onChange: (value: string) => void) => {
    const baseStyle = {
      ...systemStyles.input.field
    };

    switch (atributo.tipo) {
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
              onFocus={() => setFocusedField(`atributo_${atributo.id}`)}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">Selecione</option>
              {atributo.opcoes?.map(opcao => (
                <option key={opcao} value={opcao}>{opcao}</option>
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
            onFocus={() => setFocusedField(`atributo_${atributo.id}`)}
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
            onFocus={() => setFocusedField(`atributo_${atributo.id}`)}
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
            onFocus={() => setFocusedField(`atributo_${atributo.id}`)}
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
              value={novoAtributoNome}
              onChange={(e) => setNovoAtributoNome(e.target.value)}
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
                value={novoAtributoTipo}
                onChange={(e) => {
                  playClickSound();
                  setNovoAtributoTipo(e.target.value as any);
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
                ...(novoAtributoTipo !== 'dropdown' ? { opacity: 0.5, cursor: 'not-allowed' } : {})
              }}
              value={novoAtributoOpcoes}
              onChange={(e) => setNovoAtributoOpcoes(e.target.value)}
              onFocus={() => setFocusedField('novoAtributoOpcoes')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: P, M, G, GG"
              disabled={novoAtributoTipo !== 'dropdown'}
            />
          </div>

          {/* Obrigatório */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
            <input
              type="checkbox"
              checked={novoAtributoObrigatorio}
              onChange={(e) => setNovoAtributoObrigatorio(e.target.checked)}
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
            onClick={adicionarAtributo}
            disabled={!novoAtributoNome}
          >
            Adicionar
          </button>
        </div>

        {/* Lista de atributos configurados */}
        {atributosVariacao.length > 0 && (
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
              {atributosVariacao.map((atributo) => (
                <div
                  key={atributo.id}
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
                  <span style={{ fontWeight: '600' }}>{atributo.nome}</span>
                  <span style={{ color: '#666' }}>({atributo.tipo})</span>
                  {atributo.obrigatorio && (
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
                    onClick={() => removerAtributo(atributo.id)}
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
      {atributosVariacao.length > 0 && (
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
            gridTemplateColumns: `repeat(${atributosVariacao.length}, 1fr) 1fr 1fr 1fr`,
            gap: '12px',
            marginBottom: '16px',
            padding: '16px'
          }}>
            {/* Campos dinâmicos para atributos */}
            {atributosVariacao.map((atributo) => (
              <div key={atributo.id}>
                <label style={systemStyles.input.label}>{atributo.nome}:</label>
                {renderAtributoInput(
                  atributo,
                  novaVariacaoAtributos[atributo.nome] || '',
                  (value) => setNovaVariacaoAtributos(prev => ({ ...prev, [atributo.nome]: value }))
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
                value={novoPreco}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  setNovoPreco(formatted);
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
                value={novoEstoque}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setNovoEstoque(numericValue);
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
                value={novoCodigoBarras}
                onChange={(e) => setNovoCodigoBarras(e.target.value)}
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
              onClick={adicionarVariacao}
              disabled={!novoPreco || !atributosVariacao.every(attr => !attr.obrigatorio || novaVariacaoAtributos[attr.nome])}
            >
              Adicionar Variação
            </button>
          </div>

          {/* Lista de variações */}
          {variacoes.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '8px'
            }}>
              {/* Cabeçalho da tabela */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `60px repeat(${atributosVariacao.length}, 1fr) 1fr 1fr 1fr 60px`,
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
                {atributosVariacao.map(atributo => (
                  <div key={atributo.id}>{atributo.nome}</div>
                ))}
                <div>Preço</div>
                <div>Estoque</div>
                <div>Código</div>
                <div>Ação</div>
              </div>

              {/* Linhas das variações */}
              {variacoes.map((variacao, index) => (
                <div
                  key={variacao.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `60px repeat(${atributosVariacao.length}, 1fr) 1fr 1fr 1fr 60px`,
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
                  
                  {atributosVariacao.map(atributo => (
                    <div key={atributo.id} style={{
                      fontSize: '13px',
                      color: '#333',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: '500'
                    }}>
                      {variacao.atributos[atributo.nome] || '-'}
                    </div>
                  ))}
                  
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#007aff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    {variacao.preco}
                  </div>
                  
                  <div style={{
                    fontSize: '13px',
                    color: '#333',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    {variacao.estoque}
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}>
                    {variacao.codigoBarras || '-'}
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
                    onClick={() => removerVariacao(variacao.id)}
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
