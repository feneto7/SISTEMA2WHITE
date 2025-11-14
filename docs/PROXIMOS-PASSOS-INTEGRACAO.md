# Próximos Passos - Integração Completa MDF-e

## ✅ Correções Aplicadas

### 1. **Percurso (infPercurso)** - CORRIGIDO ✅
**Antes (errado):**
```json
"infPercurso": [
  {
    "UFPer": {
      "id": "1762951593087",
      "uf": "BA",
      "ordem": 1
    }
  }
]
```

**Depois (correto):**
```json
"infPercurso": [
  {
    "UFPer": "BA"
  }
]
```

### 2. **Condutores Vazios** - CORRIGIDO ✅
**Antes (errado):**
```json
"condutor": []  // Array vazio aparecia no JSON
```

**Depois (correto):**
```json
// Campo não aparece se não houver condutores
```

### 3. **Notas Fiscais Vazias** - CORRIGIDO ✅
**Antes (errado):**
```json
"infNFe": []  // Array vazio aparecia no JSON
```

**Depois (correto):**
```json
// Município não aparece se não houver NF-es válidas
```

### 4. **Ambiente Fiscal** - CORRIGIDO ✅
**Antes:**
```typescript
tpAmb: "2"  // Fixo em homologação
```

**Depois:**
```typescript
// Busca das configurações (Settings > Fiscal > Certificado Digital)
const ambienteFiscal = localStorage.getItem('fiscal_environment') || 'homologacao';
const tpAmb = ambienteFiscal === 'producao' ? '1' : '2';
```

---

## 🔧 Pendências - Dados da Empresa

### 1. Dados do Emitente (Tabela `company`)

**Atualmente no código:**
```json
"emit": {
  "CNPJ": "12345678900",          // ❌ Vem do formulário
  "xNome": "João Silva",           // ❌ Vem do formulário
  "xFant": "João Silva",           // ❌ Vem do formulário
  "enderEmit": {
    "xLgr": "Rua das Flores, 123", // ❌ Vem do formulário
    "nro": "S/N",
    "xBairro": "Centro",
    "cMun": "9999999",
    "xMun": "São Paulo",
    "CEP": "01234567",
    "UF": "SP"
  }
}
```

**Deve buscar da tabela `company`:**
```json
"emit": {
  "CNPJ": "[company.cnpj]",        // ✅ Buscar do banco
  "IE": "[company.ie]",            // ✅ Buscar do banco
  "xNome": "[company.razao_social]", // ✅ Buscar do banco
  "xFant": "[company.nome_fantasia]", // ✅ Buscar do banco
  "enderEmit": {
    "xLgr": "[company.endereco]",  // ✅ Buscar do banco
    "nro": "[company.numero]",     // ✅ Buscar do banco
    "xBairro": "[company.bairro]", // ✅ Buscar do banco
    "cMun": "[company.cod_municipio]", // ✅ Buscar do banco
    "xMun": "[company.municipio]", // ✅ Buscar do banco
    "CEP": "[company.cep]",        // ✅ Buscar do banco
    "UF": "[company.uf]",          // ✅ Buscar do banco
    "fone": "[company.telefone]",  // ✅ Buscar do banco (opcional)
    "email": "[company.email]"     // ✅ Buscar do banco (opcional)
  }
}
```

---

### 2. Certificado Digital

**Atualmente:**
```json
// Certificado não está sendo enviado no JSON
```

**Deve incluir:**
```json
// O certificado será usado pela API para assinar o XML
// Informação do certificado está em:
localStorage.getItem('selected_certificate')
```

**Onde usar:**
- API precisa do certificado para assinar o XML digitalmente antes de enviar para SEFAZ
- O frontend envia o nome/identificador do certificado
- API busca o certificado no servidor/HSM

---

### 3. Numeração do MDF-e

**Atualmente:**
```json
"nMDF": ""  // ❌ Campo vazio
```

**Deve:**
```json
"nMDF": "000000001"  // ✅ Buscar sequencial da API
```

**Implementação sugerida:**
1. API mantém controle de numeração por série
2. Frontend solicita próximo número disponível
3. API retorna número e reserva para evitar duplicatas

---

## 🎯 Implementação Necessária

### Passo 1: Buscar Dados da Empresa

**Criar hook/service para buscar dados da empresa:**

```typescript
// src/renderer/services/companyService.ts
export async function getCompanyData() {
  // Buscar da API ou localStorage
  const response = await fetch('/api/company');
  return response.json();
}
```

**Usar no componente NewMDFe:**

```typescript
// src/renderer/pages/MDFe/components/NewMDFe/NewMDFe.tsx
import { getCompanyData } from '../../../../services/companyService';

// No componente
const [companyData, setCompanyData] = useState(null);

useEffect(() => {
  const loadCompanyData = async () => {
    const data = await getCompanyData();
    setCompanyData(data);
  };
  loadCompanyData();
}, []);
```

---

### Passo 2: Atualizar `generateMDFeJSON`

**Modificar para receber dados da empresa:**

