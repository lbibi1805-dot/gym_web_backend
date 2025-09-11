#!/bin/bash

# Keep Render service alive (chạy mỗi 10 phút)
# Tạo file này trong project root

while true; do
    curl -s https://gym-web-backend-xxxx.onrender.com/health > /dev/null
    echo "Health check sent at $(date)"
    sleep 600 # 10 minutes
done
