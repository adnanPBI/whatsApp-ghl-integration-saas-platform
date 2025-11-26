#!/bin/bash

# WhatsApp-GHL Integration Platform - Backup Script

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE_BACKUP="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

echo "🔄 Starting backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Database backup
echo "Backing up PostgreSQL database..."
docker exec whatsapp_ghl_db pg_dump -U ${DATABASE_USERNAME:-whatsapp_ghl} ${DATABASE_NAME:-whatsapp_ghl_db} > $DATABASE_BACKUP

# Compress backup
gzip $DATABASE_BACKUP

echo "✓ Database backed up to: ${DATABASE_BACKUP}.gz"

# Redis backup (RDB snapshot)
echo "Backing up Redis data..."
docker exec whatsapp_ghl_redis redis-cli BGSAVE
sleep 5
docker cp whatsapp_ghl_redis:/data/dump.rdb "$BACKUP_DIR/redis_backup_$TIMESTAMP.rdb"

echo "✓ Redis backed up to: $BACKUP_DIR/redis_backup_$TIMESTAMP.rdb"

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.gz" -type f -mtime +30 -delete
find $BACKUP_DIR -name "*.rdb" -type f -mtime +30 -delete

echo "✓ Backup completed successfully!"
echo "✓ Old backups (>30 days) cleaned up"
