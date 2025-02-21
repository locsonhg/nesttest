#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" == "main" ]; then
  echo "🔄 Đẩy code lên nhánh main - gọi webhook triển khai..."
  curl -X POST http://160.191.51.139:4001/webhook -d '{}' -H "Content-Type: application/json"
else
  echo "🛑 Không phải nhánh main, bỏ qua webhook."
fi
