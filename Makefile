SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

REPO_ROOT=$$(git rev-parse --show-toplevel)

.PHONY: test
test:
	cd $(REPO_ROOT)/
	npm run test

.PHONY: format-js
format-js:
	@# --diff-filter=d means exclude deleted files
	result=$$(git diff --diff-filter=d main --name-only | grep -Ew '(jsx$$|js$$)' || true | xargs)
	if [ -n "$$result" ]; then
		cd $(REPO_ROOT)
		prettier -w $$result
	fi

.PHONY: format
format: format-js

.PHONY: build
build:
	$(REPO_ROOT)/bin/build-and-push.sh

.PHONY: deploy
deploy:
	$(REPO_ROOT)/bin/deploy-k8s.sh
