//--------------------------------------------------------------------
// SUB-ABA DE CONFIGURAÇÕES DE COFINS
// Configurações específicas da Contribuição para o Financiamento da Seguridade Social
// Permite cadastrar cards de configuração tributária por departamento
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../../styles/systemStyle';
import { TaxCard } from './TaxCard';
import { TaxFormCOFINS } from './TaxFormCOFINS';

interface COFINSConfig {
  nomeDepartamento: string;
  st: string;
  aliquota: string;
  aliquotaPorUnidade?: string;
}

export function COFINSSubTab(): JSX.Element {
  const [configs, setConfigs] = useState<COFINSConfig[]>([]);

  const handleAddConfig = (data: COFINSConfig) => {
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
        <h2 style={styles.sectionTitle}>Configurações de COFINS</h2>
      </div>

      <TaxFormCOFINS onSubmit={handleAddConfig} />

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
