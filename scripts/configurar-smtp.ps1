# Configura el correo propio (SMTP de Hostinger) en el proyecto de Supabase de Protop y sube el límite de envíos.
# La contraseña del buzón se pide al ejecutarlo (no se ve al escribir) y va directa a Supabase: no se guarda en ningún sitio.
# Uso, desde PowerShell:  & "D:\Mis Desarrollos\Protop\protop-web\scripts\configurar-smtp.ps1"

$ErrorActionPreference = 'Stop'
$proyecto = 'uofnwnxpxsicotsxqgfu'
$remitente = 'contacto@protop.es'
$archivoToken = Join-Path $HOME '.supabase-cuentas\protop.token'

if (-not (Test-Path $archivoToken)) {
  throw "No encuentro el token de Protop en $archivoToken. Guárdalo con guardar-token.ps1 protop."
}

function ATexto([securestring]$seguro) {
  $puntero = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($seguro)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($puntero) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($puntero) }
}

$token = ATexto (Get-Content $archivoToken | ConvertTo-SecureString)
$contrasena = ATexto (Read-Host "Contraseña del buzón $remitente" -AsSecureString)
if (-not $contrasena) { throw 'No has escrito ninguna contraseña.' }

$cuerpo = @{
  smtp_admin_email       = $remitente
  smtp_sender_name       = 'Protop'
  smtp_host              = 'smtp.hostinger.com'
  smtp_port              = '465'
  smtp_user              = $remitente
  smtp_pass              = $contrasena
  # Con SMTP propio ya no hace falta el tope de 2 correos por hora del correo de Supabase.
  rate_limit_email_sent  = 30
} | ConvertTo-Json

try {
  $respuesta = Invoke-RestMethod -Method Patch `
    -Uri "https://api.supabase.com/v1/projects/$proyecto/config/auth" `
    -Headers @{ Authorization = "Bearer $token" } `
    -ContentType 'application/json; charset=utf-8' `
    -Body ([Text.Encoding]::UTF8.GetBytes($cuerpo))
} finally {
  $contrasena = $null
  $token = $null
}

Write-Host ''
Write-Host 'SMTP configurado en Supabase:' -ForegroundColor Green
Write-Host "  Remitente: $($respuesta.smtp_sender_name) <$($respuesta.smtp_admin_email)>"
Write-Host "  Servidor:  $($respuesta.smtp_host):$($respuesta.smtp_port)"
Write-Host "  Límite:    $($respuesta.rate_limit_email_sent) correos por hora"
