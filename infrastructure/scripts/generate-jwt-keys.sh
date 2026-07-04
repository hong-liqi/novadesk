#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-.}"

mkdir -p "$OUT_DIR"

openssl genrsa -out "$OUT_DIR/jwt-private.pem" 2048
openssl rsa -in "$OUT_DIR/jwt-private.pem" -pubout -out "$OUT_DIR/jwt-public.pem"

echo "Chaves geradas em $OUT_DIR/"
echo ""
echo "JWT_PRIVATE_KEY (cole no CapRover, uma linha com \\n):"
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' "$OUT_DIR/jwt-private.pem"
echo ""
echo ""
echo "JWT_PUBLIC_KEY:"
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' "$OUT_DIR/jwt-public.pem"
