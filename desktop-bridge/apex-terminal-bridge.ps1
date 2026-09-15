# APEX TERMINAL BRIDGE — LOCALHOST COMMAND GATE
$ErrorActionPreference = "Stop"
$Port = 18765
$Root = Join-Path $env:LOCALAPPDATA "APEX\TerminalBridge"
$TokenPath = Join-Path $Root "token.txt"
New-Item -ItemType Directory -Force -Path $Root | Out-Null

if (-not (Test-Path $TokenPath)) {
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
  $token = [Convert]::ToBase64String($bytes)
  Set-Content -LiteralPath $TokenPath -Value $token -NoNewline
} else {
  $token = (Get-Content -LiteralPath $TokenPath -Raw).Trim()
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()

function Write-Json($ctx, $status, $obj) {
  $body = [Text.Encoding]::UTF8.GetBytes(($obj | ConvertTo-Json -Depth 10))
  $ctx.Response.StatusCode = $status
  $ctx.Response.ContentType = "application/json"
  $ctx.Response.Headers.Add("Access-Control-Allow-Origin","*")
  $ctx.Response.Headers.Add("Access-Control-Allow-Headers","Content-Type, X-APEX-Token")
  $ctx.Response.Headers.Add("Access-Control-Allow-Methods","GET,POST,OPTIONS")
  $ctx.Response.OutputStream.Write($body,0,$body.Length)
  $ctx.Response.Close()
}

Write-Host "APEX Terminal Bridge: http://127.0.0.1:$Port/"
Write-Host "Token file: $TokenPath"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()

    if ($ctx.Request.HttpMethod -eq "OPTIONS") {
      Write-Json $ctx 204 @{ok=$true}
      continue
    }

    if ($ctx.Request.HttpMethod -eq "GET" -and $ctx.Request.Url.AbsolutePath -eq "/health") {
      Write-Json $ctx 200 @{ok=$true;service="APEX Terminal Bridge";port=$Port}
      continue
    }

    $provided = $ctx.Request.Headers["X-APEX-Token"]
    if ([string]::IsNullOrWhiteSpace($provided) -or $provided -ne $token) {
      Write-Json $ctx 401 @{ok=$false;error="unauthorized"}
      continue
    }

    if ($ctx.Request.HttpMethod -ne "POST" -or $ctx.Request.Url.AbsolutePath -ne "/exec") {
      Write-Json $ctx 404 @{ok=$false;error="not_found"}
      continue
    }

    $reader = [IO.StreamReader]::new($ctx.Request.InputStream)
    $request = ($reader.ReadToEnd() | ConvertFrom-Json)
    $reader.Dispose()

    $command = [string]$request.command
    $mode = if ($request.mode) {[string]$request.mode} else {"terminal"}

    if ([string]::IsNullOrWhiteSpace($command)) {
      Write-Json $ctx 400 @{ok=$false;error="command_required"}
      continue
    }

    if ($mode -eq "terminal") {
      $wt = (Get-Command wt.exe -ErrorAction SilentlyContinue).Source
      if (-not $wt) {$wt = "wt.exe"}
      Start-Process -FilePath $wt -ArgumentList @("--title","APEX TERMINAL","powershell.exe","-NoExit","-Command",$command)
      Write-Json $ctx 200 @{ok=$true;dispatched=$true;mode="terminal"}
      continue
    }

    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($command))
    $psi = [Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = "powershell.exe"
    $psi.Arguments = "-NoProfile -NonInteractive -EncodedCommand $encoded"
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true
    $p = [Diagnostics.Process]::Start($psi)
    $stdout = $p.StandardOutput.ReadToEnd()
    $stderr = $p.StandardError.ReadToEnd()
    $p.WaitForExit()

    Write-Json $ctx 200 @{ok=($p.ExitCode -eq 0);exit_code=$p.ExitCode;stdout=$stdout;stderr=$stderr}
  } catch {
    try { Write-Json $ctx 500 @{ok=$false;error=$_.Exception.Message} } catch {}
  }
}
