# Correção de Erros de Validação - MDF-e

## Problema Encontrado

```
TypeError: Cannot read properties of undefined (reading 'replace')
at formatCNPJ (mdfeValidator.ts:417:15)
```

### Causa
O erro ocorria quando campos opcionais (CPF, CNPJ, etc.) estavam `undefined` ou `null` e o código tentava chamar `.replace()` diretamente.

---

## Correções Implementadas

### 1. Funções de Formatação Seguras

#### ✅ formatCNPJ
```typescript
// ❌ Antes (causava erro)
function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

// ✅ Depois (seguro)
function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  return cnpj.replace(/\D/g, '');
}
```

#### ✅ formatCEP
```typescript
// ❌ Antes (causava erro)
function formatCEP(cep: string): string {
  return cep.replace(/\D/g, '');
}

// ✅ Depois (seguro)
function formatCEP(cep: string): string {
  if (!cep) return '';
  return cep.replace(/\D/g, '');
}
```

---

### 2. Filtros em Arrays

Adicionados filtros `.filter()` antes de `.map()` para garantir que apenas itens válidos sejam processados.

#### ✅ Condutores
```typescript
// ✅ Agora valida antes de processar
if (formData.condutoresSelecionados && formData.condutoresSelecionados.length > 0) {
  veicTracao.condutor = formData.condutoresSelecionados
    .filter((condutor: any) => condutor && condutor.nome && condutor.cpf)
    .map((condutor: any) => ({
      xNome: condutor.nome,
      CPF: formatCNPJ(condutor.cpf)
    }));
}
```

#### ✅ Lacres
```typescript
if (formData.lacreList && formData.lacreList.length > 0) {
  rodo.lacRodo = formData.lacreList
    .filter((lacre: any) => lacre && lacre.numero)
    .map((lacre: any) => ({
      nLacre: lacre.numero
    }));
}
```

#### ✅ Vale Pedágio
```typescript
if (formData.valePedagioList && formData.valePedagioList.length > 0) {
  rodo.infContratante = formData.valePedagioList
    .filter((vale: any) => vale && vale.cnpjFornecedor && vale.nomeResponsavel)
    .map((vale: any) => ({...}));
}
```

#### ✅ CIOT
```typescript
if (formData.ciotList && formData.ciotList.length > 0) {
  rodo.infCIOT = formData.ciotList
    .filter((ciot: any) => ciot && ciot.numero)
    .map((ciot: any) => ({...}));
}
```

#### ✅ Autorizados
```typescript
if (formData.autorizadoList && formData.autorizadoList.length > 0) {
  mdfeJSON.autXML = formData.autorizadoList
    .filter((autorizado: any) => autorizado && autorizado.cpfCnpj)
    .map((autorizado: any) => ({
      CNPJ: formatCNPJ(autorizado.cpfCnpj)
    }));
}
```

#### ✅ Notas Fiscais
```typescript
infNFe: notasPorMunicipio[municipio]
  .filter((nf: any) => nf && nf.chave)
  .map((nf: any) => ({
    chNFe: nf.chave,
    indReentrega: "0"
  }))
```

#### ✅ Averbações de Seguro
```typescript
// Adiciona averbações apenas se houver
if (formData.averbacaoList && formData.averbacaoList.length > 0) {
  seg.nAver = formData.averbacaoList
    .filter((averb: any) => averb && averb.numero)
    .map((averb: any) => averb.numero);
}
```

---

## Benefícios das Correções

### ✅ Robustez
- Código não quebra com dados incompletos
- Trata `undefined`, `null` e valores vazios

### ✅ Validação Automática
- Filtra automaticamente itens inválidos
- Apenas dados válidos são processados

### ✅ JSON Limpo
- Não inclui campos vazios no JSON final
- Conforme padrão SEFAZ

### ✅ Melhor Experiência do Usuário
- Não trava a aplicação
- Permite salvar mesmo com dados parciais

---

## Cenários Tratados

### 1. Campos Vazios
```typescript
// ✅ Não causa erro
formatCNPJ('')       // Retorna ''
formatCNPJ(null)     // Retorna ''
formatCNPJ(undefined) // Retorna ''
```

### 2. Arrays com Itens Inválidos
```typescript
// ✅ Filtra automaticamente
condutores = [
  { nome: 'João', cpf: '123' },  // ✅ Incluído
  { nome: '', cpf: '' },          // ❌ Filtrado
  null,                           // ❌ Filtrado
  { nome: 'Maria', cpf: '456' }   // ✅ Incluído
]
```

### 3. Listas Vazias
```typescript
// ✅ Não adiciona ao JSON
lacreList = []        // Campo lacRodo não aparece no JSON
autorizadoList = []   // Campo autXML não aparece no JSON
```

---

## Testes Recomendados

### Teste 1: Formulário Mínimo
- Preencher apenas campos obrigatórios
- ✅ Deve gerar JSON sem erros

### Teste 2: Formulário Parcial
- Preencher alguns campos opcionais
- Deixar outros vazios
- ✅ Deve gerar JSON apenas com campos preenchidos

### Teste 3: Listas com Dados Parciais
- Adicionar condutores, mas deixar alguns campos vazios
- ✅ Deve incluir apenas condutores válidos

### Teste 4: Listas Vazias
- Não adicionar lacres, autorizados, etc.
- ✅ Não deve incluir esses campos no JSON

---

## Como Verificar

1. **Abrir Console do Navegador** (F12)
2. **Preencher formulário MDF-e** (mínimo necessário)
3. **Clicar em "Criar MDF-e"**
4. **Verificar JSON no console**

✅ **Não deve haver erros**  
✅ **JSON deve estar limpo**  
✅ **Apenas campos preenchidos devem aparecer**

---

## Resumo das Melhorias

| Antes | Depois |
|-------|--------|
| ❌ Errava com campos vazios | ✅ Trata campos vazios |
| ❌ Incluía dados inválidos | ✅ Filtra dados inválidos |
| ❌ JSON com campos vazios | ✅ JSON limpo |
| ❌ Aplicação travava | ✅ Aplicação robusta |

---

## Próximos Passos

Se ainda encontrar erros:

1. **Verificar console** do navegador (F12)
2. **Copiar mensagem de erro** completa
3. **Identificar campo** que está causando problema
4. **Adicionar validação** similar às implementadas

---

**Última atualização:** 12/11/2025

**Status:** ✅ Corrigido

