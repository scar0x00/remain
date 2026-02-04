#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

pnpx wrangler d1 execute remain-decks --file "$SCRIPT_DIR/sql_tables/deck_table.sql" --local
pnpx wrangler d1 execute remain-decks --file "$SCRIPT_DIR/sql_tables/study_session.sql" --local