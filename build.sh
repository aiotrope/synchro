#!/usr/bin/env bash
# exit on error
set -o errexit

poetry install

npm run build
python manage.py collectstatic --no-input
python manage.py migrate