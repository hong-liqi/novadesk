#!/bin/sh
set -e

/usr/local/bin/prisma-deploy.sh
exec "$@"
