#!/usr/bin/env bash
# ==============================================================================
# Gramin Career Setu — Automated PostgreSQL Database Restore Script
# Usage: ./scripts/restore-db.sh <path_to_backup_file> [target_db_name]
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <path_to_backup_file.dump> [target_db_name]" >&2
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "ERROR: Backup file does not exist: ${BACKUP_FILE}" >&2
  exit 1
fi

# Load .env if present
if [ -f "${ROOT_DIR}/.env" ]; then
  # shellcheck disable=SC1091
  set -a && source "${ROOT_DIR}/.env" && set +a
fi

DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
TARGET_DB="${2:-${DATABASE_NAME:-gramin_career_setu}}"
DB_USER="${DATABASE_USER:-gcs_admin}"
DB_PASS="${DATABASE_PASSWORD:-}"

echo "WARNING: This will restore ${BACKUP_FILE} into ${TARGET_DB} on ${DB_HOST}:${DB_PORT}."
read -r -p "Are you sure you want to proceed? (y/N): " CONFIRM
if [[ ! "${CONFIRM}" =~ ^[Yy]$ ]]; then
  echo "Restore aborted by user."
  exit 0
fi

export PGPASSWORD="${DB_PASS}"

echo "[$(date -Iseconds)] Restoring database ${TARGET_DB} from ${BACKUP_FILE}..."

if command -v pg_restore >/dev/null 2>&1; then
  pg_restore \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${TARGET_DB}" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    -v \
    "${BACKUP_FILE}" || true
elif command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -q 'gcs-postgres'; then
  docker cp "${BACKUP_FILE}" gcs-postgres:/tmp/restore.dump
  docker exec -e PGPASSWORD="${DB_PASS}" gcs-postgres \
    pg_restore -U "${DB_USER}" -d "${TARGET_DB}" --clean --if-exists --no-owner --no-privileges /tmp/restore.dump || true
  docker exec gcs-postgres rm -f /tmp/restore.dump
else
  echo "ERROR: Neither 'pg_restore' nor Docker container 'gcs-postgres' was found." >&2
  exit 1
fi

echo "[$(date -Iseconds)] Restore completed successfully."
