# Tratamento de Campos Opcionais no MDF-e

## Regra Geral

✅ **Apenas campos preenchidos pelo usuário são incluídos no JSON**

❌ Campos vazios, strings vazias `""` ou arrays vazios `[]` **NÃO são enviados** para a API

## Como Funciona

### Campos Obrigatórios
Sempre são enviados, independente de estarem preenchidos ou não:
- `ide`: Identificação do MDF-e
- `emit`: Dados do emitente
- `infModal`: Informações do modal de transporte
- `infDoc`: Documentos fiscais
- `tot`: Totalizadores

### Campos Opcionais (Condicionais)

#### 1. **Inscrição Estadual (IE)**
```javascript
// Só inclui se preenchido
if (formData.ie) {
  emit.IE = formData.ie;
}
```

**Resultado:**
- ✅ Se preenchido: `"IE": "123456789"`
- ❌ Se vazio: campo não aparece no JSON

---

#### 2. **Percurso (UFs)**
```javascript
// Só inclui se houver UFs selecionadas
if (formData.ufsPercurso && formData.ufsPercurso.length > 0) {
  ide.infPercurso = formData.ufsPercurso.map(...);
}
```

**Resultado:**
- ✅ Se houver: `"infPercurso": [{"UFPer": "MG"}, {"UFPer": "SP"}]`
- ❌ Se vazio: campo não aparece no JSON

---

#### 3. **Seguro (seg)**
```javascript
// Só inclui se checkbox "Exibir dados de seguro" estiver marcado
if (formData.exibirDadosSeguro && formData.nomeSeguradora) {
  mdfeJSON.seg = [...];
}
```

**Resultado:**
- ✅ Se marcado e preenchido: `"seg": [{ ... }]`
- ❌ Se não marcado: campo não aparece no JSON

---

#### 4. **Autorizados (autXML)**
```javascript
// Só inclui se houver pessoas autorizadas adicionadas
if (formData.autorizadoList && formData.autorizadoList.length > 0) {
  mdfeJSON.autXML = formData.autorizadoList.map(...);
}
```

**Resultado:**
- ✅ Se houver: `"autXML": [{"CNPJ": "12345678000190"}]`
- ❌ Se vazio: campo não aparece no JSON

---

#### 5. **Observações (infAdic)**
```javascript
// Só inclui se houver texto nas observações
if (formData.observacoes && formData.observacoes.trim() !== "") {
  mdfeJSON.infAdic = { infCpl: formData.observacoes };
}
```

**Resultado:**
- ✅ Se preenchido: `"infAdic": {"infCpl": "Transporte urgente"}`
- ❌ Se vazio: campo não aparece no JSON

---

#### 6. **Lacres (lacRodo)**
```javascript
// Só inclui se houver lacres adicionados
if (formData.lacreList && formData.lacreList.length > 0) {
  rodo.lacRodo = formData.lacreList.map(...);
}
```

**Resultado:**
- ✅ Se houver: `"lacRodo": [{"nLacre": "LAC001"}]`
- ❌ Se vazio: campo não aparece no JSON

---

#### 7. **Vale Pedágio (infContratante)**
```javascript
// Só inclui se houver vale pedágio adicionado
if (formData.valePedagioList && formData.valePedagioList.length > 0) {
  rodo.infContratante = formData.valePedagioList.map(...);
}
```

**Resultado:**
- ✅ Se houver: `"infContratante": [{ ... }]`
- ❌ Se vazio: campo não aparece no JSON

---

#### 8. **CIOT (infCIOT)**
```javascript
// Só inclui se houver CIOT adicionado
if (formData.ciotList && formData.ciotList.length > 0) {
  rodo.infCIOT = formData.ciotList.map(...);
}
```

**Resultado:**
- ✅ Se houver: `"infCIOT": [{"CIOT": "123456789012"}]`
- ❌ Se vazio: campo não aparece no JSON

---

#### 9. **Proprietário do Veículo (prop)**
```javascript
// Só inclui se checkbox "Proprietário não é o emitente" estiver marcado
if (formData.proprietarioNaoEmitente && formData.proprietario) {
  veicTracao.prop = { ... };
}
```

**Resultado:**
- ✅ Se marcado: `"prop": {"CNPJ": "...", "xNome": "...", ...}`
- ❌ Se não marcado: campo não aparece no JSON

---

#### 10. **RNTRC (infANTT)**
```javascript
// Só inclui se RNTRC foi preenchido
if (formData.rntrc) {
  rodo.infANTT = { RNTRC: formData.rntrc };
}
```

**Resultado:**
- ✅ Se preenchido: `"infANTT": {"RNTRC": "12345678"}`
- ❌ Se vazio: campo não aparece no JSON

---

