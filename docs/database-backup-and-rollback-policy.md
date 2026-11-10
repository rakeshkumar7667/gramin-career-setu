# Gramin Career Setu — Database Backup, Restore, Retention & Migration Rollback Policy

This document defines the standard operational procedures for database backups, disaster recovery, retention lifecycles, and database migration rollbacks for the **Gramin Career Setu** platform.

---

## 1. Operational Objectives & SLAs

| Metric | Target | Rationale |
|---|---|---|
| **Recovery Point Objective (RPO)** | `< 1 hour` (via daily dumps + WAL) | Ensures candidates never lose more than 1 hour of career roadmap or application history. |
| **Recovery Time Objective (RTO)** | `< 30 minutes` | Fast containerized reconstitution of relational store and schemas. |
| **Backup Verification Frequency** | Weekly automated restore drill | Ensures backup integrity and non-corrupt archival snapshots. |

---

## 2. Automated Backup Schedule & Retention

### 2.1 Schedule
- **Daily Full Backup**: Executed every night at `02:00 IST` via cron using `./scripts/backup-db.sh`.
- **Pre-Deployment Snapshots**: Triggered automatically before every production release or migration execution.

### 2.2 Retention Lifecycle
1. **Local Hot Backups**: Retained for **7 days** in `backups/db/` on the deployment host.
2. **Offsite Cold Storage**: Compressed and replicated to encrypted Object Storage (e.g. AWS S3 Glacier / Azure Blob with 256-bit AES encryption):
   - Daily backups retained for **30 days**.
   - Weekly snapshots retained for **12 weeks**.
   - Monthly snapshots retained for **12 months**.

---

## 3. Database Restore Procedures

### 3.1 Standard Point-in-Time Restore
To restore a backup into the target database:

**Linux / POSIX**:
```bash
./scripts/restore-db.sh ./backups/db/gcs_backup_gramin_career_setu_20260912_020000.dump
```

**Windows PowerShell**:
```powershell
.\scripts\restore-db.ps1 -BackupFile ".\backups\db\gcs_backup_gramin_career_setu_20260912_020000.dump"
```

### 3.2 Automated Containerized Restore Verification
To verify backup viability in an isolated test environment without affecting production:
```bash
docker run -d --name gcs-verify-db -e POSTGRES_PASSWORD=verify_pass -e POSTGRES_DB=verify_db postgres:16-alpine
docker cp ./backups/db/latest.dump gcs-verify-db:/tmp/latest.dump
docker exec -e PGPASSWORD=verify_pass gcs-verify-db pg_restore -U postgres -d verify_db --clean --if-exists /tmp/latest.dump
docker stop gcs-verify-db && docker rm gcs-verify-db
```

---

## 4. Flyway Database Migration Rollback Policy

### 4.1 Strict Forward-Only Principle
In relational environments with live transactional data (such as candidate registrations and job applications), destructive rollback commands (`flyway clean` or dropping tables) are **strictly prohibited in production**.

All schema adjustments must follow the **forward-only compensating migration pattern**:
1. If a migration `V5__add_feature_column.sql` introduced a problem in staging or production, do NOT delete or edit `V5`.
2. Author a compensating forward migration `V6__revert_feature_column.sql` that safely drops or modifies the target column/table.
3. Apply `V6` using standard pipeline deployment.

### 4.2 Handling Failed Migrations (`flyway repair`)
If a migration fails mid-execution due to a syntax error or constraint conflict:
1. Identify the root cause and ensure the underlying issue is resolved.
2. Run `flyway repair` via Maven or Spring Boot to mark the failed migration as repaired or remove dirty entries in `flyway_schema_history`:
   ```bash
   mvn flyway:repair -Dflyway.url=jdbc:postgresql://localhost:5432/gramin_career_setu -Dflyway.user=gcs_admin -Dflyway.password=...
   ```
3. Apply the corrected forward migration.

---

## 5. Security & Access Control for Backups

- Backup dumps contain candidate Personally Identifiable Information (PII) such as phone numbers, candidate names, and village addresses.
- Backup directories must have restricted OS permissions (`chmod 700 backups/db`).
- All offsite transfers must use TLS 1.3 in transit and AES-256 at rest.
- Direct database access is restricted to internal Docker bridge networks or `127.0.0.1` interfaces only.
