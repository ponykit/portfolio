#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  Site Capture Runner
#  Usage:
#    ./scripts/capture-site/run.sh                    # 기본 (trip-pocket)
#    ./scripts/capture-site/run.sh https://example.com
#    ./scripts/capture-site/run.sh --clean https://example.com
#
#  Options:
#    --clean   캡처 전 output/screenshots 폴더를 비운다
#    --help    도움말 출력
# ─────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/output"
SCREENSHOTS_DIR="$OUTPUT_DIR/screenshots"

CLEAN=false
URL=""

# ── 인자 파싱 ─────────────────────────────────────────────────
for arg in "$@"; do
  case "$arg" in
    --clean) CLEAN=true ;;
    --help)
      echo "Usage: $(basename "$0") [--clean] [URL]"
      echo ""
      echo "  --clean   캡처 전 스크린샷 폴더를 비운다"
      echo "  URL       캡처할 사이트 URL (기본: trip-pocket)"
      exit 0
      ;;
    http*) URL="$arg" ;;
    *)
      echo "⚠️  Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

# ── 사전 준비 ─────────────────────────────────────────────────
mkdir -p "$SCREENSHOTS_DIR"

if $CLEAN; then
  echo "🗑  Cleaning screenshots..."
  rm -f "$SCREENSHOTS_DIR"/*.png
  rm -f "$OUTPUT_DIR/manifest.json"
  rm -f "$OUTPUT_DIR/failed-captures.json"
  rm -f "$OUTPUT_DIR/index.html"
fi

# ── 실행 ──────────────────────────────────────────────────────
echo "🚀  Starting site capture..."
echo "    Root : $ROOT_DIR"

cd "$ROOT_DIR"

if [ -n "$URL" ]; then
  npx tsx scripts/capture-site/index.ts --url "$URL"
elif [ -n "${CAPTURE_BASE_URL:-}" ]; then
  npx tsx scripts/capture-site/index.ts
else
  CAPTURE_BASE_URL="https://trip-pocket.itkong.uk/ko" \
    npx tsx scripts/capture-site/index.ts
fi

# ── 완료 후 미리보기 경로 안내 ────────────────────────────────
PREVIEW="$OUTPUT_DIR/index.html"
if [ -f "$PREVIEW" ]; then
  echo ""
  echo "🌐  Preview: file://$PREVIEW"
fi
