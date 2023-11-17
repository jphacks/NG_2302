#!/bin/bash

# DB migrationを実行する
poetry run python -m db.migrate_cloud_db

# uvicornのサーバーを起動する
poetry run python /src/main.py