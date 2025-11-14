# Formato JSON do MDF-e para API

## Visão Geral

O frontend gera um JSON estruturado seguindo o padrão da SEFAZ para envio à API. A API deve receber este JSON, converter para XML, assinar digitalmente e enviar para a SEFAZ.

## Estrutura Completa do JSON

```json
{
  "ide": {
    "cUF": "31",
    "tpAmb": "2",
    "tpEmit": "1",
    "tpTransp": "0",
    "modelo": "58",
    "serie": "001",
    "nMDF": "000000001",
    "cMDF": "12345678",
    "cDV": "0",
    "modal": "1",
    "dhEmi": "2025-11-12T10:30:00.000Z",
    "tpEmis": "1",
    "procEmi": "0",
    "verProc": "1.0.0",
    "UFIni": "MG",
    "UFFim": "SP",
    "infMunCarrega": [
      {
        "cMunCarrega": "3106200",
        "xMunCarrega": "Belo Horizonte"
      }
    ],
    "infPercurso": [
      {
        "UFPer": "MG"
      },
      {
        "UFPer": "SP"
      }
    ],
    "dhIniViagem": "2025-11-12T10:30:00.000Z"
  },
  "emit": {
    "CNPJ": "12345678000190",
    "IE": "123456789",
    "xNome": "Empresa Transportadora LTDA",
    "xFant": "Transportadora",
    "enderEmit": {
      "xLgr": "Rua Exemplo",
      "nro": "S/N",
      "xBairro": "Centro",
      "cMun": "3106200",
      "xMun": "Belo Horizonte",
      "CEP": "30000000",
      "UF": "MG",
      "fone": "",
      "email": ""
    }
  },
  "infModal": {
    "rodo": {
      "infANTT": {
        "RNTRC": "12345678"
      },
      "veicTracao": {
        "cInt": "001",
        "placa": "ABC1234",
        "RENAVAM": "12345678901",
        "tara": "0",
        "capKG": "30000",
        "tpRod": "01",
        "tpCar": "00",
        "UF": "MG",
        "condutor": [
          {
            "xNome": "João da Silva",
            "CPF": "12345678901"
          }
        ],
        "prop": {
          "CNPJ": "12345678000190",
          "RNTRC": "12345678",
          "xNome": "Proprietário LTDA",
          "IE": "123456789",
          "UF": "MG",
          "tpProp": "0"
        }
      },
      "codAgPorto": "",
      "lacRodo": [
        {
          "nLacre": "12345"
        }
      ],
      "infContratante": [
        {
          "CNPJ": "98765432000190",
          "infPag": [
            {
              "xNome": "Responsável Pagamento",
              "CPF": "98765432100",
              "vContrato": "5000.00",
              "indPag": "0"
            }
          ]
        }
      ]
    }
  },
  "infDoc": {
    "infMunDescarga": [
      {
        "cMunDescarga": "3550308",
        "xMunDescarga": "São Paulo",
        "infNFe": [
          {
            "chNFe": "35200112345678000190550010000000011234567890",
            "SegCodBarra": "",
            "indReentrega": "0",
            "infUnidTransp": [],
            "peri": []
          }
        ]
      }
    ]
  },
  "seg": [
    {
      "infResp": {
        "respSeg": "1",
        "CNPJ": "12345678000190"
      },
      "infSeg": {
        "xSeg": "Seguradora XYZ",
        "CNPJ": "98765432000190"
      },
      "nApol": "123456",
      "nAver": ["AV123", "AV456"]
    }
  ],
  "tot": {
    "qNFe": "1",
    "qCTe": "0",
    "qMDFe": "0",
    "vCarga": "50000.00",
    "cUnid": "01",
    "qCarga": "15000.000"
  },
  "autXML": [
    {
      "CNPJ": "12345678000190"
    }
  ],
  "infAdic": {
    "infCpl": "Observações adicionais sobre o transporte"
  }
}
```

## Descrição dos Campos Principais

