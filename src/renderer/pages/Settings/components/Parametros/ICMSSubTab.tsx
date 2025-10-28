//--------------------------------------------------------------------
// SUB-ABA DE CONFIGURAÇÕES DE ICMS
// Configurações específicas do Imposto sobre Circulação de Mercadorias e Serviços
// Permite cadastrar cards de configuração tributária por tipo de departamento
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../../styles/systemStyle';
import { TaxCardICMS } from './TaxCardICMS';
import { TaxFormICMS } from './TaxFormICMS';

interface ICMSConfig {
  tipo: string;
  cst: string;
  aliquota: string;
  baseCalculo: string;
  reducao: string;
  aliquotaFinal: string;
}

export function ICMSSubTab(): JSX.Element {
  const [configs, setConfigs] = useState<ICMSConfig[]>([]);

  const tipos = [
    'Consumidor Final',
    'Contribuinte ICMS',
    'ISENTO'
  ];

  const cstLabel = 'CST/CSOSN';

  const handleAddConfig = (data: ICMSConfig) => {
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
        <h2 style={styles.sectionTitle}>Configurações de ICMS</h2>
      </div>

      <TaxFormICMS
        tipos={tipos}
        cstLabel={cstLabel}
        onSubmit={handleAddConfig}
      />

      <div style={styles.cardsContainer}>
        {configs.map((config, index) => (
          <TaxCardICMS
            key={index}
            tipo={config.tipo}
            cst={config.cst}
            aliquota={config.aliquota}
            baseCalculo={config.baseCalculo}
            reducao={config.reducao}
            aliquotaFinal={config.aliquotaFinal}
            onDelete={() => handleDeleteConfig(index)}
          />
        ))}
      </div>
    </div>
  );
}
