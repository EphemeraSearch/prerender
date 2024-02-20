#!/usr/bin/env bash
set -euo pipefail

git_hash_long="$(git rev-parse HEAD)"
if [ -z "$(git status --porcelain --untracked-files=no)" ]; then
    git_hash="$(git rev-parse --short HEAD)"
else
    git_hash="$(git rev-parse --short HEAD)-dirty"
fi

tag=${REGISTRY_SLASH}prerender:${git_hash}
root="$(git rev-parse --show-toplevel)"

(
    cd "${root}"
    echo "docker build --target production -t ${tag} ."
    docker build -t "${tag}" .
    docker push "${tag}"
)

echo "VERSION=${git_hash}"
echo "DD_GIT_COMMIT_SHA=${git_hash_long}"

sed -i '/^export VERSION=/ {s/^/# /;a\
export VERSION="'"${git_hash}"'"
}' "${root}/.envrc"

sed -i '/^export DD_GIT_COMMIT_SHA=/ {s/^/# /;a\
export DD_GIT_COMMIT_SHA="'"${git_hash_long}"'"
}' "${root}/.envrc"

direnv allow
