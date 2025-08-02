#!/bin/bash

# Atlas Core SID - Development Environment Startup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ASCII Art Banner
echo -e "${BLUE}"
cat << "EOF"
    _   _____ _        _    ____     ____                   ____ ___ ____  
   / \ |_   _| |      / \  / ___|   / ___|___  _ __ ___    / ___|_ _|  _ \ 
  / _ \  | | | |     / _ \ \___ \  | |   / _ \| '__/ _ \   \___ \| || | | |
 / ___ \ | | | |___ / ___ \ ___) | | |__| (_) | | |  __/    ___) | || |_| |
/_/   \_\|_| |_____/_/   \_\____/   \____\___/|_|  \___|   |____/___|____/ 

EOF
echo -e "${NC}"

print_info "Starting Atlas Core SID Development Environment..."

# Check prerequisites
print_info "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed. Some features may not work properly."
fi

print_success "Prerequisites check passed!"

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p logs
mkdir -p backend/logs
mkdir -p uploads

# Check if .env files exist
if [ ! -f .env ]; then
    print_info "Creating .env file from example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please update .env file with your configuration"
    else
        print_warning ".env.example not found. Creating minimal .env file..."
        cat > .env << EOF
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF
    fi
fi

if [ ! -f backend/.env ]; then
    print_info "Creating backend/.env file from example..."
    if [ -f backend/.env.example ]; then
        cp backend/.env.example backend/.env
        print_warning "Please update backend/.env file with your configuration"
    else
        print_warning "backend/.env.example not found. Please create it manually."
    fi
fi

# Stop existing containers
print_info "Stopping existing containers..."
docker-compose down

# Pull latest images
print_info "Pulling latest Docker images..."
docker-compose pull

# Start infrastructure services first
print_info "Starting infrastructure services..."
docker-compose up -d postgres redis elasticsearch minio

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 10

# Run database migrations
print_info "Running database migrations..."
docker-compose run --rm backend npx prisma migrate deploy || print_warning "Migration failed. This might be normal on first run."

# Create MinIO bucket
print_info "Setting up MinIO storage..."
docker-compose exec -T minio mc alias set myminio http://localhost:9000 minioadmin minioadmin || true
docker-compose exec -T minio mc mb myminio/atlas-uploads || true
docker-compose exec -T minio mc policy set public myminio/atlas-uploads || true

# Start all services
print_info "Starting all services..."
docker-compose up -d

# Show service status
print_info "Checking service status..."
docker-compose ps

# Wait a bit for services to fully start
sleep 5

# Display access information
echo ""
print_success "Atlas Core SID Development Environment is ready!"
echo ""
echo -e "${GREEN}Access URLs:${NC}"
echo -e "  Frontend:        ${BLUE}http://localhost:3000${NC}"
echo -e "  Backend API:     ${BLUE}http://localhost:3001${NC}"
echo -e "  API Docs:        ${BLUE}http://localhost:3001/api-docs${NC}"
echo ""
echo -e "${GREEN}Admin Tools:${NC}"
echo -e "  Adminer (DB):    ${BLUE}http://localhost:8080${NC}"
echo -e "  Redis Commander: ${BLUE}http://localhost:8081${NC}"
echo -e "  MinIO Console:   ${BLUE}http://localhost:9001${NC}"
echo ""
echo -e "${GREEN}Default Credentials:${NC}"
echo -e "  Database:   postgres / postgres"
echo -e "  Redis:      (no auth) / redispassword"
echo -e "  MinIO:      minioadmin / minioadmin"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  View logs:       docker-compose logs -f [service]"
echo -e "  Stop services:   docker-compose down"
echo -e "  Restart service: docker-compose restart [service]"
echo -e "  Shell access:    docker-compose exec [service] sh"
echo ""

# Monitor logs (optional)
read -p "Do you want to monitor logs? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi