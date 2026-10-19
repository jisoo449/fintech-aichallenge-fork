#!/usr/bin/env bash
set -uo pipefail

while read -r path repo branch <&3; do
  [[ -z "${path:-}" || "$path" == \#* ]] && continue

  if [[ -d "$path" ]]; then
    echo "--- $path 이미 있음, 건너뜀"; continue
  fi

  if [[ -z "${branch:-}" ]]; then
    branch=$(gh repo view "$repo" --json defaultBranchRef -q .defaultBranchRef.name < /dev/null) || {
      echo "!!! $repo 를 찾을 수 없음, 건너뜀"; continue; }
  fi

  echo ">>> $repo ($branch) → $path"
  git subtree add --prefix="$path" "https://github.com/$repo.git" "$branch" --squash< /dev/null \
    || echo "!!! $repo 가져오기 실패"
done 3<<'EOF'
be        SSAFY-2026-AI-Challenge/backend
fe        SSAFY-2026-AI-Challenge/frontend
ai        SSAFY-2026-AI-Challenge/ai
EOF