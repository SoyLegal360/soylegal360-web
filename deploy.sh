#!/usr/bin/env bash
#
# deploy.sh — publica la web de SoyLegal360 en Hostinger por FTP.
#
# Flujo:
#   1. Sincroniza site/ (fuente) -> dist/ (deploy limpio), excluyendo las
#      páginas noindex y .DS_Store.
#   2. Sube dist/ al servidor de Hostinger con lftp (mirror: solo lo que cambió).
#
# Uso:
#   ./deploy.sh staging            # DRY-RUN: enseña qué subiría a pruebas. (no toca nada)
#   ./deploy.sh staging --live     # sube de verdad a pruebas.soylegal360.es
#   ./deploy.sh prod               # DRY-RUN a producción
#   ./deploy.sh prod --live        # sube de verdad a soylegal360.es
#   añade --delete para BORRAR en el servidor los ficheros que ya no existen en local
#
# Credenciales: crea ~/.soylegal360-deploy.env (chmod 600) con:
#   FTP_HOST="..."          # p.ej. la IP del servidor o ftp.soylegal360.es
#   FTP_USER="..."          # usuario FTP de Hostinger
#   FTP_PASS="..."          # contraseña FTP
#   FTP_REMOTE_PROD="public_html"                 # carpeta del dominio principal
#   FTP_REMOTE_STAGING="domains/pruebas.soylegal360.es/public_html"  # ajustar al ver el árbol
#   # FTP_PORT="21"         # opcional (21 por defecto)

set -euo pipefail

ROOT="/Users/josemotos/Documents/Claude/SoyLegal360.es"
SITE="$ROOT/site/"
DIST="$ROOT/dist/"
ENV_FILE="$HOME/.soylegal360-deploy.env"

# ── Cargar credenciales ────────────────────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
  echo "✖ No existe $ENV_FILE — créalo con FTP_HOST/FTP_USER/FTP_PASS/FTP_REMOTE_* (ver cabecera)." >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$ENV_FILE"
: "${FTP_HOST:?Falta FTP_HOST en $ENV_FILE}"
: "${FTP_USER:?Falta FTP_USER en $ENV_FILE}"
: "${FTP_PASS:?Falta FTP_PASS en $ENV_FILE}"
FTP_PORT="${FTP_PORT:-21}"

# ── Argumentos ─────────────────────────────────────────────────────────────
TARGET="${1:-}"
LIVE=0
DELETE=""
for arg in "${@:2}"; do
  case "$arg" in
    --live)   LIVE=1 ;;
    --delete) DELETE="--delete" ;;
    *) echo "Argumento desconocido: $arg" >&2; exit 1 ;;
  esac
done

case "$TARGET" in
  staging) REMOTE="${FTP_REMOTE_STAGING:?Falta FTP_REMOTE_STAGING en $ENV_FILE}"; LABEL="pruebas.soylegal360.es" ;;
  prod)    REMOTE="${FTP_REMOTE_PROD:?Falta FTP_REMOTE_PROD en $ENV_FILE}";       LABEL="soylegal360.es (PRODUCCIÓN)" ;;
  *) echo "Uso: ./deploy.sh {staging|prod} [--live] [--delete]" >&2; exit 1 ;;
esac

# ── 1. Sincronizar site/ -> dist/ ──────────────────────────────────────────
echo "▸ Sincronizando site/ -> dist/ …"
rsync -a --delete \
  --exclude='.DS_Store' \
  --exclude='privacy-policy/' \
  --exclude='solicita-auditoria-web-gratuita/' \
  --exclude='casos-de-exito/' \
  "$SITE" "$DIST"

FILES=$(find "$DIST" -type f | wc -l | tr -d ' ')
echo "  dist/ listo: $FILES ficheros."

# ── 2. Subir con lftp ──────────────────────────────────────────────────────
DRYRUN="--dry-run"
[[ $LIVE -eq 1 ]] && DRYRUN=""

echo
echo "▸ Destino: $LABEL"
echo "  Carpeta remota: $REMOTE"
[[ $LIVE -eq 1 ]] && echo "  Modo: SUBIDA REAL" || echo "  Modo: DRY-RUN (no se sube nada; añade --live para subir)"
[[ -n "$DELETE" ]] && echo "  ⚠ --delete activado: se borrarán en el servidor los ficheros que no estén en local"
echo

lftp -c "
set ftp:ssl-allow true;
set ssl:verify-certificate no;
set net:max-retries 2;
set net:timeout 15;
open -p $FTP_PORT -u \"$FTP_USER\",\"$FTP_PASS\" \"$FTP_HOST\";
mirror -R $DRYRUN $DELETE --only-newer --parallel=4 --verbose \
  --exclude-glob .DS_Store \
  \"$DIST\" \"$REMOTE\";
bye
"

echo
if [[ $LIVE -eq 1 ]]; then
  echo "✓ Subida completada a $LABEL"
else
  echo "✓ Dry-run completado. Si lo de arriba es correcto, repite con --live."
fi
