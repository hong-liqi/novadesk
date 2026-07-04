#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE notification_db;
    CREATE DATABASE helpdesk_db;
    CREATE DATABASE analytics_db;
    CREATE DATABASE chat_db;
EOSQL
