# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# For debugging: List files in the build context
RUN ls -la /app

# Install system dependencies (for asyncio, MongoDB, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt first for better caching
COPY requirements.txt .

# For debugging: Check if requirements.txt exists
RUN ls -la /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# For debugging: List all files after copy
RUN ls -la /app/

# Expose FastAPI port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Start FastAPI server using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
