//--------------------------------------------------------------------
// COMPONENTE DE FORMULÁRIO DA EMPRESA
// Formulário para cadastro e edição de dados da empresa
// Seguindo o padrão de estilo macOS
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { AppIcons } from '../../../components/Icons/AppIcons';

export function CompanyForm(): JSX.Element {
  const [empresaData, setEmpresaData] = useState({
    nomeEmpresarial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    cnae: '',
    regimeTributario: '',
    rua: '',
    numero: '',
    cep: '',
    complemento: '',
    cidade: '',
    uf: '',
    bairro: '',
    telefone: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setEmpresaData(prev => ({ ...prev, [field]: value }));
  };

  const styles = {
    container: {
      padding: '0',
      background: 'transparent',
      overflowY: 'auto' as const,
      height: '100%'
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '16px'
    },
    formGrid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    formGrid3: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    label: {
      ...systemStyles.input.label
    },
    input: {
      ...systemStyles.input.field
    },
    inputFocus: {
      ...systemStyles.input.fieldFocus
    },
    selectWrapper: {
      ...systemStyles.select.container
    },
    select: {
      ...systemStyles.select.field
    },
    selectFocus: {
      ...systemStyles.select.fieldFocus
    },
    selectArrow: {
      ...systemStyles.select.arrow
    },
    selectArrowIcon: {
      ...systemStyles.select.arrowIcon
    }
  };

  return (
    <div style={styles.container}>
      {/* Seção: Dados da Empresa */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Dados da Empresa</h2>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Empresarial</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.nomeEmpresarial}
              onChange={(e) => handleInputChange('nomeEmpresarial', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Fantasia</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.nomeFantasia}
              onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>CNPJ</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.cnpj}
              onChange={(e) => handleInputChange('cnpj', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Inscrição Estadual</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.inscricaoEstadual}
              onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Inscrição Municipal</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.inscricaoMunicipal}
              onChange={(e) => handleInputChange('inscricaoMunicipal', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>CNAE</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.cnae}
              onChange={(e) => handleInputChange('cnae', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Regime Tributário</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={empresaData.regimeTributario}
                onChange={(e) => handleInputChange('regimeTributario', e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="simples-nacional">Simples Nacional</option>
                <option value="presumido">Presumido</option>
                <option value="real">Real</option>
                <option value="mei">MEI</option>
              </select>
              <div style={styles.selectArrow}>
                <div style={styles.selectArrowIcon}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Endereço */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Endereço</h2>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Rua/Av</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.rua}
              onChange={(e) => handleInputChange('rua', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.numero}
              onChange={(e) => handleInputChange('numero', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Complemento</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cidade</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={empresaData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
              >
                <option value="">Selecione primeiro a UF</option>
                <option value="saopaulo">São Paulo</option>
                <option value="riodejaneiro">Rio de Janeiro</option>
                <option value="belohorizonte">Belo Horizonte</option>
              </select>
              <div style={styles.selectArrow}>
                <div style={styles.selectArrowIcon}></div>
              </div>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>UF</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={empresaData.uf}
                onChange={(e) => handleInputChange('uf', e.target.value)}
              >
                <option value="">Selecione a UF</option>
                <option value="ac">AC</option>
                <option value="al">AL</option>
                <option value="ap">AP</option>
                <option value="am">AM</option>
                <option value="ba">BA</option>
                <option value="ce">CE</option>
                <option value="df">DF</option>
                <option value="es">ES</option>
                <option value="go">GO</option>
                <option value="ma">MA</option>
                <option value="mt">MT</option>
                <option value="ms">MS</option>
                <option value="mg">MG</option>
                <option value="pa">PA</option>
                <option value="pb">PB</option>
                <option value="pr">PR</option>
                <option value="pe">PE</option>
                <option value="pi">PI</option>
                <option value="rj">RJ</option>
                <option value="rn">RN</option>
                <option value="rs">RS</option>
                <option value="ro">RO</option>
                <option value="rr">RR</option>
                <option value="sc">SC</option>
                <option value="sp">SP</option>
                <option value="se">SE</option>
                <option value="to">TO</option>
              </select>
              <div style={styles.selectArrow}>
                <div style={styles.selectArrowIcon}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Bairro/Distrito</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Seção: Contatos */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Contatos</h2>
        
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Telefone</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={empresaData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
