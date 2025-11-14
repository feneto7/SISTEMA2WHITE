# Guia de Implementação - API MDF-e

## Visão Geral

Este guia explica como a API deve processar o JSON recebido do frontend e comunicar-se com a SEFAZ.

## Fluxo Completo

```
Frontend → API → SEFAZ → API → Frontend
```

### 1. Frontend envia JSON
```json
POST /api/mdfe/criar
Content-Type: application/json

{
  "mdfeJSON": { ... },
  "status": "gerado",
  "dataGeracao": "..."
}
```

### 2. API processa

#### 2.1. Validar JSON
```javascript
// Validações obrigatórias
- Verificar campos obrigatórios
- Validar formato de CNPJ/CPF
- Validar chaves de NF-e (44 dígitos)
- Verificar UFs válidas
- Validar códigos de município
```

#### 2.2. Enriquecer Dados
```javascript
// Buscar dados complementares
- Códigos de município (tabela IBGE)
- Calcular dígito verificador (cDV)
- Gerar código de controle (cMDF) se necessário
- Verificar certificado digital válido
```

#### 2.3. Converter JSON → XML
```javascript
// Transformar JSON em XML conforme schema SEFAZ
const xml = convertToXML(mdfeJSON, {
  namespace: 'http://www.portalfiscal.inf.br/mdfe',
  version: '3.00',
  encoding: 'UTF-8'
});
```

**Exemplo de XML gerado:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<MDFe xmlns="http://www.portalfiscal.inf.br/mdfe">
  <infMDFe versao="3.00" Id="MDFe31251112345678000190580010000000011234567893">
    <ide>
      <cUF>31</cUF>
      <tpAmb>2</tpAmb>
      <tpEmit>1</tpEmit>
      <tpTransp>0</tpTransp>
      <modelo>58</modelo>
      <serie>1</serie>
      <nMDF>1</nMDF>
      <cMDF>12345678</cMDF>
      <cDV>3</cDV>
      <modal>1</modal>
      <dhEmi>2025-11-12T14:30:00-03:00</dhEmi>
      <tpEmis>1</tpEmis>
      <procEmi>0</procEmi>
      <verProc>1.0.0</verProc>
      <UFIni>MG</UFIni>
      <UFFim>SP</UFFim>
      <infMunCarrega>
        <cMunCarrega>3106200</cMunCarrega>
        <xMunCarrega>Belo Horizonte</xMunCarrega>
      </infMunCarrega>
      <infPercurso>
        <UFPer>MG</UFPer>
      </infPercurso>
      <infPercurso>
        <UFPer>SP</UFPer>
      </infPercurso>
      <dhIniViagem>2025-11-12T14:30:00-03:00</dhIniViagem>
    </ide>
    <!-- ... demais tags ... -->
  </infMDFe>
</MDFe>
```

#### 2.4. Assinar XML
```javascript
// Assinar digitalmente com certificado A1 ou A3
const xmlAssinado = signXML(xml, {
  certificate: certificadoDigital,
  algorithm: 'RSA-SHA256',
  canonicalization: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
});
```

#### 2.5. Enviar para SEFAZ
```javascript
// Web Service da SEFAZ
const response = await soapClient.call('mdfeRecepcao', {
  nfeDadosMsg: xmlAssinado
});
```

**Endpoints SEFAZ (Ambiente de Homologação):**
```
Autorização: https://mdfe-homologacao.svrs.rs.gov.br/ws/MDFeRecepcao/MDFeRecepcao.asmx
Consulta: https://mdfe-homologacao.svrs.rs.gov.br/ws/MDFeConsulta/MDFeConsulta.asmx
Cancelamento: https://mdfe-homologacao.svrs.rs.gov.br/ws/MDFeRecepcaoEvento/MDFeRecepcaoEvento.asmx
```

#### 2.6. Processar Retorno
```javascript
// Analisar resposta da SEFAZ
const retorno = parseXML(response);

if (retorno.cStat === '100') {
  // Autorizado
  return {
    success: true,
    status: 'autorizado',
    protocolo: retorno.nProt,
    chave: retorno.chMDFe,
    dhRecbto: retorno.dhRecbto
  };
} else if (retorno.cStat === '103') {
  // Lote em processamento
  // Aguardar e consultar novamente
} else {
  // Erro/Rejeição
  return {
    success: false,
    status: 'rejeitado',
    erro: retorno.xMotivo,
    codigo: retorno.cStat
  };
}
```

### 3. API retorna para Frontend

**Sucesso:**
```json
{
  "success": true,
  "message": "MDF-e autorizado com sucesso",
  "data": {
    "id": "mdfe_123456",
    "status": "autorizado",
    "protocolo": "135200012345678",
    "chave": "31251112345678000190580010000000011234567893",
    "dhRecbto": "2025-11-12T14:35:22-03:00",
    "xml": "<?xml...>",
    "qrCode": "https://mdfe.fazenda.gov.br/qrcode?chave=..."
  }
}
```

**Erro:**
```json
{
  "success": false,
  "message": "Erro ao processar MDF-e",
  "error": {
    "codigo": "217",
    "descricao": "NF-e não consta na base de dados da SEFAZ",
    "campo": "chNFe",
    "tipo": "rejeicao"
  }
}
```

## Códigos de Status SEFAZ

### Autorizados
- `100` - Autorizado o uso do MDF-e
- `132` - MDF-e já está autorizado

### Em Processamento
- `103` - Lote recebido com sucesso
- `105` - Lote em processamento

### Rejeitados (Exemplos)
- `204` - Rejeição: Duplicidade de NF-e
- `217` - NF-e não consta na base de dados da SEFAZ
- `225` - Rejeição: Falha no Schema XML
- `226` - Código da UF do Emitente diverge da UF autorizadora
- `401` - CPF do remetente inválido
- `402` - XML mal formado

## Estrutura do Banco de Dados Sugerida

```sql
CREATE TABLE mdfe (
  id VARCHAR(36) PRIMARY KEY,
  numero VARCHAR(20) NOT NULL,
  serie VARCHAR(3) NOT NULL,
  chave VARCHAR(44),
  protocolo VARCHAR(20),
  status VARCHAR(20), -- gerado, autorizado, rejeitado, cancelado, encerrado
  mdfe_json JSON NOT NULL,
  xml_enviado TEXT,
  xml_autorizado TEXT,
  motivo_rejeicao TEXT,
  ambiente VARCHAR(15), -- producao, homologacao
  data_geracao TIMESTAMP,
  data_autorizacao TIMESTAMP,
  data_cancelamento TIMESTAMP,
  data_encerramento TIMESTAMP,
  empresa_id VARCHAR(36),
  usuario_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_chave (chave),
  INDEX idx_status (status),
  INDEX idx_empresa (empresa_id)
);

