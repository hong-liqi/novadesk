FROM postgres:16-alpine

COPY infrastructure/caprover/postgres/init-databases.sh /docker-entrypoint-initdb.d/01-init-databases.sh
RUN chmod +x /docker-entrypoint-initdb.d/01-init-databases.sh

EXPOSE 5432
