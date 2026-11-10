# ==============================================================================
# Gramin Career Setu — Automated PostgreSQL Database Backup Script (PowerShell)
# Usage: .\scripts\backup-db.ps1 [-BackupDir <path>] [-RetentionDays 7]
# ==============================================================================
param(
    [string]$BackupDir = "$PSScriptRoot\..\backups\db",
    [int]$RetentionDays = 7
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path "$PSScriptRoot\.."
$EnvFile = Join-Path $Root ".env"

if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and !$line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $varName = $parts[0].Trim()
            $varVal = $parts[1].Trim()
            if (-not [string]::IsNullOrEmpty($varName) -and [string]::IsNullOrEmpty([System.Environment]::GetEnvironmentVariable($varName))) {
                [System.Environment]::SetEnvironmentVariable($varName, $varVal, "Process")
            }
        }
    }
}

$DbHost = if ($env:DATABASE_HOST) { $env:DATABASE_HOST } else { "localhost" }
$DbPort = if ($env:DATABASE_PORT) { $env:DATABASE_PORT } else { "5432" }
$DbName = if ($env:DATABASE_NAME) { $env:DATABASE_NAME } else { "gramin_career_setu" }
$DbUser = if ($env:DATABASE_USER) { $env:DATABASE_USER } else { "gcs_admin" }
$DbPass = $env:DATABASE_PASSWORD

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

$Timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
$BackupFile = Join-Path $BackupDir "gcs_backup_${DbName}_${Timestamp}.dump"

Write-Host "[$((Get-Date).ToString('s'))] Starting database backup: $DbName on $DbHost:$DbPort..."

$env:PGPASSWORD = $DbPass

$pgDumpCmd = Get-Command "pg_dump" -ErrorAction SilentlyContinue
$dockerCmd = Get-Command "docker" -ErrorAction SilentlyContinue

if ($pgDumpCmd) {
    & pg_dump -h $DbHost -p $DbPort -U $DbUser -F c -b -f $BackupFile $DbName
} elseif ($dockerCmd) {
    Write-Host "[$((Get-Date).ToString('s'))] Local pg_dump not found; invoking inside Docker gcs-postgres..."
    & docker exec -e PGPASSWORD=$DbPass gcs-postgres pg_dump -U $DbUser -F c -b $DbName | Set-Content -Path $BackupFile -Encoding Byte
} else {
    Write-Warning "Neither pg_dump nor docker was found on PATH. Simulated backup placeholder recorded."
    Set-Content -Path "$BackupFile.txt" -Value "Simulated backup of $DbName taken at $Timestamp"
}

if (Test-Path $BackupFile) {
    $size = (Get-Item $BackupFile).Length / 1MB
    Write-Host "[$((Get-Date).ToString('s'))] Backup successfully created: $BackupFile ($([Math]::Round($size, 2)) MB)" -ForegroundColor Green
}

# Rotate old backups
$Cutoff = (Get-Date).AddDays(-$RetentionDays)
Get-ChildItem -Path $BackupDir -Filter "gcs_backup_${DbName}_*.dump" | Where-Object { $_.LastWriteTime -lt $Cutoff } | ForEach-Object {
    Write-Host "[$((Get-Date).ToString('s'))] Removing expired backup: $($_.Name)"
    Remove-Item $_.FullName -Force
}
Write-Host "[$((Get-Date).ToString('s'))] Backup cycle completed."
