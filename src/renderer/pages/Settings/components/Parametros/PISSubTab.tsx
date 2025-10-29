//--------------------------------------------------------------------
// SUB-ABA DE CONFIGURAÇÕES DE PIS
// Configurações específicas do Programa de Integração Social
// Permite cadastrar cards de configuração tributária por departamento
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { TaxCard } from './TaxCard';
import { TaxFormPIS } from './TaxFormPIS';

interface PISConfig {
  nomeDepartamento: string;
  st: string;
  aliquota: string;
  aliquotaPorUnidade?: string;
}

export function PISSubTab(): JSX.Element {
  const [configs, setConfigs] = useState<PISConfig[]>([]);
  const { systemStyles, systemColors } = useTheme();

  const handleAddConfig = (data: PISConfig) => {
    setConfigs([...configs, data]);
  };

  const handleDeleteConfig = (index: number) => {
    setConfigs(configs.filter((_, i) => i !== index));
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    cardsContainer: {
      display: 'flex',
      flexDirection: 'column' as const
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={styles.sectionTitle}>Configurações de PIS</h2>
      </div>

      <TaxFormPIS onSubmit={handleAddConfig} />

      <div style={styles.cardsContainer}>
        {configs.map((config, index) => (
          <TaxCard
            key={index}
            nomeDepartamento={config.nomeDepartamento}
            st={config.st}
            aliquota={config.aliquota}
            aliquotaPorUnidade={config.aliquotaPorUnidade}
            onDelete={() => handleDeleteConfig(index)}
          />
        ))}
      </div>
    </div>
  );
}
