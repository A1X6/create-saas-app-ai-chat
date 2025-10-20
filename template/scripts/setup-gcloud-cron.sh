#!/bin/bash
# Google Cloud Scheduler Setup Script
# This script creates Cloud Scheduler jobs for monthly cron tasks
#
# Prerequisites:
# 1. gcloud CLI installed and authenticated
# 2. Cloud Scheduler API enabled
# 3. App deployed to Cloud Run or App Engine
# 4. CRON_SECRET environment variable set
#
# Usage:
#   ./scripts/setup-gcloud-cron.sh <service-url> <cron-secret>
#
# Example:
#   ./scripts/setup-gcloud-cron.sh https://your-service-url.run.app your-secret-key

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required arguments are provided
if [ $# -lt 2 ]; then
  echo -e "${RED}Error: Missing required arguments${NC}"
  echo "Usage: $0 <service-url> <cron-secret>"
  echo ""
  echo "Example:"
  echo "  $0 https://your-service-url.run.app your-secret-key"
  exit 1
fi

SERVICE_URL=$1
CRON_SECRET=$2
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1" # Change if needed

echo -e "${GREEN}Setting up Cloud Scheduler cron jobs...${NC}"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service URL: $SERVICE_URL"
echo ""

# Enable Cloud Scheduler API if not already enabled
echo -e "${YELLOW}Checking if Cloud Scheduler API is enabled...${NC}"
gcloud services enable cloudscheduler.googleapis.com --project=$PROJECT_ID

# Wait a moment for API to be fully enabled
sleep 2

# Function to create or update a cron job
create_or_update_job() {
  local JOB_NAME=$1
  local SCHEDULE=$2
  local URI=$3
  local DESCRIPTION=$4

  echo -e "${YELLOW}Setting up job: $JOB_NAME${NC}"

  # Check if job exists
  if gcloud scheduler jobs describe $JOB_NAME --location=$REGION --project=$PROJECT_ID &> /dev/null; then
    echo "Job exists, updating..."
    gcloud scheduler jobs update http $JOB_NAME \
      --location=$REGION \
      --schedule="$SCHEDULE" \
      --uri="$URI" \
      --http-method=GET \
      --headers="Authorization=Bearer $CRON_SECRET" \
      --description="$DESCRIPTION" \
      --project=$PROJECT_ID
  else
    echo "Creating new job..."
    gcloud scheduler jobs create http $JOB_NAME \
      --location=$REGION \
      --schedule="$SCHEDULE" \
      --uri="$URI" \
      --http-method=GET \
      --headers="Authorization=Bearer $CRON_SECRET" \
      --description="$DESCRIPTION" \
      --project=$PROJECT_ID
  fi

  echo -e "${GREEN}✓ Job $JOB_NAME configured${NC}"
  echo ""
}

# Create cron jobs

# Job 1: Reset yearly AI credits (1st of every month at midnight UTC)
create_or_update_job \
  "reset-yearly-credits" \
  "0 0 1 * *" \
  "$SERVICE_URL/api/cron/reset-yearly-credits" \
  "Monthly reset of AI credits for yearly subscription users"

# Job 2: Reset free tokens (1st of every month at midnight UTC)
create_or_update_job \
  "reset-free-tokens" \
  "0 0 1 * *" \
  "$SERVICE_URL/api/cron/reset-free-tokens" \
  "Monthly reset of free tokens for free tier users"

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Cloud Scheduler setup complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo "Created/Updated jobs:"
echo "  1. reset-yearly-credits"
echo "  2. reset-free-tokens"
echo ""
echo "View jobs in Cloud Console:"
echo "https://console.cloud.google.com/cloudscheduler?project=$PROJECT_ID"
echo ""
echo "To manually trigger a job:"
echo "  gcloud scheduler jobs run reset-yearly-credits --location=$REGION"
echo "  gcloud scheduler jobs run reset-free-tokens --location=$REGION"
echo ""
echo -e "${YELLOW}Note: Make sure CRON_SECRET is set in your service's environment variables${NC}"