#### 11. **Capacidade do Veículo (capKG)**
```javascript
// Só inclui se capacidade foi preenchida
if (formData.capacidade && formData.capacidade !== "0") {
  veicTracao.capKG = formData.capacidade;
}
```

**Resultado:**
- ✅ Se preenchido: `"capKG": "30000"`
- ❌ Se vazio ou zero: campo não aparece no JSON

---

## Exemplos Práticos

### Exemplo 1: MDF-e Mínimo (só obrigatórios)

**Campos preenchidos:**
- Documentos: 1 NF-e
- Veículo: Placa, RENAVAM
- Condutores: 1 condutor
- Rota: Origem e destino
- Totalizadores: Quantidade, valor, peso

**JSON gerado:**
```json
{
  "ide": { ... },
  "emit": { ... },
  "infModal": {
    "rodo": {
      "veicTracao": {
        "placa": "ABC1234",
        "RENAVAM": "12345678901",
        "condutor": [{ ... }]
      }
    }
  },
  "infDoc": { ... },
  "tot": { ... }
}
```

**Campos que NÃO aparecem:**
- ❌ seg (seguro)
- ❌ autXML (autorizados)
- ❌ infAdic (observações)
- ❌ lacRodo (lacres)
- ❌ infContratante (vale pedágio)
- ❌ infCIOT (CIOT)
- ❌ infANTT (RNTRC)

---

### Exemplo 2: MDF-e Completo

**Campos preenchidos:**
- Todos os obrigatórios +
- Seguro marcado e preenchido
- 2 autorizados
- Observações
- 3 lacres
- Vale pedágio
- CIOT
- RNTRC

**JSON gerado:**
```json
{
  "ide": { ... },
  "emit": { ... },
  "infModal": {
    "rodo": {
      "infANTT": {
        "RNTRC": "12345678"
      },
      "veicTracao": { ... },
      "lacRodo": [
        {"nLacre": "LAC001"},
        {"nLacre": "LAC002"},
        {"nLacre": "LAC003"}
      ],
      "infContratante": [{ ... }],
      "infCIOT": [{ ... }]
    }
  },
  "infDoc": { ... },
  "seg": [{ ... }],
  "tot": { ... },
  "autXML": [
    {"CNPJ": "12345678000190"},
    {"CNPJ": "98765432000190"}
  ],
  "infAdic": {
    "infCpl": "Transporte urgente"
  }
}
```

**Todos os campos aparecem porque foram preenchidos!**

---

## Vantagens desta Abordagem

### ✅ JSON Limpo
- Apenas dados relevantes são enviados
- Reduz tamanho do JSON
- Facilita leitura e debug

### ✅ Conformidade SEFAZ
- SEFAZ espera que campos opcionais não preenchidos sejam omitidos
- Evita erros de validação do schema XML

### ✅ Performance
- Menos dados trafegando na rede
- Processamento mais rápido na API

### ✅ Manutenibilidade
- Código mais limpo e organizado
- Fácil adicionar novos campos opcionais

---

## Para o Desenvolvedor da API

### Importante:

1. **Não assumir que todos os campos existem**
   ```javascript
   // ❌ Errado
   const ie = mdfeJSON.emit.IE; // Pode não existir!
   
   // ✅ Correto
   const ie = mdfeJSON.emit.IE || "";
   ```

2. **Verificar existência antes de usar**
   ```javascript
   // ✅ Correto
   if (mdfeJSON.seg && mdfeJSON.seg.length > 0) {
     // Processar seguro
   }
   ```

3. **Arrays podem não existir**
   ```javascript
   // ✅ Correto
   const lacres = mdfeJSON.infModal.rodo.lacRodo || [];
   ```

---

## Checklist de Campos Opcionais

### Identificação (ide)
- [x] infPercurso - Só se houver UFs no percurso

### Emitente (emit)
- [x] IE - Só se preenchido

### Modal Rodoviário (infModal.rodo)
- [x] infANTT - Só se RNTRC preenchido
- [x] capKG - Só se capacidade preenchida
- [x] prop - Só se proprietário não for emitente
- [x] lacRodo - Só se houver lacres
- [x] infContratante - Só se houver vale pedágio
- [x] infCIOT - Só se houver CIOT

### Seguro (seg)
- [x] seg - Só se checkbox marcado e dados preenchidos

### Autorizados (autXML)
- [x] autXML - Só se houver autorizados

### Informações Adicionais (infAdic)
- [x] infAdic - Só se houver observações

---

## Resumo

🎯 **Regra de ouro:** 

> Se o usuário não preencheu, não envia!

Isso garante:
- ✅ JSON limpo e enxuto
- ✅ Conformidade com SEFAZ
- ✅ Melhor performance
- ✅ Código mais manutenível

---

**Última atualização:** 12/11/2025

