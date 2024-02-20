#!/usr/bin/env bash
# shellcheck disable=SC2016  # expressions don't expand in single quotes (cf. envsubst)
set -euo pipefail
root="$(git rev-parse --show-toplevel)"

echo "Deploying with:"
echo "  ENV_NAME_LONG=${ENV_NAME_LONG:?}"
echo "  NAMESPACE=${NAMESPACE:?}"
echo "  REGISTRY_SLASH=${REGISTRY_SLASH:?}"
echo "  VERSION=${VERSION:?}"

(
    cd "${root}"
    envsubst '${NAMESPACE} ${DD_GIT_COMMIT_SHA} ${ENV_NAME_LONG} ${REGISTRY_SLASH} ${VERSION}' < service.yaml | kubectl -n "${NAMESPACE}" apply -f -
)
