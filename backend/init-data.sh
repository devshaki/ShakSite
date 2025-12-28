#!/bin/sh

# Exit on error
set -e

echo "Initializing persistent storage..."

# Use DATA_DIR from environment or default
DATA_DIR=${DATA_DIR:-/data}
UPLOADS_DIR=${UPLOADS_DIR:-/data/uploads}

echo "DATA_DIR: $DATA_DIR"
echo "UPLOADS_DIR: $UPLOADS_DIR"

# Create directories if they don't exist
mkdir -p "$DATA_DIR"
mkdir -p "$UPLOADS_DIR/memes"

echo "Directories created"

# Initialize JSON files if they don't exist
for file in memes quotes exams tasks; do
    FILE_PATH="$DATA_DIR/${file}.json"
    if [ ! -f "$FILE_PATH" ]; then
        echo "Initializing $FILE_PATH"
        echo "[]" > "$FILE_PATH"
    else
        echo "$FILE_PATH already exists"
    fi
done

# Set permissions
chmod -R 755 "$DATA_DIR"

echo "✓ Data directory initialized successfully"
echo "✓ Storage is ready at $DATA_DIR"
