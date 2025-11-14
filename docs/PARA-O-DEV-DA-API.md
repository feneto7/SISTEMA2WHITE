# 📋 Para o Desenvolvedor da API - MDF-e

## TL;DR (Resumo Executivo)

O **frontend** agora gera um **JSON estruturado** no padrão SEFAZ quando o usuário clica em "Criar MDF-e". 

Você receberá este JSON e deverá:
1. Validar
2. Converter para XML
3. Assinar digitalmente
4. Enviar para SEFAZ
5. Retornar o resultado

---

## 📦 O que você vai receber

### Endpoint esperado
```
POST /api/mdfe/criar
```

### Formato do Body
```json
{
  "mdfeJSON": {
    "ide": { "cUF": "31", "tpAmb": "2", ... },
    "emit": { "CNPJ": "12345678000190", ... },
    "infModal": { "rodo": { ... } },
    "infDoc": { "infMunDescarga": [...] },
    "seg": [...],
    "tot": { "qNFe": "1", "vCarga": "50000.00", ... },
    "autXML": [...],
    "infAdic": { "infCpl": "..." }
  },
  "status": "gerado",
  "dataGeracao": "2025-11-12T14:30:00.000Z"
}
```

📄 **Ver exemplo completo em:** `docs/exemplo-json-enviado.json`

---

## ✅ O que você precisa fazer

### 1️⃣ Receber e Validar
```javascript
app.post('/api/mdfe/criar', (req, res) => {
  const { mdfeJSON } = req.body;
  
  // Validar estrutura
  // Validar CNPJ/CPF
  // Validar chaves NF-e (44 dígitos)
});
```

### 2️⃣ Enriquecer Dados
- Buscar **códigos de município IBGE** (substituir o `9999999` genérico)
- Calcular **dígito verificador (cDV)** correto
- Validar e ajustar formato de data/hora

### 3️⃣ Converter JSON → XML
```javascript
// Transformar o JSON no XML do schema SEFAZ v3.00
const xml = converterParaXML(mdfeJSON);
```

### 4️⃣ Assinar Digitalmente
```javascript
// Com certificado A1 ou A3
const xmlAssinado = assinarXML(xml, certificado);
```

### 5️⃣ Enviar para SEFAZ
```javascript
// Web Service SOAP
const resposta = await enviarSEFAZ(xmlAssinado);
```

**URLs (Homologação):**
- `https://mdfe-homologacao.svrs.rs.gov.br/ws/MDFeRecepcao/MDFeRecepcao.asmx`

### 6️⃣ Retornar Resposta
```json
{
  "success": true,
  "data": {
    "status": "autorizado",
    "protocolo": "135200012345678",
    "chave": "31251112345678000190580010000000011234567893",
    "xml": "<?xml...>",
    "qrCode": "https://..."
  }
}
```

📄 **Ver exemplo em:** `docs/exemplo-resposta-api.json`

---

## 📚 Documentação Disponível

| Arquivo | Descrição |
|---------|-----------|
| `docs/mdfe-json-format.md` | **Documentação completa** do formato JSON |
| `docs/exemplo-json-enviado.json` | Exemplo real do JSON que você receberá |
| `docs/exemplo-resposta-api.json` | Formato de resposta esperado pelo frontend |
| `docs/guia-implementacao-api.md` | **Guia detalhado** de implementação |
| `docs/RESUMO-MUDANCAS-MDFE.md` | Resumo das mudanças no frontend |
| `docs/teste-rapido.md` | Como testar o fluxo completo |

👉 **Comece lendo:** `docs/guia-implementacao-api.md`

---

## 🔑 Campos Importantes

### ⚠️ Atenção Especial

1. **cMun (Código Município)**
   - Frontend envia: `9999999` (genérico)
   - API **DEVE**: Buscar código IBGE correto
   
2. **cDV (Dígito Verificador)**
   - Frontend envia: `0` (placeholder)
   - API **DEVE**: Calcular corretamente

3. **tpAmb (Ambiente)**
   - Atualmente: `2` (Homologação)
   - Produção: Alterar para `1`

---

## 🛠️ Tecnologias Recomendadas (Node.js)

```bash
npm install express xml2js node-forge soap axios joi
```

- **xml2js** ou **fast-xml-parser**: JSON ↔ XML
- **node-forge**: Assinatura digital
- **soap**: Cliente SOAP para SEFAZ
- **joi**: Validação de dados
- **axios**: Requisições HTTP

---

## 📊 Banco de Dados Sugerido

