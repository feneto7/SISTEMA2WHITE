import React, { useState } from 'react';
import { useClickSound } from '../../../hooks/useClickSound';
import { useTheme } from '../../../styles/ThemeProvider';

// Interface para dados do formulário
interface FormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
  // Campos específicos para pessoa jurídica
  fantasyName: string;
  stateRegistration: string;
  municipalRegistration: string;
}

// Interface para resposta da API BrasilAPI
interface CNPJResponse {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior: string;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  ddd_fax: string;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: string;
  descricao_porte: string;
  opcao_pelo_simples: boolean;
  data_opcao_pelo_simples: string;
  data_exclusao_do_simples: string;
  opcao_pelo_mei: boolean;
  situacao_especial: string;
  data_situacao_especial: string;
  qsa: Array<{
    identificador_de_socio: number;
    nome_socio: string;
    cnpj_cpf_do_socio: string;
    codigo_qualificacao_socio: number;
    percentual_capital_social: number;
    data_entrada_sociedade: string;
    cpf_representante_legal: string;
    nome_representante_legal: string;
    codigo_qualificacao_representante_legal: number;
  }>;
}

// Props do componente MainTab
interface MainTabProps {
  clientType: 'individual' | 'company';
  formData: FormData;
  onUpdateFormData: (field: string, value: string) => void;
}

