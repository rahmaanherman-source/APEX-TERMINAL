# APEX Terminal Bridge — local, fail-closed command gate
$ErrorActionPreference = "Stop"
$Port = 18765
$Root = Join-Path $env:LOCALAPPDATA "APEX\TerminalBridge"
$TokenPath = Join-Path $Root "token.txt"
$LogPath = Join-Path $Root "audit.jsonl"
New-Item -ItemType Directory -Force -Path $Root | Out-Null

if (-not (Test-Path -LiteralPath $TokenPath)) {
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
  $token = [Convert]::ToBase64String($bytes)
  Set-Content -LiteralPath $TokenPath -Value $token -NoNewline
} else {
  $token = (Get-Content -LiteralPath $TokenPath -Raw).Trim()
}
# Configure an exact origin to permit a browser page or unpacked extension.
# No Origin header (local scripts) remains allowed, but still requires the token.
$AllowedOrigin = $env:APEX_BRIDGE_ALLOWED_ORIGIN
$AllowedCommands = @("Get-Date", "Get-Location", "Get-ChildItem", "Get-Process")

function Write-Audit($id, $action, $decision, $exitCode) {
  $record = @{time=[DateTime]::UtcNow.ToString("o");correlation_id=$id;action=$action;decision=$decision;exit_code=$exitCode}
  Add-Content -LiteralPath $LogPath -Value ($record | ConvertTo-Json -Compress) -Encoding UTF8
}

function Write-Json($ctx, $status, $obj) {
  $body = [Text.Encoding]::UTF8.GetBytes(($obj | ConvertTo-Json -Depth 10))
  $ctx.Response.StatusCode = $status
  $ctx.Response.ContentType = "application/json"
  $ctx.Response.Headers.Add("X-Content-Type-Options", "nosniff")
  $origin = $ctx.Request.Headers["Origin"]
  if ($origin -and $AllowedOrigin -and $origin -ceq $AllowedOrigin) {
    $ctx.Response.Headers.Add("Access-Control-Allow-Origin", $AllowedOrigin)
    $ctx.Response.Headers.Add("Vary", "Origin")
    $ctx.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, X-APEX-Token")
    $ctx.Response.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS")
  }
  if ($status -ne 204) { $ctx.Response.OutputStream.Write($body,0,$body.Length) }
  $ctx.Response.Close()
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "APEX Terminal Bridge: http://127.0.0.1:$Port/"
Write-Host "Token file: $TokenPath"
Write-Host "Safe commands: $($AllowedCommands -join ', ')"

while ($listener.IsListening) {
  $ctx = $null
  $id = [guid]::NewGuid().ToString()
  try {
    $ctx = $listener.GetContext()
    $origin = $ctx.Request.Headers["Origin"]
    if ($origin -and (-not $AllowedOrigin -or $origin -cne $AllowedOrigin)) {
      Write-Audit $id "request" "origin_denied" $null
      Write-Json $ctx 403 @{ok=$false;error="origin_denied";correlation_id=$id}
      continue
    }
    if ($ctx.Request.HttpMethod -eq "OPTIONS" -and $ctx.Request.Url.AbsolutePath -eq "/exec") {
      Write-Json $ctx 204 @{ok=$true}
      continue
    }
    if ($ctx.Request.HttpMethod -eq "GET" -and $ctx.Request.Url.AbsolutePath -eq "/health") {
      Write-Json $ctx 200 @{ok=$true;service="APEX Terminal Bridge"}
      continue
    }
    if ($ctx.Request.HttpMethod -ne "POST" -or $ctx.Request.Url.AbsolutePath -ne "/exec") {
      Write-Json $ctx 404 @{ok=$false;error="not_found";correlation_id=$id}
      continue
    }
    $provided = $ctx.Request.Headers["X-APEX-Token"]
    if ([string]::IsNullOrWhiteSpace($provided) -or $provided -cne $token) {
      Write-Audit $id "exec" "token_denied" $null
      Write-Json $ctx 401 @{ok=$false;error="unauthorized";correlation_id=$id}
      continue
    }
    if ($ctx.Request.ContentLength64 -gt 4096) {
      Write-Audit $id "exec" "request_too_large" $null
      Write-Json $ctx 413 @{ok=$false;error="request_too_large";correlation_id=$id}
      continue
    }
    $reader = [IO.StreamReader]::new($ctx.Request.InputStream)
    $raw = $reader.ReadToEnd()
    $reader.Dispose()
    if ($raw.Length -gt 4096) {
      Write-Json $ctx 413 @{ok=$false;error="request_too_large";correlation_id=$id}
      continue
    }
    $request = $raw | ConvertFrom-Json
    $command = [string]$request.command
    $mode = [string]$request.mode
    if ($AllowedCommands -cnotcontains $command -or $mode -cnotin @("terminal","exec")) {
      Write-Audit $id $command "policy_denied" $null
      Write-Json $ctx 403 @{ok=$false;error="command_not_allowed";correlation_id=$id}
      continue
    }
    # Gatekeeper decision stub: exact command policy. No Vault secret resolution occurs.
    if ($mode -eq "terminal") {
      $wt = (Get-Command wt.exe -ErrorAction SilentlyContinue).Source
      if (-not $wt) { throw "Windows Terminal not found" }
      Start-Process -FilePath $wt -ArgumentList @("--title","APEX TERMINAL","powershell.exe","-NoExit","-NoProfile","-Command",$command)
      Write-Audit $id $command "dispatched" $null
      Write-Json $ctx 200 @{ok=$true;dispatched=$true;mode="terminal";correlation_id=$id}
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
    Write-Audit $id $command "executed" $p.ExitCode
    Write-Json $ctx 200 @{ok=($p.ExitCode -eq 0);exit_code=$p.ExitCode;stdout=$stdout;stderr=$stderr;correlation_id=$id}
  } catch {
    if ($ctx) {
      Write-Audit $id "request" "failed" $null
      try { Write-Json $ctx 500 @{ok=$false;error="execution_failed";correlation_id=$id} } catch {}
    }
  }
}