```sql
CREATE TABLE mdfe (
  id VARCHAR(36) PRIMARY KEY,
  chave VARCHAR(44),
  protocolo VARCHAR(20),
  status VARCHAR(20), -- gerado, autorizado, rejeitado, cancelado
  mdfe_json JSON,
  xml_enviado TEXT,
  xml_autorizado TEXT,
  data_autorizacao TIMESTAMP
);
```

---

## 🧪 Testando

### Passo 1: Frontend
```bash
# Rodar o frontend
npm start

# Acessar MDF-e → Nova MDF-e → Preencher → Criar
# Copiar JSON do console (F12)
```

### Passo 2: API
```bash
# Testar endpoint
curl -X POST http://localhost:3000/api/mdfe/criar \
  -H "Content-Type: application/json" \
  -d @exemplo-json-enviado.json
```

### Passo 3: SEFAZ (Homologação)
- Usar CNPJ válido
- Usar certificado digital válido
- tpAmb = 2

---

## 🔐 Segurança

### Certificado Digital
- ⚠️ **NUNCA** versionar no Git
- Usar variáveis de ambiente
- Armazenar em local seguro
- Renovar antes do vencimento

### API
- ✅ HTTPS em produção
- ✅ Autenticação (JWT/OAuth)
- ✅ Rate limiting
- ✅ Logs de auditoria

---

## 🚨 Códigos de Status SEFAZ

| Código | Descrição | Ação |
|--------|-----------|------|
| 100 | Autorizado | ✅ Sucesso |
| 103 | Lote recebido | ⏳ Aguardar processamento |
| 217 | NF-e não encontrada | ❌ Validar chave |
| 225 | Falha no Schema | ❌ Validar XML |
| 401 | CPF inválido | ❌ Validar formato |

📄 **Lista completa:** Manual de Integração MDF-e

---

## 📞 Endpoints Sugeridos

```
POST   /api/mdfe/criar         - Criar e autorizar MDF-e
GET    /api/mdfe/:id           - Consultar MDF-e
POST   /api/mdfe/:id/cancelar  - Cancelar MDF-e
POST   /api/mdfe/:id/encerrar  - Encerrar MDF-e
GET    /api/mdfe/:id/pdf       - Baixar DAMDFE
GET    /api/mdfe/:id/xml       - Baixar XML
```

---

## 🎯 Checklist de Implementação

Backend:
- [ ] Criar endpoint POST /api/mdfe/criar
- [ ] Implementar validação do JSON
- [ ] Buscar códigos IBGE de municípios
- [ ] Calcular cDV (dígito verificador)
- [ ] Converter JSON → XML
- [ ] Implementar assinatura digital
- [ ] Integrar com Web Service SEFAZ
- [ ] Tratar retorno da SEFAZ
- [ ] Salvar no banco de dados
- [ ] Retornar resposta formatada

Infraestrutura:
- [ ] Configurar certificado digital
- [ ] Configurar ambiente de homologação
- [ ] Implementar logs
- [ ] Implementar tratamento de erros
- [ ] Testes unitários
- [ ] Testes de integração

Extras:
- [ ] Endpoint de consulta
- [ ] Endpoint de cancelamento
- [ ] Endpoint de encerramento
- [ ] Geração de PDF (DAMDFE)

---

## 📖 Referências Oficiais

- 🌐 Portal MDF-e: http://www.mdfe.fazenda.gov.br/
- 📄 Manual v3.00: http://www.mdfe.fazenda.gov.br/portal/manual.aspx
- 🔧 Web Services: http://www.mdfe.fazenda.gov.br/portal/webServices.aspx
- 📋 Schemas XML: http://www.portalfiscal.inf.br/mdfe

---

## 💬 Dúvidas?

1. Ler `docs/guia-implementacao-api.md`
2. Conferir exemplos em `docs/exemplo-*.json`
3. Consultar Manual oficial da SEFAZ
4. Entrar em contato com o time do frontend

---

## 🚀 Próximos Passos

1. ✅ Ler esta documentação
2. ✅ Criar estrutura básica da API
3. ✅ Implementar endpoint POST /api/mdfe/criar
4. ✅ Testar com exemplo-json-enviado.json
5. ✅ Integrar com SEFAZ (homologação)
6. ✅ Validar retorno
7. ✅ Deploy

**Prazo estimado:** 2-3 semanas (depende da complexidade da integração SEFAZ)

---

## ✨ Boa sorte!

A parte mais complexa (geração do JSON estruturado) já está pronta no frontend.
Agora é "só" fazer a mágica acontecer na API! 🎩✨

---

**Última atualização:** 12/11/2025

