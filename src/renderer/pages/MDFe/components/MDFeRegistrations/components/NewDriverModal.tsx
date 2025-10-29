import React, { useState } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';

interface Driver {
  id: string;
  nomeMotorista: string;
  cpfMotorista: string;
  rgMotorista: string;
  cnhMotorista: string;
  categoriaCnh: string;
  validadeCnh: string;
  telefoneMotorista: string;
  emailMotorista: string;
  enderecoMotorista: string;
  cidadeMotorista: string;
  ufMotorista: string;
  cepMotorista: string;
  dataNascimento: string;
  estadoCivil: string;
  nomePai: string;
  nomeMae: string;
}

interface NewDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Driver) => void;
  editingDriver?: Driver | null;
}

export function NewDriverModal({ isOpen, onClose, onSave, editingDriver }: NewDriverModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Driver>>({
    nomeMotorista: '',
    cpfMotorista: '',
    rgMotorista: '',
    cnhMotorista: '',
    categoriaCnh: '',
    validadeCnh: '',
    telefoneMotorista: '',
    emailMotorista: '',
    enderecoMotorista: '',
    cidadeMotorista: '',
    ufMotorista: '',
    cepMotorista: '',
    dataNascimento: '',
    estadoCivil: '',
    nomePai: '',
    nomeMae: ''
  });

  // Initialize data when modal opens or when editingDriver changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingDriver) {
        setFormData(editingDriver);
      } else {
        setFormData({
          nomeMotorista: '',
          cpfMotorista: '',
          rgMotorista: '',
          cnhMotorista: '',
          categoriaCnh: '',
          validadeCnh: '',
          telefoneMotorista: '',
          emailMotorista: '',
          enderecoMotorista: '',
          cidadeMotorista: '',
          ufMotorista: '',
          cepMotorista: '',
          dataNascimento: '',
          estadoCivil: '',
          nomePai: '',
          nomeMae: ''
        });
      }
    }
  }, [isOpen, editingDriver]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const getInputStyle = (field: string) => {
    const baseStyle = systemStyles.input.field;
    // Estilos de foco são aplicados globalmente via CSS
    const focusStyle = {};
    return { ...baseStyle, ...focusStyle };
  };

  const getInputProps = (field: string, placeholder: string, type: string = 'text') => ({
    type,
    style: getInputStyle(field),
    value: formData[field as keyof Driver] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleInputChange(field, e.target.value),
    onFocus: () => handleInputFocus(field),
    onBlur: handleInputBlur,
    onClick: () => playClickSound(),
    placeholder
  });

  const handleSave = () => {
    if (!formData.nomeMotorista || !formData.cpfMotorista || !formData.cnhMotorista) {
      alert('Nome, CPF e CNH são obrigatórios');
      return;
    }

    const driverData: Driver = {
      id: editingDriver?.id || Date.now().toString(),
      nomeMotorista: formData.nomeMotorista || '',
      cpfMotorista: formData.cpfMotorista || '',
      rgMotorista: formData.rgMotorista || '',
      cnhMotorista: formData.cnhMotorista || '',
      categoriaCnh: formData.categoriaCnh || '',
      validadeCnh: formData.validadeCnh || '',
      telefoneMotorista: formData.telefoneMotorista || '',
      emailMotorista: formData.emailMotorista || '',
      enderecoMotorista: formData.enderecoMotorista || '',
      cidadeMotorista: formData.cidadeMotorista || '',
      ufMotorista: formData.ufMotorista || '',
      cepMotorista: formData.cepMotorista || '',
      dataNascimento: formData.dataNascimento || '',
      estadoCivil: formData.estadoCivil || '',
      nomePai: formData.nomePai || '',
      nomeMae: formData.nomeMae || ''
    };

    onSave(driverData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      nomeMotorista: '',
      cpfMotorista: '',
      rgMotorista: '',
      cnhMotorista: '',
      categoriaCnh: '',
      validadeCnh: '',
      telefoneMotorista: '',
      emailMotorista: '',
      enderecoMotorista: '',
      cidadeMotorista: '',
      ufMotorista: '',
      cepMotorista: '',
      dataNascimento: '',
      estadoCivil: '',
      nomePai: '',
      nomeMae: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    container: {
      backgroundColor: systemColors.background.window,
      borderRadius: '10px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)',
      width: '600px',
      height: '85vh',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      boxSizing: 'border-box' as const
    },
    titleBar: {
      ...systemStyles.titleBar,
      flexShrink: 0
    },
    title: {
      ...systemStyles.titleBarTitle
    },
    content: {
      flex: 1,
      padding: '16px',
      background: systemColors.background.content,
      overflow: 'auto',
      minHeight: 0
    },
    section: {
      marginBottom: '16px'
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '12px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px'
    },
    group: {
      marginBottom: '8px'
    },
    label: {
      ...systemStyles.input.label
    },
    input: {
      ...systemStyles.input.field
    },
    fullWidth: {
      gridColumn: '1 / -1'
    },
    footer: {
      padding: '12px 16px',
      background: systemColors.background.primary,
      borderTop: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Modal header */}
        <div style={styles.titleBar}>
          <div style={systemStyles.trafficLights.container}>
            <button 
              style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.red}} 
              onClick={() => {
                playClickSound();
                handleClose();
              }}
              title="Fechar"
            />
            <button 
              style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.yellow}}
              title="Minimizar"
            />
            <button 
              style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.green}}
              title="Maximizar"
            />
          </div>
          <div style={styles.title}>
            {editingDriver ? 'Editar Motorista' : 'Novo Motorista'}
          </div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Form content */}
        <div style={styles.content}>
          {/* Personal Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Informações Pessoais</h4>
            <div style={styles.grid}>
              <div style={styles.group}>
                <label style={styles.label}>Nome Completo *</label>
                <input {...getInputProps('nomeMotorista', 'João da Silva')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>CPF *</label>
                <input {...getInputProps('cpfMotorista', '123.456.789-00')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>RG</label>
                <input {...getInputProps('rgMotorista', '12.345.678-9')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Data de Nascimento</label>
                <input {...getInputProps('dataNascimento', '', 'date')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Estado Civil</label>
                <div style={{ position: 'relative' as const }}>
                  <select {...getInputProps('estadoCivil', 'Selecione')}>
                    <option value="">Selecione</option>
                    <option value="solteiro">Solteiro</option>
                    <option value="casado">Casado</option>
                    <option value="divorciado">Divorciado</option>
                    <option value="viuvo">Viúvo</option>
                  </select>
                  <div style={systemStyles.select.arrow}>
                    <div style={systemStyles.select.arrowIcon}></div>
                  </div>
                </div>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Nome do Pai</label>
                <input {...getInputProps('nomePai', 'José da Silva')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Nome da Mãe</label>
                <input {...getInputProps('nomeMae', 'Maria da Silva')} />
              </div>
            </div>
          </div>

          {/* CNH Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Dados da CNH</h4>
            <div style={styles.grid}>
              <div style={styles.group}>
                <label style={styles.label}>Número da CNH *</label>
                <input {...getInputProps('cnhMotorista', '12345678901')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Categoria</label>
                <div style={{ position: 'relative' as const }}>
                  <select {...getInputProps('categoriaCnh', 'Selecione')}>
                    <option value="">Selecione</option>
                    <option value="A">A - Motocicleta</option>
                    <option value="B">B - Carro</option>
                    <option value="C">C - Caminhão</option>
                    <option value="D">D - Ônibus</option>
                    <option value="E">E - Carreta</option>
                  </select>
                  <div style={systemStyles.select.arrow}>
                    <div style={systemStyles.select.arrowIcon}></div>
                  </div>
                </div>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Validade da CNH</label>
                <input {...getInputProps('validadeCnh', '', 'date')} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Dados de Contato</h4>
            <div style={styles.grid}>
              <div style={styles.group}>
                <label style={styles.label}>Telefone</label>
                <input {...getInputProps('telefoneMotorista', '(11) 99999-9999')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>E-mail</label>
                <input {...getInputProps('emailMotorista', 'joao@email.com', 'email')} />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Endereço</h4>
            <div style={styles.grid}>
              <div style={{...styles.group, ...styles.fullWidth}}>
                <label style={styles.label}>Endereço Completo</label>
                <input {...getInputProps('enderecoMotorista', 'Rua das Flores, 123, Bairro Centro')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Cidade</label>
                <input {...getInputProps('cidadeMotorista', 'São Paulo')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>UF</label>
                <input {...getInputProps('ufMotorista', 'SP')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>CEP</label>
                <input {...getInputProps('cepMotorista', '01234-567')} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div style={styles.footer}>
          <div style={systemStyles.modal.footerLeft}>
            <button
              style={systemStyles.button.default}
              onClick={() => {
                playClickSound();
                handleClose();
              }}
            >
              Cancelar
            </button>
          </div>
          <div style={systemStyles.modal.footerRight}>
            <button
              style={systemStyles.button.primary}
              onClick={() => {
                playClickSound();
                handleSave();
              }}
            >
              {editingDriver ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