```typescript
export function generateMDFeJSON(formData: MDFeFormData, companyData: any): any {
  // ... código existente ...
  
  // Monta a seção emit (emitente) usando dados da empresa
  const emit: any = {
    CNPJ: formatCNPJ(companyData.cnpj),
    xNome: companyData.razao_social,
    xFant: companyData.nome_fantasia,
    enderEmit: {
      xLgr: companyData.endereco,
      nro: companyData.numero || 'S/N',
      xBairro: companyData.bairro,
      cMun: companyData.cod_municipio,
      xMun: companyData.municipio,
      CEP: formatCEP(companyData.cep),
      UF: companyData.uf
    }
  };

  // Adiciona IE apenas se preenchido
  if (companyData.ie) {
    emit.IE = companyData.ie;
  }

  // Adiciona telefone e email apenas se preenchidos
  if (companyData.telefone) {
    emit.enderEmit.fone = companyData.telefone;
  }
  if (companyData.email) {
    emit.enderEmit.email = companyData.email;
  }
  
  // ... restante do código ...
}
```

---

### Passo 3: Buscar Próximo Número MDF-e

**Criar service para numeração:**

```typescript
// src/renderer/services/mdfeService.ts
export async function getProximoNumeroMDFe(serie: string = '001') {
  const response = await fetch(`/api/mdfe/proximo-numero?serie=${serie}`);
  const data = await response.json();
  return data.numero;
}
```

**Usar no componente:**

```typescript
// Ao abrir o modal NewMDFe
useEffect(() => {
  const loadProximoNumero = async () => {
    const numero = await getProximoNumeroMDFe('001');
    setFormData(prev => ({ ...prev, numero }));
  };
  if (isOpen) {
    loadProximoNumero();
  }
}, [isOpen]);
```

---

### Passo 4: Incluir Certificado no Payload

**Adicionar informação do certificado:**

```typescript
const handleSave = () => {
  // ... validações ...
  
  // Buscar certificado selecionado
  const certificadoSelecionado = localStorage.getItem('selected_certificate');
  
  const mdfeJSON = generateMDFeJSON(formData, companyData);
  
  const mdfeData = {
    ...formData,
    mdfeJSON: mdfeJSON,
    certificado: certificadoSelecionado, // ✅ Adicionar certificado
    status: 'gerado',
    dataGeracao: new Date().toISOString()
  };

  onSave(mdfeData);
};
```

---

## 📋 Checklist de Implementação

### Frontend
- [ ] Criar `companyService.ts` para buscar dados da empresa
- [ ] Criar `mdfeService.ts` para numeração
- [ ] Atualizar `NewMDFe.tsx` para buscar dados da empresa
- [ ] Atualizar `NewMDFe.tsx` para buscar próximo número
- [ ] Modificar `generateMDFeJSON` para receber `companyData`
- [ ] Incluir certificado selecionado no payload
- [ ] Testar com dados reais da empresa

### Backend (API)
- [ ] Endpoint `GET /api/company` - Retorna dados da empresa
- [ ] Endpoint `GET /api/mdfe/proximo-numero` - Retorna próximo número
- [ ] Endpoint `POST /api/mdfe/criar` - Cria e envia MDF-e
- [ ] Controle de numeração sequencial por série
- [ ] Validação de dados da empresa
- [ ] Integração com certificado digital

### Banco de Dados
- [ ] Tabela `company` com todos os campos necessários
- [ ] Tabela `mdfe_numeracao` para controle sequencial
- [ ] Índices apropriados

---

## 🔍 Exemplo Completo do JSON Final

```json
{
  "mdfeJSON": {
    "ide": {
      "cUF": "35",
      "tpAmb": "2",
      "modelo": "58",
      "serie": "001",
      "nMDF": "000000001",  // ✅ Da API
      "modal": "1",
      "UFIni": "SP",
      "UFFim": "RJ",
      "infPercurso": [
        {"UFPer": "SP"},
        {"UFPer": "RJ"}
      ]
    },
    "emit": {
      "CNPJ": "12345678000190",  // ✅ Da tabela company
      "IE": "123456789",          // ✅ Da tabela company
      "xNome": "EMPRESA LTDA",    // ✅ Da tabela company
      "xFant": "EMPRESA",         // ✅ Da tabela company
      "enderEmit": {
        "xLgr": "Av. Paulista",   // ✅ Da tabela company
        "nro": "1000",            // ✅ Da tabela company
        "xBairro": "Bela Vista",  // ✅ Da tabela company
        "cMun": "3550308",        // ✅ Da tabela company
        "xMun": "São Paulo",      // ✅ Da tabela company
        "CEP": "01310100",        // ✅ Da tabela company
        "UF": "SP"                // ✅ Da tabela company
      }
    },
    "infModal": { ... },
    "infDoc": { ... },
    "tot": { ... }
  },
  "certificado": "Certificado A1 - CNPJ: 12.345.678/0001-90",  // ✅ Das configurações
  "ambiente": "homologacao",  // ✅ Das configurações
  "status": "gerado"
}
```

---

## 📞 Para o Desenvolvedor da API

### Dados Necessários do Frontend

A API receberá:
```json
{
  "mdfeJSON": { ... },        // JSON estruturado do MDF-e
  "certificado": "...",       // Nome do certificado selecionado
  "ambiente": "homologacao",  // Ambiente fiscal
  "status": "gerado"
}
```

### O que a API deve fazer

1. **Buscar certificado digital** pelo nome/identificador
2. **Validar dados da empresa** (se estão completos)
3. **Gerar número sequencial** se não fornecido
4. **Converter JSON → XML**
5. **Assinar XML** com certificado
6. **Enviar para SEFAZ**
7. **Retornar resposta**

---

**Última atualização:** 12/11/2025

**Status:** ⚠️ Aguardando implementação dos serviços

