#!/bin/sh

# run in dev or prod
while getopts 'dp' FLAG
do
    case "$FLAG" in
        d) flask --app backend.wsgi --debug run -p 8000;;
        p) gunicorn -b :8000 backend.wsgi:handler;;
    esac
done



