#!/bin/bash
# Script de teste para API MDF-e
# Use este script para testar o endpoint da API

# Configuração
API_URL="http://localhost:3000/api/mdfe/criar"
JSON_FILE="exemplo-json-enviado.json"

echo "======================================"
echo "Teste da API MDF-e"
echo "======================================"
echo ""

# Verifica se o arquivo JSON existe
if [ ! -f "$JSON_FILE" ]; then
    echo "❌ Erro: Arquivo $JSON_FILE não encontrado!"
    echo "Execute este script na pasta docs/"
    exit 1
fi

echo "📋 Enviando JSON para API..."
echo "URL: $API_URL"
echo ""

# Faz a requisição POST
response=$(curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d @"$JSON_FILE" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s)

echo "======================================"
echo "Resposta da API:"
echo "======================================"
echo "$response"
echo ""

# Verifica o status code
status_code=$(echo "$response" | grep "HTTP Status" | cut -d' ' -f3)

if [ "$status_code" = "200" ] || [ "$status_code" = "201" ]; then
    echo "✅ Sucesso! MDF-e criado."
else
    echo "❌ Erro: Status $status_code"
fi

echo ""
echo "======================================"
echo "Fim do teste"
echo "======================================"

