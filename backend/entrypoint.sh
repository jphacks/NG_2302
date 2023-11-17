#!/bin/bash

# DB migrationを実行する
poetry run python -m db.migrate_cloud_db

# uvicornのサーバーを起動する
poetry run uvicorn api.main:app --host 0.0.0.0