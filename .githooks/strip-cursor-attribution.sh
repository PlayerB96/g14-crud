#!/bin/bash
# Normaliza mensajes de commit eliminando trailers no deseados.
MSG_FILE="$1"
[ -f "$MSG_FILE" ] || exit 0

sed -i '/cursoragent@cursor\.com/d' "$MSG_FILE"
sed -i '/^Made-with: Cursor/d' "$MSG_FILE"
sed -i '/^Co-authored-by: Cursor /d' "$MSG_FILE"

exit 0
