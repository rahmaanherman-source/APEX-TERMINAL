#!/usr/bin/env bash
set -Eeuo pipefail

# GODSPEED x GOLDIES WORLD — canonical GCP bootstrap
# Safe-by-default: no remote script execution, no credentials, no hard-coded secrets.

GODSPEED_PRINCIPAL="${GODSPEED_PRINCIPAL:-Rahmaan Manzar EL Herman}"
GODSPEED_ENTITY="${GODSPEED_ENTITY:-Make It All Count LLC}"
GOLDIES_WORLD="${GOLDIES_WORLD:-GOLDIES_WORLD}"
GCP_PROJECT_ID="${GCP_PROJECT_ID:-}"
GCP_REGION="${GCP_REGION:-us-central1}"
GCP_ZONE="${GCP_ZONE:-us-central1-a}"
GOLDIES_BUCKET="${GOLDIES_BUCKET:-}"

if [[ -z "$GCP_PROJECT_ID" || "$GCP_PROJECT_ID" == "your-project-id-here" ]]; then
  echo "ERROR: Set GCP_PROJECT_ID before running this script." >&2
  echo 'Example: export GCP_PROJECT_ID="decoded-flag-486719-j9"' >&2
  exit 2
fi

if [[ -z "$GOLDIES_BUCKET" ]]; then
  GOLDIES_BUCKET="${GCP_PROJECT_ID}-goldies-world"
fi

if ! command -v gcloud >/dev/null 2>&1; then
  echo "ERROR: gcloud CLI is required." >&2
  exit 127
fi

if ! gcloud auth list --filter='status:ACTIVE' --format='value(account)' | grep -q .; then
  echo "ERROR: No active gcloud account. Run: gcloud auth login" >&2
  exit 1
fi

export GODSPEED_LABELS="owner=rahmaan,system=godspeed,world=goldies,env=prod"

printf '%s\n' "==========================================" 
echo " GODSPEED x GOLDIES WORLD — GCP BOOTSTRAP"
echo " Principal : ${GODSPEED_PRINCIPAL}"
echo " Entity    : ${GODSPEED_ENTITY}"
echo " World     : ${GOLDIES_WORLD}"
echo " Project   : ${GCP_PROJECT_ID}"
echo " Region    : ${GCP_REGION}"
echo " Zone      : ${GCP_ZONE}"
echo " Bucket    : ${GOLDIES_BUCKET}"
echo " Labels    : ${GODSPEED_LABELS}"
printf '%s\n' "=========================================="

gcloud config set project "$GCP_PROJECT_ID" --quiet
gcloud config set compute/region "$GCP_REGION" --quiet
gcloud config set compute/zone "$GCP_ZONE" --quiet

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com \
  --project="$GCP_PROJECT_ID" --quiet

if gcloud storage buckets describe "gs://${GOLDIES_BUCKET}" --project="$GCP_PROJECT_ID" >/dev/null 2>&1; then
  echo "OK: Goldies bucket already exists."
else
  gcloud storage buckets create "gs://${GOLDIES_BUCKET}" \
    --project="$GCP_PROJECT_ID" \
    --location="$GCP_REGION" \
    --uniform-bucket-level-access
  echo "OK: Goldies bucket created."
fi

gcloud storage buckets update "gs://${GOLDIES_BUCKET}" \
  --update-labels="owner=rahmaan,system=godspeed,world=goldies,env=prod" \
  --project="$GCP_PROJECT_ID" >/dev/null

# Write only non-secret deployment metadata. Never write tokens, API keys, or passwords.
mkdir -p .apex
after="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
cat > .apex/goldies-gcp-state.env <<EOF
GODSPEED_PRINCIPAL=$(printf '%q' "$GODSPEED_PRINCIPAL")
GODSPEED_ENTITY=$(printf '%q' "$GODSPEED_ENTITY")
GOLDIES_WORLD=$(printf '%q' "$GOLDIES_WORLD")
GCP_PROJECT_ID=$(printf '%q' "$GCP_PROJECT_ID")
GCP_REGION=$(printf '%q' "$GCP_REGION")
GCP_ZONE=$(printf '%q' "$GCP_ZONE")
GOLDIES_BUCKET=$(printf '%q' "$GOLDIES_BUCKET")
BOOTSTRAPPED_AT=$(printf '%q' "$after")
EOF

cat > .apex/goldies-gcp-state.json <<EOF
{
  "principal": "${GODSPEED_PRINCIPAL}",
  "entity": "${GODSPEED_ENTITY}",
  "world": "${GOLDIES_WORLD}",
  "project": "${GCP_PROJECT_ID}",
  "region": "${GCP_REGION}",
  "zone": "${GCP_ZONE}",
  "bucket": "${GOLDIES_BUCKET}",
  "bootstrapped_at": "${after}"
}
EOF

echo ""
echo "GODSPEED x GOLDIES WORLD — GCP ACTIVE"
echo "Project : ${GCP_PROJECT_ID}"
echo "Region  : ${GCP_REGION}"
echo "Bucket  : gs://${GOLDIES_BUCKET}"
echo "State   : .apex/goldies-gcp-state.json"
echo ""
