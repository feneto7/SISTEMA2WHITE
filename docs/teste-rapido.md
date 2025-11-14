# Teste Rápido - MDF-e JSON

## Como Testar

### 1. Abrir a aplicação
```bash
npm start
```

### 2. Acessar a página MDF-e

### 3. Clicar em "Nova MDF-e"

### 4. Preencher os campos mínimos obrigatórios:

#### Aba Documentos
- Adicionar pelo menos 1 nota fiscal (chave de 44 dígitos)

#### Aba Transporte
- Selecionar ou adicionar um veículo
- Preencher: Placa, RENAVAM (11 dígitos)

#### Aba Condutores
- Adicionar pelo menos 1 condutor

#### Aba Rota
- Município de carregamento
- UF de carregamento
- Município de descarregamento
- UF de descarregamento

#### Aba Frete
- Categoria veicular (para rodoviário)

#### Aba Totalizadores
- Quantidade total de NF-e (deve ser > 0)
- Valor total da carga (deve ser > 0)
- Código unidade de medida (01-KG ou 02-TON)
- Peso total da carga (deve ser > 0)

### 5. Clicar em "Validar"
- Deve aparecer: "MDF-e validado com sucesso!"

### 6. Clicar em "Criar MDF-e"

### 7. Abrir Console do Navegador (F12)
- Verificar mensagem: "MDF-e JSON gerado para envio à API:"
- Copiar o JSON completo

### 8. Verificar estrutura do JSON
O JSON deve conter:
```json
{
  "mdfeJSON": {
    "ide": { ... },
    "emit": { ... },
    "infModal": { ... },
    "infDoc": { ... },
    "seg": [ ... ],
    "tot": { ... },
    "autXML": [ ... ],
    "infAdic": { ... }
  },
  "status": "gerado",
  "dataGeracao": "2025-11-12T...",
  ...
}
```

## Resultado Esperado

✅ JSON completo e estruturado
✅ Todas as seções presentes (ide, emit, infModal, infDoc, seg, tot, autXML, infAdic)
✅ Campos formatados corretamente (CNPJ sem máscara, valores com 2 casas decimais)
✅ Status = "gerado"
✅ Data de geração preenchida

## Exemplo de Chave NF-e para Teste
```
35200112345678000190550010000000011234567890
```
(44 dígitos)

## Se aparecer erro de validação

Verificar mensagem do erro e preencher o campo indicado.

## Para enviar à API

1. Copiar o JSON do console
2. Fazer POST para `http://localhost:3000/api/mdfe/criar`
3. Body: o JSON copiado
4. Aguardar resposta da API

## Troubleshooting

### "Pelo menos uma nota fiscal deve ser adicionada"
→ Adicionar uma NF-e na aba Documentos

### "Placa do veículo é obrigatória"
→ Preencher campo de placa no formato ABC1234 ou ABC1D23

### "Pelo menos um condutor deve ser adicionado"
→ Adicionar um condutor na aba Condutores

### "Valor total da carga é obrigatório"
→ Preencher valor na aba Totalizadores

