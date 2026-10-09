#!/usr/bin/env bash
# run-prompts.sh — run prompts/NN*.md through Claude Code one after another.
#
#   ./run-prompts.sh            run (or resume) the sequence
#   ./run-prompts.sh --reset    forget progress and session, start from 01
#
# Settings (environment variables, all optional):
#   PERM_MODE=auto              auto | acceptEdits | dontAsk
#   ALLOWED_TOOLS=""            e.g. "Bash(npm *),Bash(npx *),Bash(git *)"
#                               (needed with acceptEdits; auto mode judges commands itself)
#   CHECK_CMD=""                gate run after each phase, e.g. "npm run build"
#   MAX_FIX=2                   how many times Claude may try to fix a failing check
#   MAX_RETRY=2                 retries when a claude call itself fails (network, overload)
#   RETRY_WAIT=60               seconds between those retries
#   FRESH=0                     1 = every phase starts a new conversation (no shared context)
#   GIT_COMMIT=1                commit after each finished phase (when inside a git repo)
#   PROMPT_DIR=prompts  LOG_DIR=logs  SESSION_FILE=.claude-sequence-session

set -euo pipefail

PROMPT_DIR="${PROMPT_DIR:-prompts}"
LOG_DIR="${LOG_DIR:-logs}"
SESSION_FILE="${SESSION_FILE:-.claude-sequence-session}"
PERM_MODE="${PERM_MODE:-auto}"
ALLOWED_TOOLS="${ALLOWED_TOOLS:-}"
CHECK_CMD="${CHECK_CMD:-}"
MAX_FIX="${MAX_FIX:-2}"
MAX_RETRY="${MAX_RETRY:-2}"
RETRY_WAIT="${RETRY_WAIT:-60}"
FRESH="${FRESH:-0}"
GIT_COMMIT="${GIT_COMMIT:-1}"

command -v claude >/dev/null || { echo "claude CLI not found on PATH"; exit 1; }
command -v jq     >/dev/null || { echo "jq is required"; exit 1; }

mkdir -p "$LOG_DIR"

if [[ "${1:-}" == "--reset" ]]; then
  rm -f "$LOG_DIR"/*.done "$SESSION_FILE"
  echo "Progress and session cleared."
  shift
fi

SESSION_ID=""
if [[ "$FRESH" != 1 && -f "$SESSION_FILE" ]]; then
  SESSION_ID="$(cat "$SESSION_FILE")"
fi

# Run one prompt. Succeeds only if claude exits 0 AND the JSON says is_error=false.
# Retries transient failures. Usage: run_claude "<prompt>" <out.json>
run_claude() {
  local prompt="$1" out="$2" attempt=0
  local args=(-p "$prompt" --output-format json
              --permission-mode "$PERM_MODE" --permission-prompts none)
  [[ -n "$ALLOWED_TOOLS" ]] && args+=(--allowedTools "$ALLOWED_TOOLS")
  [[ "$FRESH" != 1 && -n "$SESSION_ID" ]] && args+=(--resume "$SESSION_ID")

  while true; do
    if claude "${args[@]}" >"$out" 2>"${out%.json}.err" \
       && [[ "$(jq -r '.is_error // false' "$out")" == "false" ]]; then
      return 0
    fi
    attempt=$((attempt + 1))
    if (( attempt > MAX_RETRY )); then
      echo "  ✗ claude failed: $(jq -r '.result // empty' "$out" 2>/dev/null | head -c 300)"
      return 1
    fi
    echo "  ! call failed, retry $attempt/$MAX_RETRY in ${RETRY_WAIT}s"
    sleep "$RETRY_WAIT"
  done
}

# Remember the (possibly new) session ID so the next call continues the conversation.
save_session() {
  [[ "$FRESH" == 1 ]] && return 0
  local sid
  sid="$(jq -r '.session_id // empty' "$1")"
  [[ -n "$sid" ]] || { echo "  ✗ no session_id in $1"; return 1; }
  SESSION_ID="$sid"
  printf '%s\n' "$SESSION_ID" >"$SESSION_FILE"
}

# Optional quality gate. If it fails, hand the error back to Claude to fix.
run_check() {
  local phase="$1" n=0 log="$LOG_DIR/$1.check.log" fix
  [[ -n "$CHECK_CMD" ]] || return 0
  while true; do
    if bash -c "$CHECK_CMD" >"$log" 2>&1; then
      echo "  ✓ check passed: $CHECK_CMD"
      return 0
    fi
    n=$((n + 1))
    if (( n > MAX_FIX )); then
      echo "  ✗ check still failing after $MAX_FIX fix attempts. See $log"
      return 1
    fi
    echo "  ! check failed, asking Claude to fix ($n/$MAX_FIX)"
    fix="$(printf 'The check `%s` failed after the last phase. Fix the underlying problem; do not disable, skip, or weaken the check. Last output:\n\n%s' \
           "$CHECK_CMD" "$(tail -n 80 "$log")")"
    run_claude "$fix" "$LOG_DIR/$phase.fix$n.json" || return 1
    save_session "$LOG_DIR/$phase.fix$n.json" || return 1
  done
}

commit_phase() {
  [[ "$GIT_COMMIT" == 1 ]] || return 0
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || return 0
  git add -A -- . ":!$LOG_DIR" ":!$SESSION_FILE" >/dev/null 2>&1 || true
  git commit -qm "claude: phase $1" >/dev/null 2>&1 || true   # nothing to commit is fine
}

shopt -s nullglob
files=("$PROMPT_DIR"/[0-9][0-9]*.md)
(( ${#files[@]} )) || { echo "No prompts found in $PROMPT_DIR/ (expected 01.md, 02-name.md, ...)"; exit 1; }

for file in "${files[@]}"; do
  phase="$(basename "$file" .md)"

  if [[ -f "$LOG_DIR/$phase.done" ]]; then
    echo "Skipping completed phase: $phase"
    continue
  fi

  echo "================================"
  echo "Phase $phase"
  echo "================================"

  run_claude "$(cat "$file")" "$LOG_DIR/$phase.json" || { echo "Stopped at phase $phase."; exit 1; }
  save_session "$LOG_DIR/$phase.json" || exit 1
  jq -r '.result // ""' "$LOG_DIR/$phase.json" >"$LOG_DIR/$phase.txt"

  run_check "$phase" || { echo "Stopped at phase $phase (check)."; exit 1; }

  commit_phase "$phase"
  touch "$LOG_DIR/$phase.done"

  echo "  ✓ done (reported cost: \$$(jq -r '.total_cost_usd // "?"' "$LOG_DIR/$phase.json"))"
  echo
done

echo "All phases processed."
