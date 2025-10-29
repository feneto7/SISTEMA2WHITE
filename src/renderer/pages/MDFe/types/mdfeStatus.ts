import { systemColors } from '../../../styles/systemStyle';
// Tipos e utilitários para status de MDF-e
// Define os possíveis status conforme o fluxo de trabalho da SEFAZ

export type MDFeStatus = 
  | 'autorizado'
  | 'cancelado'
  | 'encerrado'
  | 'rejeitado'
  | 'emDigitacao'
  | 'transmitidoAguardando'
  | 'encerramentoPendente'
  | 'erroTransmissao'
  | 'inutilizado';

// Descrições dos status para exibição ao usuário
export const MDFeStatusLabels: Record<MDFeStatus, string> = {
  autorizado: 'Autorizado',
  cancelado: 'Cancelado',
  encerrado: 'Encerrado',
  rejeitado: 'Rejeitado',
  emDigitacao: 'Em Digitação',
  transmitidoAguardando: 'Aguardando Autorização',
  encerramentoPendente: 'Encerramento Pendente',
  erroTransmissao: 'Erro de Transmissão',
  inutilizado: 'Inutilizado'
};

// Descrições detalhadas dos status
export const MDFeStatusDescriptions: Record<MDFeStatus, string> = {
  autorizado: 'MDF-e foi transmitido e aprovado pela SEFAZ — documento válido e ativo.',
  cancelado: 'MDF-e autorizado anteriormente, mas cancelado dentro do prazo legal (antes do início da viagem).',
  encerrado: 'MDF-e autorizado e posteriormente encerrado, indicando o fim da viagem.',
  rejeitado: 'MDF-e foi transmitido, mas teve algum erro e não foi autorizado pela SEFAZ.',
  emDigitacao: 'Documento ainda sendo montado no sistema, não transmitido.',
  transmitidoAguardando: 'Foi enviado à SEFAZ, mas ainda sem retorno de autorização (status pendente).',
  encerramentoPendente: 'MDF-e autorizado e viagem encerrada na prática, mas encerramento ainda não transmitido para SEFAZ.',
  erroTransmissao: 'Houve falha ao tentar enviar o MDF-e para a SEFAZ.',
  inutilizado: 'Numeração de MDF-e declarada como não utilizada.'
};

// Cores e estilos para cada status
export interface MDFeStatusStyle {
  color: string;
  background: string;
}

export const MDFeStatusStyles: Record<MDFeStatus, MDFeStatusStyle> = {
  autorizado: {
    color: systemColors.status.authorized.color,
    background: systemColors.status.authorized.background
  },
  cancelado: {
    color: systemColors.status.canceled.color,
    background: systemColors.status.canceled.background
  },
  encerrado: {
    color: systemColors.status.closed.color,
    background: systemColors.status.closed.background
  },
  rejeitado: {
    color: systemColors.status.rejected.color,
    background: systemColors.status.rejected.background
  },
  emDigitacao: {
    color: systemColors.status.editing.color,
    background: systemColors.status.editing.background
  },
  transmitidoAguardando: {
    color: systemColors.status.waiting.color,
    background: systemColors.status.waiting.background
  },
  encerramentoPendente: {
    color: systemColors.status.closingPending.color,
    background: systemColors.status.closingPending.background
  },
  erroTransmissao: {
    color: systemColors.status.transmissionError.color,
    background: systemColors.status.transmissionError.background
  },
  inutilizado: {
    color: systemColors.status.voided.color,
    background: systemColors.status.voided.background
  }
};

/**
 * Valida se um status é válido
 */
export function isValidMDFeStatus(status: string): status is MDFeStatus {
  return Object.keys(MDFeStatusLabels).includes(status as MDFeStatus);
}

/**
 * Obtém o estilo para um status
 */
export function getMDFeStatusStyle(status: MDFeStatus): MDFeStatusStyle {
  return MDFeStatusStyles[status];
}

/**
 * Obtém o label formatado para um status
 */
export function getMDFeStatusLabel(status: MDFeStatus): string {
  return MDFeStatusLabels[status];
}

/**
 * Obtém a descrição completa de um status
 */
export function getMDFeStatusDescription(status: MDFeStatus): string {
  return MDFeStatusDescriptions[status];
}

/**
 * Mapeia status legados para os novos tipos
 * Mantido para compatibilidade com dados existentes
 */
export function mapLegacyStatus(legacyStatus: string): MDFeStatus {
  const statusMap: Record<string, MDFeStatus> = {
    'autorizada': 'autorizado',
    'autorizado': 'autorizado',
    'pendente': 'transmitidoAguardando',
    'cancelada': 'cancelado',
    'cancelado': 'cancelado',
    'rejeitada': 'rejeitado',
    'rejeitado': 'rejeitado'
  };

  if (statusMap[legacyStatus]) {
    return statusMap[legacyStatus];
  }

  // Se o status já é válido, retorna ele mesmo
  if (isValidMDFeStatus(legacyStatus as MDFeStatus)) {
    return legacyStatus as MDFeStatus;
  }

  // Fallback para status desconhecido
  return 'emDigitacao';
}

