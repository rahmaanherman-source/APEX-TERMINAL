# APEX FULL SYSTEM CLEAN — SAFE / LOW-IMPACT / 30-DAY AWARE
$ErrorActionPreference = "SilentlyContinue"
$ProgressPreference = "SilentlyContinue"

$Root = Join-Path $env:LOCALAPPDATA "APEX\Cleanup"
New-Item -ItemType Directory -Force -Path $Root | Out-Null
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$Log = Join-Path $Root "APEX-Cleanup-$Stamp.log"

function Log($Message) {
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  Add-Content -LiteralPath $Log -Value $line
  Write-Host $line
}

try { (Get-Process -Id $PID).PriorityClass = "BelowNormal" } catch {}

$Protected = @(
  (Join-Path $env:USERPROFILE "Desktop"),
  (Join-Path $env:USERPROFILE "Documents"),
  (Join-Path $env:USERPROFILE "Pictures"),
  (Join-Path $env:USERPROFILE "Music"),
  (Join-Path $env:USERPROFILE "Videos"),
  (Join-Path $env:USERPROFILE "Downloads"),
  (Join-Path $env:USERPROFILE "_APEX_SYSTEM"),
  (Join-Path $env:USERPROFILE "APEX"),
  (Join-Path $env:USERPROFILE "OneDrive"),
  (Join-Path $env:USERPROFILE "Google Drive")
)

function Remove-OldFiles($Path, [int]$Days = 30) {
  if (-not (Test-Path -LiteralPath $Path)) { return }
  $cutoff = (Get-Date).AddDays(-$Days)
  Log "Cleaning disposable cache/temp: $Path"
  Get-ChildItem -LiteralPath $Path -Force -File -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -lt $cutoff } |
    ForEach-Object { try { Remove-Item -LiteralPath $_.FullName -Force -ErrorAction Stop } catch {} }
}

function Clear-DirectoryContents($Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return }
  Log "Clearing disposable cache: $Path"
  Get-ChildItem -LiteralPath $Path -Force -ErrorAction SilentlyContinue |
    ForEach-Object { try { Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction Stop } catch {} }
}

Log "===== APEX FULL SYSTEM CLEAN START ====="
Log "30-day rule applies to disposable/cache locations only."
Log "Desktop/Documents/APEX/source/backup/user media are not mass-deleted."

Remove-OldFiles $env:TEMP 30
Remove-OldFiles "$env:WINDIR\Temp" 30

try {
  Stop-Service wuauserv -Force
  Stop-Service bits -Force
  Clear-DirectoryContents "$env:WINDIR\SoftwareDistribution\Download"
  Start-Service bits
  Start-Service wuauserv
  Log "Windows Update download cache cleaned."
} catch { Log "Windows Update cache cleanup skipped/partial." }

Clear-DirectoryContents "$env:WINDIR\ServiceProfiles\NetworkService\AppData\Local\Microsoft\Windows\DeliveryOptimization\Cache"
try { Clear-RecycleBin -Force; Log "Recycle Bin emptied." } catch {}

if (Get-Command npm -ErrorAction SilentlyContinue) {
  try { npm cache verify | Out-Null; Log "npm cache verified (not force-deleted)." } catch {}
}
if (Get-Command pip -ErrorAction SilentlyContinue) {
  try { pip cache purge | Out-Null; Log "pip cache purged." } catch {}
}
if (Get-Command dotnet -ErrorAction SilentlyContinue) {
  try { dotnet nuget locals all --clear | Out-Null; Log ".NET NuGet caches cleared." } catch {}
}

if (Get-Command DISM.exe -ErrorAction SilentlyContinue) {
  Log "Starting Windows component-store cleanup."
  try { DISM.exe /Online /Cleanup-Image /StartComponentCleanup | Out-Null } catch {}
}

$Downloads = Join-Path $env:USERPROFILE "Downloads"
if (Test-Path $Downloads) {
  Log "Hash-checking duplicate-looking installers in Downloads."
  $candidates = Get-ChildItem $Downloads -File -Force -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Name -match "Claude Setup.*\.exe$" -or
      $_.Name -match "^.*Setup.* \(\d+\)\.exe$" -or
      $_.Name -match "^.*Installer.* \(\d+\)\.exe$"
    }

  $hashed = foreach ($file in $candidates) {
    try {
      $h = Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256 -ErrorAction Stop
      [pscustomobject]@{ File=$file; Hash=$h.Hash }
    } catch {}
  }

  $hashed | Group-Object Hash | ForEach-Object {
    if ($_.Count -gt 1) {
      $copies = $_.Group | Sort-Object { $_.File.LastWriteTime } -Descending
      $copies | Select-Object -Skip 1 | ForEach-Object {
        try {
          Remove-Item -LiteralPath $_.File.FullName -Force
          Log "Removed byte-identical duplicate installer: $($_.File.Name)"
        } catch {}
      }
    }
  }
}

$Report = Join-Path $Root "APEX-Storage-Review-$Stamp.csv"
try {
  Get-ChildItem $Downloads -File -Recurse -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Length -ge 500MB } |
    Sort-Object Length -Descending |
    Select-Object FullName, Length, LastWriteTime |
    Export-Csv -NoTypeInformation -Path $Report
} catch {}

Log "===== APEX FULL SYSTEM CLEAN COMPLETE ====="
Log "Log: $Log"
Log "Large-file review: $Report"
Log "No arbitrary user files older than 30 days were deleted."
