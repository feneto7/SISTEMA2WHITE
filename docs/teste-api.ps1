# Script de teste para API MDF-e (PowerShell)
# Use este script para testar o endpoint da API no Windows

# Configuração
$API_URL = "http://localhost:3000/api/mdfe/criar"
$JSON_FILE = "exemplo-json-enviado.json"

Write-Host "======================================"
Write-Host "Teste da API MDF-e"
Write-Host "======================================"
Write-Host ""

# Verifica se o arquivo JSON existe
if (-Not (Test-Path $JSON_FILE)) {
    Write-Host "❌ Erro: Arquivo $JSON_FILE não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script na pasta docs/"
    exit 1
}

Write-Host "📋 Enviando JSON para API..."
Write-Host "URL: $API_URL"
Write-Host ""

try {
    # Lê o conteúdo do JSON
    $jsonContent = Get-Content $JSON_FILE -Raw
    
    # Faz a requisição POST
    $response = Invoke-RestMethod -Uri $API_URL `
        -Method Post `
        -ContentType "application/json" `
        -Body $jsonContent
    
    Write-Host "======================================"
    Write-Host "Resposta da API:"
    Write-Host "======================================"
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    
    if ($response.success -eq $true) {
        Write-Host "✅ Sucesso! MDF-e criado." -ForegroundColor Green
        Write-Host "Protocolo: $($response.data.protocolo)"
        Write-Host "Chave: $($response.data.chave)"
        Write-Host "Status: $($response.data.status)"
    } else {
        Write-Host "⚠️  Aviso: Resposta recebida mas sem sucesso." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "======================================"
    Write-Host "Resposta de Erro:"
    Write-Host "======================================"
    Write-Host "❌ Erro na requisição:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "======================================"
Write-Host "Fim do teste"
Write-Host "======================================"

# Pausa para visualizar resultado
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