### ide (Identificação do MDF-e)
- `cUF`: Código da UF do emitente
- `tpAmb`: Tipo de ambiente (1-Produção, 2-Homologação)
- `tpEmit`: Tipo de emitente (1-Prestador de serviço de transporte)
- `modelo`: Modelo do documento (58 para MDF-e)
- `serie`: Série do MDF-e
- `nMDF`: Número do MDF-e
- `modal`: Modal de transporte (1-Rodoviário, 2-Aéreo, 3-Aquaviário, 4-Ferroviário)
- `dhEmi`: Data e hora de emissão
- `UFIni`: UF de início da viagem
- `UFFim`: UF de fim da viagem

### emit (Emitente)
- `CNPJ`: CNPJ do emitente
- `IE`: Inscrição Estadual
- `xNome`: Razão social
- `enderEmit`: Endereço completo do emitente

### infModal (Informações do Modal)
Para transporte rodoviário:
- `infANTT`: Informações da ANTT (RNTRC)
- `veicTracao`: Dados do veículo de tração (placa, RENAVAM, capacidade)
- `condutor`: Lista de condutores (nome e CPF)
- `prop`: Dados do proprietário do veículo (se diferente do emitente)
- `lacRodo`: Lacres do veículo
- `infContratante`: Informações de vale-pedágio

### infDoc (Documentos Fiscais)
- `infMunDescarga`: Municípios de descarga
  - `infNFe`: Chaves das NF-e transportadas

### seg (Seguro)
- `infResp`: Responsável pelo seguro
- `infSeg`: Dados da seguradora
- `nApol`: Número da apólice
- `nAver`: Números das averbações

### tot (Totalizadores)
- `qNFe`: Quantidade de NF-e
- `vCarga`: Valor total da carga
- `cUnid`: Unidade de medida (01-KG, 02-TON)
- `qCarga`: Peso total da carga

## Fluxo de Processamento na API

1. **Receber JSON**: A API recebe o JSON estruturado do frontend
2. **Validar**: Validar campos obrigatórios e formatos
3. **Converter para XML**: Transformar o JSON no XML do schema da SEFAZ
4. **Assinar**: Assinar digitalmente o XML com certificado A1/A3
5. **Enviar**: Transmitir para a SEFAZ via Web Service
6. **Processar Resposta**: Receber protocolo de autorização ou rejeição
7. **Retornar**: Devolver status e dados para o frontend

## Endpoints Sugeridos

```
POST /api/mdfe/criar
Body: { mdfeJSON: {...} }
Response: { 
  success: true, 
  protocolo: "123456789012345",
  chave: "35200112345678000190580010000000011234567890",
  status: "autorizado"
}

GET /api/mdfe/:id
Response: { 
  mdfeJSON: {...},
  xml: "<?xml...",
  protocolo: "123456789012345",
  status: "autorizado"
}

POST /api/mdfe/:id/cancelar
Body: { justificativa: "..." }
Response: { success: true, status: "cancelado" }

POST /api/mdfe/:id/encerrar
Body: { municipio: "...", uf: "..." }
Response: { success: true, status: "encerrado" }
```

## Observações Importantes

1. **Códigos de Município**: A API deve ter uma tabela completa de códigos IBGE
2. **Validação de Chave NF-e**: Verificar formato das chaves das NF-e (44 dígitos)
3. **Certificado Digital**: API precisa do certificado A1/A3 para assinatura
4. **Ambiente**: Usar ambiente de homologação (tpAmb=2) para testes
5. **cMDF e cDV**: Calcular corretamente o código de controle e dígito verificador

## Bibliotecas Recomendadas (Node.js)

- `xml2js`: Conversão JSON ↔ XML
- `node-forge`: Assinatura digital
- `axios`: Requisições HTTP para SEFAZ
- `soap`: Cliente SOAP para Web Services da SEFAZ

## Referências

- Manual de Integração MDF-e: http://www.mdfe.fazenda.gov.br/
- Schema XML: http://www.portalfiscal.inf.br/mdfe