// Aba principal do modal de cliente
// Contém os campos básicos de identificação do cliente
export function MainTab({ clientType, formData, onUpdateFormData }: MainTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Função para consultar CNPJ na API BrasilAPI
  const consultarCNPJ = async (cnpj: string) => {
    setIsLoadingCNPJ(true);
    try {
      // Remove formatação do CNPJ para consulta
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      // Verifica se o CNPJ tem 14 dígitos
      if (cnpjLimpo.length !== 14) {
        return;
      }

      console.log('Consultando CNPJ:', cnpjLimpo);
      
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      
      if (!response.ok) {
        throw new Error(`Erro na consulta: ${response.status}`);
      }
      
      const data: CNPJResponse = await response.json();
      
      console.log('Dados recebidos da API:', data);
      
      // Preenche os campos automaticamente
      onUpdateFormData('name', data.razao_social || '');
      onUpdateFormData('fantasyName', data.nome_fantasia || '');
      
      // Nota: A API BrasilAPI não retorna email, deve ser preenchido manualmente
      console.log('⚠️ Email não disponível na API - deve ser preenchido manualmente');
      
      // Preenche dados de endereço
      const enderecoCompleto = [
        data.descricao_tipo_logradouro,
        data.logradouro,
        data.numero,
        data.complemento
      ].filter(Boolean).join(', ');
      
      onUpdateFormData('address', enderecoCompleto);
      onUpdateFormData('city', data.municipio || '');
      onUpdateFormData('state', data.uf || '');
      onUpdateFormData('zipCode', data.cep || '');
      
      // Preenche bairro se disponível (campo pode estar vazio na API)
      if (data.bairro && data.bairro.trim() !== '') {
        onUpdateFormData('neighborhood', data.bairro);
      }
      
      // Preenche número do endereço se disponível (campo pode estar vazio na API)
      if (data.numero && data.numero.trim() !== '') {
        onUpdateFormData('addressNumber', data.numero);
      }
      
      // Preenche telefone se disponível
      if (data.ddd_telefone_1) {
        const telefone = data.ddd_telefone_1.replace(/\D/g, '');
        if (telefone.length >= 10) {
          const telefoneFormatado = telefone.length === 10 
            ? `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}-${telefone.slice(6)}`
            : `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
          onUpdateFormData('phone', telefoneFormatado);
        }
      }
      
      console.log('Campos preenchidos automaticamente:', {
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia,
        endereco: enderecoCompleto,
        cidade: data.municipio,
        estado: data.uf,
        cep: data.cep,
        bairro: data.bairro,
        numero: data.numero,
        telefone: data.ddd_telefone_1
      });
      
    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      // Não mostra erro para o usuário, apenas loga no console
    } finally {
      setIsLoadingCNPJ(false);
    }
  };
  // Função para formatar CPF
  const formatCPF = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara do CPF: 000.000.000-00
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
    } else if (limitedNumbers.length <= 9) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9, 11)}`;
    }
  };

  // Função para formatar CNPJ - versão mais simples
  const formatCNPJ = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 14 dígitos
    const limitedNumbers = numbers.slice(0, 14);
    
    // Aplica a máscara do CNPJ: 00.000.000/0000-00
    switch (limitedNumbers.length) {
      case 0:
        return '';
      case 1:
      case 2:
        return limitedNumbers;
      case 3:
      case 4:
      case 5:
        return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
      case 6:
      case 7:
      case 8:
        return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5)}`;
      case 9:
      case 10:
      case 11:
      case 12:
        return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
      default:
        return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8, 12)}-${limitedNumbers.slice(12, 14)}`;
    }
  };

  // Função para formatar documento baseado no tipo
  const formatDocument = (value: string): string => {
    if (clientType === 'individual') {
      return formatCPF(value);
    } else {
      return formatCNPJ(value);
    }
  };

  // Função para formatar telefone/celular
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara do telefone: (00) 00000-0000 ou (00) 0000-0000
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      // Telefone fixo: (00) 0000-0000
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      // Celular: (00) 00000-0000
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Função para lidar com mudança no campo de telefone
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    onUpdateFormData('phone', formatted);
  };

  // Função para lidar com mudança no campo de documento
  const handleDocumentChange = async (value: string) => {
    // Se o campo estiver vazio, apenas limpa
    if (!value || value.trim() === '') {
      onUpdateFormData('document', '');
      return;
    }
    
    // Aplica a formatação baseada no tipo de cliente
    const formatted = formatDocument(value);
    onUpdateFormData('document', formatted);
    
    // Se for CNPJ e estiver completo (14 dígitos), consulta a API
    if (clientType === 'company') {
      const cnpjLimpo = value.replace(/\D/g, '');
      if (cnpjLimpo.length === 14) {
        console.log('CNPJ completo detectado, consultando API...');
        await consultarCNPJ(formatted);
      }
    }
  };
  return (
    <div>
      {/* Seção de Informações Principais */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>Informações Principais</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            {clientType === 'individual' ? 'Nome Completo' : 'Razão Social'}
          </label>
          <input
            type="text"
            style={{
              ...systemStyles.input.field
            }}
            value={formData.name}
            onChange={(e) => onUpdateFormData('name', e.target.value)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder={clientType === 'individual' ? 'Digite o nome completo' : 'Digite a razão social'}
          />
        </div>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            {clientType === 'individual' ? 'CPF' : 'Nome Fantasia'}
          </label>
          <input
            type="text"
            style={{
              ...systemStyles.input.field
            }}
            value={clientType === 'individual' ? formData.document : (formData.fantasyName || '')}
            onChange={(e) => clientType === 'individual' ? handleDocumentChange(e.target.value) : onUpdateFormData('fantasyName', e.target.value)}
            onFocus={() => setFocusedField('cpfFantasy')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder={clientType === 'individual' ? '000.000.000-00' : 'Digite o nome fantasia'}
            maxLength={clientType === 'individual' ? 14 : undefined}
          />
        </div>
        {/* Campo CNPJ para pessoa jurídica */}
        {clientType === 'company' && (
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>
              CNPJ
              {isLoadingCNPJ && (
                <span style={{
                  marginLeft: '8px',
                  fontSize: '10px',
                  color: '#007AFF',
                  fontWeight: '400'
                }}>
                  🔄 Consultando...
                </span>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                style={{
                  ...systemStyles.input.field,
                  opacity: isLoadingCNPJ ? 0.7 : 1,
                  cursor: isLoadingCNPJ ? 'not-allowed' : 'text'
                }}
                value={formData.document}
                onChange={(e) => handleDocumentChange(e.target.value)}
                onFocus={() => setFocusedField('cnpj')}
                onBlur={() => setFocusedField(null)}
                onClick={playClickSound}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                disabled={isLoadingCNPJ}
              />
              {isLoadingCNPJ && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: '#007AFF'
                }}>
                  ⏳
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Campos específicos para pessoa jurídica */}
        {clientType === 'company' && (
          <>
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>
                Inscrição Estadual
              </label>
              <input
                type="text"
                style={{
                  ...systemStyles.input.field
                }}
                value={formData.stateRegistration || ''}
                onChange={(e) => onUpdateFormData('stateRegistration', e.target.value)}
                onFocus={() => setFocusedField('stateRegistration')}
                onBlur={() => setFocusedField(null)}
                onClick={playClickSound}
                placeholder="Digite a inscrição estadual"
              />
            </div>
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>
                Inscrição Municipal
              </label>
              <input
                type="text"
                style={{
                  ...systemStyles.input.field
                }}
                value={formData.municipalRegistration || ''}
                onChange={(e) => onUpdateFormData('municipalRegistration', e.target.value)}
                onFocus={() => setFocusedField('municipalRegistration')}
                onBlur={() => setFocusedField(null)}
                onClick={playClickSound}
                placeholder="Digite a inscrição municipal"
              />
            </div>
          </>
        )}
        </div>
      </div>

      {/* Seção de Contatos */}
      <div>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>Contatos</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            Email
          </label>
          <input
            type="email"
            style={{
              ...systemStyles.input.field
            }}
            value={formData.email}
            onChange={(e) => onUpdateFormData('email', e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder="Digite o email"
          />
        </div>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            Telefone
          </label>
          <input
            type="tel"
            style={{
              ...systemStyles.input.field
            }}
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
        </div>
        </div>
      </div>
    </div>
  );
}
