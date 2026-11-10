# ==============================================================================
# Gramin Career Setu — Automated PostgreSQL Database Restore Script (PowerShell)
# Usage: .\scripts\restore-db.ps1 -BackupFile <path> [-TargetDb <name>]
# ==============================================================================
param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$TargetDb = ""
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupFile)) {
    Write-Error "Backup file does not exist: $BackupFile"
    exit 1
}

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
$DbName = if ($TargetDb) { $TargetDb } elseif ($env:DATABASE_NAME) { $env:DATABASE_NAME } else { "gramin_career_setu" }
$DbUser = if ($env:DATABASE_USER) { $env:DATABASE_USER } else { "gcs_admin" }
$DbPass = $env:DATABASE_PASSWORD

Write-Warning "This action will restore '$BackupFile' into '$DbName' on $DbHost:$DbPort."
$confirm = Read-Host "Proceed? (y/N)"
if ($confirm -notmatch "^[Yy]$") {
    Write-Host "Restore cancelled by user."
    exit 0
}

$env:PGPASSWORD = $DbPass

$pgRestoreCmd = Get-Command "pg_restore" -ErrorAction SilentlyContinue
$dockerCmd = Get-Command "docker" -ErrorAction SilentlyContinue

if ($pgRestoreCmd) {
    & pg_restore -h $DbHost -p $DbPort -U $DbUser -d $DbName --clean --if-exists --no-owner --no-privileges $BackupFile
} elseif ($dockerCmd) {
    Write-Host "[$((Get-Date).ToString('s'))] Invoking pg_restore inside Docker gcs-postgres..."
    & docker cp $BackupFile gcs-postgres:/tmp/restore.dump
    & docker exec -e PGPASSWORD=$DbPass gcs-postgres pg_restore -U $DbUser -d $DbName --clean --if-exists --no-owner --no-privileges /tmp/restore.dump
    & docker exec gcs-postgres rm -f /tmp/restore.dump
} else {
    Write-Warning "Neither pg_restore nor docker command found. Cannot perform live restore."
}

Write-Host "[$((Get-Date).ToString('s'))] Database restore completed." -ForegroundColor Green
