//--------------------------------------------------------------------
// SUB-ABA DE MDF-e
// Configurações de numeração e série para MDF-e
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemColors, systemStyles } from '../../../../styles/systemStyle';

interface FormData {
  serie: string;
  numero: string;
}

export function MDFeSubTab(): JSX.Element {
  const [producao, setProducao] = useState<FormData>({ serie: '', numero: '' });
  const [homologacao, setHomologacao] = useState<FormData>({ serie: '', numero: '' });

  const [isProducaoSerieFocused, setIsProducaoSerieFocused] = useState(false);
  const [isProducaoNumeroFocused, setIsProducaoNumeroFocused] = useState(false);
  const [isHomologacaoSerieFocused, setIsHomologacaoSerieFocused] = useState(false);
  const [isHomologacaoNumeroFocused, setIsHomologacaoNumeroFocused] = useState(false);

  const getInputStyle = (isFocused: boolean) => ({
    ...systemStyles.input.field,
    ...(isFocused ? systemStyles.input.fieldFocus : {})
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <p style={{ 
        fontSize: '13px', 
        color: systemColors.text.secondary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        Configure o próximo número de série e numeração para MDF-e.
      </p>

      {/* Ambiente de Produção */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: systemColors.text.primary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: 0
        }}>
          Ambiente de Produção
        </h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Série Produção */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Série</label>
            <input
              type="text"
              value={producao.serie}
              onChange={(e) => setProducao({ ...producao, serie: e.target.value })}
              onFocus={() => setIsProducaoSerieFocused(true)}
              onBlur={() => setIsProducaoSerieFocused(false)}
              placeholder="Ex: 1"
              style={getInputStyle(isProducaoSerieFocused)}
            />
          </div>

          {/* Número Produção */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Número</label>
            <input
              type="text"
              value={producao.numero}
              onChange={(e) => setProducao({ ...producao, numero: e.target.value })}
              onFocus={() => setIsProducaoNumeroFocused(true)}
              onBlur={() => setIsProducaoNumeroFocused(false)}
              placeholder="Ex: 000000001"
              style={getInputStyle(isProducaoNumeroFocused)}
            />
          </div>
        </div>
      </div>

      {/* Ambiente de Homologação */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: systemColors.text.primary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: 0
        }}>
          Ambiente de Homologação
        </h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Série Homologação */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Série</label>
            <input
              type="text"
              value={homologacao.serie}
              onChange={(e) => setHomologacao({ ...homologacao, serie: e.target.value })}
              onFocus={() => setIsHomologacaoSerieFocused(true)}
              onBlur={() => setIsHomologacaoSerieFocused(false)}
              placeholder="Ex: 1"
              style={getInputStyle(isHomologacaoSerieFocused)}
            />
          </div>

          {/* Número Homologação */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Número</label>
            <input
              type="text"
              value={homologacao.numero}
              onChange={(e) => setHomologacao({ ...homologacao, numero: e.target.value })}
              onFocus={() => setIsHomologacaoNumeroFocused(true)}
              onBlur={() => setIsHomologacaoNumeroFocused(false)}
              placeholder="Ex: 000000001"
              style={getInputStyle(isHomologacaoNumeroFocused)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
