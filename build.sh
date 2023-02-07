#!/usr/bin/env bash
# exit on error
set -o errexit

poetry install

python manage.py makemigrations --dry-run --verbosity 3
python manage.py makemigrations
python manage.py migrate
npm run build
python manage.py collectstatic --no-input

