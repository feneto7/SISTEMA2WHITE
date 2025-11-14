# Resumo das Mudanças - Sistema MDF-e

## O que foi alterado?

### Antes
- O sistema gerava **XML** diretamente no frontend
- XML era incompleto e não seguia completamente o padrão SEFAZ
- Função chamada: `generateMDFeXML()`

### Depois  
- O sistema agora gera **JSON estruturado** no padrão SEFAZ
- JSON completo com todas as tags e campos necessários
- Função chamada: `generateMDFeJSON()`
- A API receberá este JSON para processar e enviar à SEFAZ

## Arquivos Modificados

### 1. `src/renderer/utils/mdfeValidator.ts`
**Mudanças:**
- Função `generateMDFeXML()` substituída por `generateMDFeJSON()`
- Novas funções auxiliares para gerar JSON estruturado:
  - `generateInfModalJSON()` - Informações do modal de transporte
  - `generateInfDocJSON()` - Documentos fiscais
  - `generateSegJSON()` - Informações de seguro
  - `generateInfPagJSON()` - Informações de pagamento
- Função `getModalCode()` - Converte tipo de MDF-e para código numérico

**O que a função retorna:**
```javascript
{
  ide: { /* identificação */ },
  emit: { /* emitente */ },
  infModal: { /* modal transporte */ },
  infDoc: { /* documentos */ },
  seg: [ /* seguros */ ],
  tot: { /* totalizadores */ },
  autXML: [ /* autorizados */ ],
  infAdic: { /* informações adicionais */ }
}
```

### 2. `src/renderer/pages/MDFe/components/NewMDFe/NewMDFe.tsx`
**Mudanças:**
- Import alterado: `generateMDFeXML` → `generateMDFeJSON`
- Função `handleSave()` atualizada para gerar JSON ao invés de XML
- Console.log mostra o JSON formatado para debug
- Comentários adicionados explicando o fluxo com a API

## O que acontece ao clicar em "Criar MDF-e"?

1. **Validação**: Sistema valida todos os campos obrigatórios
2. **Geração do JSON**: Cria JSON estruturado no padrão SEFAZ
3. **Console**: Exibe o JSON no console (para debug)
4. **Callback**: Chama `onSave()` com os dados completos

## Estrutura do JSON Enviado

```json
{
  "mdfeJSON": {
    "ide": { ... },      // Identificação do MDF-e
    "emit": { ... },     // Dados do emitente
    "infModal": { ... }, // Informações do transporte
    "infDoc": { ... },   // Notas fiscais
    "seg": [ ... ],      // Seguros
    "tot": { ... },      // Totalizadores
    "autXML": [ ... ],   // Autorizados
    "infAdic": { ... }   // Info adicionais
  },
  "status": "gerado",
  "dataGeracao": "2025-11-12T14:30:00.000Z",
  // ... todos os outros campos do formulário
}
```

## Para o Desenvolvedor da API

### O que a API deve fazer:

1. **Receber**: JSON estruturado no padrão SEFAZ (campo `mdfeJSON`)
2. **Processar**:
   - Validar dados
   - Buscar códigos de município na tabela IBGE
   - Calcular dígito verificador correto
   - Converter JSON → XML (schema SEFAZ)
   - Assinar digitalmente com certificado A1/A3
3. **Enviar**: Transmitir para Web Service da SEFAZ
4. **Retornar**: Status, protocolo, chave de acesso

### Documentação Disponível

- **`docs/mdfe-json-format.md`** - Documentação completa do formato JSON
- **`docs/exemplo-json-enviado.json`** - Exemplo real do JSON gerado

### Endpoints Sugeridos

```
POST /api/mdfe/criar
Body: { mdfeJSON: {...} }

GET /api/mdfe/:id

POST /api/mdfe/:id/cancelar

POST /api/mdfe/:id/encerrar
```

## Campos Importantes

### Códigos que precisam de atenção:

1. **cMun** (Código do Município): Atualmente retorna `9999999` (genérico)
   - API deve ter tabela IBGE completa
   
2. **cMDF** (Código de Controle): Gerado aleatoriamente
   - API pode recalcular se necessário
   
3. **cDV** (Dígito Verificador): Atualmente retorna `0`
   - API **DEVE** calcular corretamente

4. **tpAmb**: Atualmente fixo em `2` (Homologação)
   - Alterar para `1` em produção

## Ambiente de Testes

O sistema está configurado para **Homologação** (`tpAmb: "2"`).

Para trocar para **Produção**, alterar em `mdfeValidator.ts` linha 289:
```typescript
tpAmb: "1", // 1-Produção, 2-Homologação
```

## Validações Implementadas

O sistema valida:
- ✅ Pelo menos 1 nota fiscal
- ✅ Veículo selecionado
- ✅ Placa válida (ABC1234 ou ABC1D23)
- ✅ RENAVAM (11 dígitos)
- ✅ Pelo menos 1 condutor
- ✅ Município de carregamento
- ✅ Município de descarregamento
- ✅ UFs de origem e destino
- ✅ Quantidade de NF-e > 0
- ✅ Valor da carga > 0
- ✅ Peso da carga > 0
- ✅ Unidade de medida (KG ou TON)
- ✅ Categoria veicular (para rodoviário)

## Testes Recomendados

1. Preencher formulário completo
2. Clicar em "Validar" → Verificar se passa
3. Clicar em "Criar MDF-e"
4. Verificar console do navegador (F12)
5. Copiar JSON gerado
6. Enviar para API em desenvolvimento

## Próximos Passos

### Frontend (Já implementado ✅)
- [x] Gerar JSON estruturado
- [x] Validar campos obrigatórios
- [x] Incluir todas as seções necessárias

### API (A fazer)
- [ ] Criar endpoint POST /api/mdfe/criar
- [ ] Implementar conversão JSON → XML
- [ ] Integrar certificado digital
- [ ] Conectar com Web Service SEFAZ
- [ ] Implementar tratamento de retorno
- [ ] Criar endpoints auxiliares (consulta, cancelamento, encerramento)

## Contato para Dúvidas

Consultar:
- Manual MDF-e: http://www.mdfe.fazenda.gov.br/
- Schema XML: http://www.portalfiscal.inf.br/mdfe
- Documentação: `docs/mdfe-json-format.md`

