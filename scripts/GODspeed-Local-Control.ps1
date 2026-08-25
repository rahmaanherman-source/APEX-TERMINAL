# GODspeed Local Control — one-file Windows control and security audit
# Run in an elevated PowerShell window. Read-only by default; use -ResetDesktop for cleanup.
[CmdletBinding(SupportsShouldProcess)]
param(
  [switch]$ResetDesktop,
  [switch]$RunDefenderQuickScan,
  [string]$OutputPath = "$env:USERPROFILE\Desktop\GODspeed-local-report.json"
)

$ErrorActionPreference = 'SilentlyContinue'
$started = Get-Date
$findings = [System.Collections.Generic.List[object]]::new()
function Add-Finding($Area, $Status, $Detail) { $findings.Add([pscustomobject]@{ Area=$Area; Status=$Status; Detail=$Detail }) }
function Has-Command($Name) { return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

Write-Host 'GODSPEED LOCAL CONTROL' -ForegroundColor Cyan
Write-Host 'Read-only security, health, runtime, and remote-control readiness pass' -ForegroundColor DarkCyan

# Security posture and malware evidence
if (Has-Command Get-MpComputerStatus) {
  $defender = Get-MpComputerStatus
  Add-Finding 'Defender' ($(if ($defender.RealTimeProtectionEnabled -and $defender.AntivirusEnabled) {'PASS'} else {'WARN'})) "Realtime=$($defender.RealTimeProtectionEnabled); Antivirus=$($defender.AntivirusEnabled); Signatures=$($defender.AntivirusSignatureVersion)"
  if ($RunDefenderQuickScan -and $PSCmdlet.ShouldProcess('Windows Defender','Run quick scan')) { Start-MpScan -ScanType QuickScan }
  $threats = Get-MpThreatDetection
  Add-Finding 'Malware findings' ($(if ($threats) {'WARN'} else {'PASS'})) "Detected records: $(@($threats).Count)"
} else { Add-Finding 'Defender' 'UNKNOWN' 'Windows Defender cmdlets unavailable' }

$firewall = Get-NetFirewallProfile
Add-Finding 'Firewall' ($(if ($firewall.Enabled -notcontains $false) {'PASS'} else {'WARN'})) (($firewall | ForEach-Object { "$($_.Name)=$($_.Enabled)" }) -join '; ')
$policy = Get-ExecutionPolicy -List | Out-String
Add-Finding 'PowerShell policy' 'INFO' ($policy.Trim())

# Unknown/suspicious surface inventory (reports only; does not kill processes)
$startup = Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location, User
$ports = Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess
$processes = Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 Name, Id, CPU, WorkingSet64, Path
$tasks = Get-ScheduledTask | Where-Object {$_.State -eq 'Ready'} | Select-Object -First 200 TaskName, TaskPath, State
$programs = Get-ItemProperty 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*','HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*' | Where-Object DisplayName | Select-Object DisplayName, DisplayVersion, Publisher
Add-Finding 'Startup inventory' 'INFO' "$(@($startup).Count) startup entries recorded"
Add-Finding 'Listening ports' 'INFO' "$(@($ports).Count) listening sockets recorded"
Add-Finding 'Scheduled tasks' 'INFO' "$(@($tasks).Count) ready tasks recorded"

# Host health and developer/runtime readiness
$os = Get-CimInstance Win32_OperatingSystem
$cpu = Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average
$disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
Add-Finding 'System health' 'INFO' "CPU=$([math]::Round($cpu.Average,1))%; RAMFreeGB=$([math]::Round($os.FreePhysicalMemory/1MB,1)); DiskFreeGB=$([math]::Round($disk.FreeSpace/1GB,1))"
foreach ($tool in @('git','node','npm','python','docker','ollama','tailscale')) { Add-Finding "Runtime $tool" ($(if (Has-Command $tool) {'PASS'} else {'NOT_INSTALLED'})) $(if (Has-Command $tool) {(Get-Command $tool).Source} else {'not found on PATH'})" }
if (Has-Command ollama) { $models = (& ollama list 2>$null | Out-String).Trim(); Add-Finding 'Local AI models' 'INFO' $(if ($models) {$models} else {'Ollama installed; no model inventory returned'}) }
if (Has-Command tailscale) { Add-Finding 'Private phone path' 'INFO' ((& tailscale status 2>$null | Out-String).Trim()) } else { Add-Finding 'Private phone path' 'NOT_INSTALLED' 'Install and authenticate Tailscale separately; this script never opens a public admin port.' }

# Optional, explicit desktop cleanup. Security controls are never disabled.
if ($ResetDesktop) {
  foreach ($name in @('Teams','ms-teams','Discord','Spotify','Slack','Steam','EpicGamesLauncher','Zoom')) { Get-Process -Name $name | Stop-Process -Force }
  if ($PSCmdlet.ShouldProcess('User TEMP','Remove temporary files')) { Remove-Item "$env:TEMP\*" -Recurse -Force }
  ipconfig /flushdns | Out-Null
  if ($PSCmdlet.ShouldProcess('Explorer','Restart')) { Stop-Process -Name explorer -Force; Start-Process explorer.exe }
  Add-Finding 'Desktop reset' 'PASS' 'Selected user apps stopped, TEMP cleaned, DNS flushed, Explorer restarted'
}

$report = [pscustomobject]@{ Tool='GODspeed Local Control'; StartedAt=$started.ToUniversalTime().ToString('o'); CompletedAt=(Get-Date).ToUniversalTime().ToString('o'); Computer=$env:COMPUTERNAME; Findings=$findings; Startup=$startup; ListeningPorts=$ports; TopProcesses=$processes; ScheduledTasks=$tasks; InstalledPrograms=$programs }
$report | ConvertTo-Json -Depth 6 | Set-Content -Path $OutputPath -Encoding UTF8
$findings | Format-Table -AutoSize
Write-Host "Report written to $OutputPath" -ForegroundColor Green
Write-Host 'No security control was disabled. Review WARN/UNKNOWN findings before remote access.' -ForegroundColor Yellow
Write-Host 'GODSPEED.' -ForegroundColor Cyan