CREATE TABLE mdfe_eventos (
  id VARCHAR(36) PRIMARY KEY,
  mdfe_id VARCHAR(36) NOT NULL,
  tipo_evento VARCHAR(20), -- cancelamento, encerramento
  sequencia INT NOT NULL,
  protocolo VARCHAR(20),
  chave VARCHAR(44),
  justificativa TEXT,
  municipio VARCHAR(100),
  uf VARCHAR(2),
  xml_evento TEXT,
  data_evento TIMESTAMP,
  FOREIGN KEY (mdfe_id) REFERENCES mdfe(id)
);
```

## Bibliotecas Node.js Recomendadas

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "xml2js": "^0.6.0",
    "fast-xml-parser": "^4.3.0",
    "node-forge": "^1.3.0",
    "soap": "^1.0.0",
    "axios": "^1.6.0",
    "joi": "^17.11.0",
    "moment-timezone": "^0.5.43"
  }
}
```

## Exemplo de Implementação (Node.js)

```javascript
const express = require('express');
const { parseXML, buildXML } = require('fast-xml-parser');
const forge = require('node-forge');
const soap = require('soap');

class MDFeService {
  async criarMDFe(mdfeJSON) {
    // 1. Validar
    this.validarJSON(mdfeJSON);
    
    // 2. Enriquecer dados
    const dadosCompletos = await this.enriquecerDados(mdfeJSON);
    
    // 3. Converter para XML
    const xml = this.converterParaXML(dadosCompletos);
    
    // 4. Assinar
    const xmlAssinado = await this.assinarXML(xml);
    
    // 5. Enviar para SEFAZ
    const resposta = await this.enviarParaSEFAZ(xmlAssinado);
    
    // 6. Processar retorno
    return this.processarRetorno(resposta);
  }
  
  validarJSON(mdfeJSON) {
    // Implementar validações
  }
  
  async enriquecerDados(mdfeJSON) {
    // Buscar códigos de município
    // Calcular dígitos
    return mdfeJSON;
  }
  
  converterParaXML(dados) {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    });
    return builder.build(dados);
  }
  
  async assinarXML(xml) {
    // Carregar certificado
    const cert = this.carregarCertificado();
    // Assinar XML
    // Retornar XML assinado
  }
  
  async enviarParaSEFAZ(xml) {
    const url = this.getURLSEFAZ();
    const client = await soap.createClientAsync(url);
    const result = await client.mdfeRecepcaoAsync({ nfeDadosMsg: xml });
    return result;
  }
  
  processarRetorno(resposta) {
    // Analisar resposta e formatar
  }
}

// Rota Express
app.post('/api/mdfe/criar', async (req, res) => {
  try {
    const { mdfeJSON } = req.body;
    const service = new MDFeService();
    const resultado = await service.criarMDFe(mdfeJSON);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});
```

## Segurança

### Certificado Digital
- Armazenar certificado em local seguro
- Nunca versionar certificado no Git
- Usar variáveis de ambiente para senha
- Renovar certificado antes do vencimento

### API
- Usar HTTPS em produção
- Implementar autenticação (JWT, OAuth)
- Rate limiting
- Logs de auditoria
- Validar origem das requisições

## Testes

### Ambiente de Homologação
1. CNPJ de teste: usar CNPJ válido mas com tpAmb=2
2. NF-e: usar chaves válidas (44 dígitos)
3. Certificado: usar certificado válido (mesmo em homologação)

### Casos de Teste
- [ ] MDF-e com 1 NF-e
- [ ] MDF-e com múltiplas NF-e
- [ ] MDF-e com vale-pedágio
- [ ] MDF-e com seguro
- [ ] MDF-e com múltiplos condutores
- [ ] Cancelamento de MDF-e
- [ ] Encerramento de MDF-e

## Monitoramento

### Logs Essenciais
- Tempo de resposta da SEFAZ
- Taxa de rejeição
- Erros de certificado
- Timeouts
- Status das requisições

### Alertas
- Certificado próximo do vencimento (30 dias)
- Taxa de rejeição > 10%
- Tempo de resposta > 30 segundos
- SEFAZ indisponível

## Documentação de Referência

- Manual MDF-e v3.00: http://www.mdfe.fazenda.gov.br/
- Web Services: http://www.mdfe.fazenda.gov.br/portal/webServices.aspx
- Schemas XML: http://www.portalfiscal.inf.br/mdfe
- Códigos de Erro: Manual de Integração MDF-e

## Contato e Suporte

Para dúvidas sobre o formato JSON enviado pelo frontend, consultar:
- `docs/mdfe-json-format.md`
- `docs/exemplo-json-enviado.json`
- `docs/RESUMO-MUDANCAS-MDFE.md`

