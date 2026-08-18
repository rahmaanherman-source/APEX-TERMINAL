#!/usr/bin/env bash
set -Eeuo pipefail

GCP_PROJECT_ID="${GCP_PROJECT_ID:-}"
GCP_REGION="${GCP_REGION:-us-central1}"
GOLDIES_BUCKET="${GOLDIES_BUCKET:-}"

[[ -n "$GCP_PROJECT_ID" ]] || { echo "ERROR: GCP_PROJECT_ID is required." >&2; exit 2; }
[[ -n "$GOLDIES_BUCKET" ]] || GOLDIES_BUCKET="${GCP_PROJECT_ID}-goldies-world"
command -v gcloud >/dev/null 2>&1 || { echo "ERROR: gcloud CLI is required." >&2; exit 127; }

gcloud config set project "$GCP_PROJECT_ID" --quiet >/dev/null

fail=0
check() {
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then
    printf 'PASS  %s\n' "$label"
  else
    printf 'FAIL  %s\n' "$label"
    fail=1
  fi
}

printf '%s\n' "=========================================="
echo " GODSPEED x GOLDIES WORLD — VERIFICATION"
echo " Project : ${GCP_PROJECT_ID}"
echo " Region  : ${GCP_REGION}"
echo " Bucket  : gs://${GOLDIES_BUCKET}"
printf '%s\n' "=========================================="

check "Active gcloud account" gcloud auth list --filter='status:ACTIVE' --format='value(account)'
check "Project accessible" gcloud projects describe "$GCP_PROJECT_ID"
check "Cloud Run API" gcloud services list --enabled --filter='config.name:run.googleapis.com' --format='value(config.name)'
check "Artifact Registry API" gcloud services list --enabled --filter='config.name:artifactregistry.googleapis.com' --format='value(config.name)'
check "Cloud Build API" gcloud services list --enabled --filter='config.name:cloudbuild.googleapis.com' --format='value(config.name)'
check "Secret Manager API" gcloud services list --enabled --filter='config.name:secretmanager.googleapis.com' --format='value(config.name)'
check "Goldies bucket" gcloud storage buckets describe "gs://${GOLDIES_BUCKET}" --project="$GCP_PROJECT_ID"

if [[ "$fail" -eq 0 ]]; then
  echo ""
  echo "VERIFIED: GCP bootstrap prerequisites are healthy."
else
  echo ""
  echo "NOT VERIFIED: one or more checks failed."
fi

exit "$fail"
