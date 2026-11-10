#!/usr/bin/env bash
# ==============================================================================
# Gramin Career Setu — Automated PostgreSQL Database Backup Script
# Usage: ./scripts/backup-db.sh [backup_dir]
# Retention: Retains daily backups for 7 days, rotating older files.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Load .env if present
if [ -f "${ROOT_DIR}/.env" ]; then
  # shellcheck disable=SC1091
  set -a && source "${ROOT_DIR}/.env" && set +a
fi

DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-gramin_career_setu}"
DB_USER="${DATABASE_USER:-gcs_admin}"
DB_PASS="${DATABASE_PASSWORD:-}"
BACKUP_DIR="${1:-${ROOT_DIR}/backups/db}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

TIMESTAMP="$(date +'%Y%m%d_%H%M%S')"
BACKUP_FILE="${BACKUP_DIR}/gcs_backup_${DB_NAME}_${TIMESTAMP}.dump"

mkdir -p "${BACKUP_DIR}"

echo "[$(date -Iseconds)] Starting PostgreSQL backup for database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}..."

export PGPASSWORD="${DB_PASS}"

if command -v pg_dump >/dev/null 2>&1; then
  pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -F c \
    -b \
    -v \
    -f "${BACKUP_FILE}" \
    "${DB_NAME}"
elif command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -q 'gcs-postgres'; then
  echo "[$(date -Iseconds)] Local pg_dump not found; executing dump inside gcs-postgres container..."
  docker exec -e PGPASSWORD="${DB_PASS}" gcs-postgres \
    pg_dump -U "${DB_USER}" -F c -b "${DB_NAME}" > "${BACKUP_FILE}"
else
  echo "ERROR: Neither 'pg_dump' nor Docker container 'gcs-postgres' was found." >&2
  exit 1
fi

BACKUP_SIZE="$(du -h "${BACKUP_FILE}" | cut -f1)"
echo "[$(date -Iseconds)] Backup completed successfully: ${BACKUP_FILE} (${BACKUP_SIZE})"

# Retention Rotation: Remove backups older than RETENTION_DAYS
echo "[$(date -Iseconds)] Rotating backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "gcs_backup_${DB_NAME}_*.dump" -mtime "+${RETENTION_DAYS}" -exec rm -f {} \;
echo "[$(date -Iseconds)] Rotation complete."
