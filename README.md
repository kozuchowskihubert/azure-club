# Clubbasse.pl - Azure Portfolio Platform

Modern e-commerce portfolio platform for selling components with image galleries, built on Azure infrastructure.

## 🚀 Overview

Clubbasse.pl is a scalable, cloud-native portfolio and e-commerce platform designed to showcase and sell electronic components. Built with modern web technologies and deployed on Microsoft Azure with full CI/CD automation.

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Next.js 14** for SSR/SSG
- **TailwindCSS** for styling
- **Shadcn/ui** component library
- **React Query** for data fetching
- **Zustand** for state management

### Backend
- **Node.js 20 LTS** with Express
- **TypeScript** for type safety
- **Prisma ORM** for database access
- **Azure Functions** for serverless compute
- **Azure App Service** for API hosting

### Database & Storage
- **Azure SQL Database** for relational data
- **Azure Blob Storage** for images/assets
- **Azure CDN** for content delivery
- **Redis Cache** for session/cache management

### DevOps & Infrastructure
- **Terraform** for Infrastructure as Code
- **GitHub Actions** for CI/CD
- **Docker** for containerization
- **Azure Container Registry** for image storage

### Monitoring & Observability
- **Azure Application Insights** for APM
- **Azure Monitor** for metrics & logs
- **Azure Log Analytics** for log aggregation
- **Grafana** for custom dashboards
- **Sentry** for error tracking

## 📁 Project Structure

```
azure-club/
├── .github/
│   └── workflows/           # GitHub Actions CI/CD pipelines
├── terraform/
│   ├── modules/            # Reusable Terraform modules
│   ├── environments/       # Environment-specific configs
│   └── main.tf             # Root Terraform configuration
├── src/
│   ├── frontend/           # Next.js application
│   ├── backend/            # Node.js API
│   └── functions/          # Azure Functions
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── monitoring/
│   ├── dashboards/         # Grafana dashboards
│   └── alerts/             # Alert configurations
├── scripts/                # Deployment & utility scripts
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Azure CLI
- Terraform 1.6+
- GitHub account

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/clubbasse-pl.git
cd clubbasse-pl

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development environment
docker-compose up -d

# Run frontend
cd src/frontend
npm run dev

# Run backend
cd src/backend
npm run dev
```

### Deployment

```bash
# Initialize Terraform
cd terraform
terraform init

# Plan infrastructure changes
terraform plan -var-file="environments/production.tfvars"

# Apply infrastructure
terraform apply -var-file="environments/production.tfvars"

# Deploy via GitHub Actions (automatic on push to main)
git push origin main
```

## 🔐 Security

- Azure Key Vault for secrets management
- Managed Identity for Azure resource access
- SSL/TLS encryption for all communications
- CORS and CSP policies configured
- Rate limiting and DDoS protection via Azure WAF

## 📊 Monitoring

- Real-time application performance monitoring
- Automated alerting for critical issues
- Custom dashboards for business metrics
- Log aggregation and analysis
- Cost monitoring and optimization alerts

## 🌍 Environments

- **Development**: Dev environment with debug features
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributing

See CONTRIBUTING.md for guidelines

## 📧 Contact

For questions or support, contact: admin@clubbasse.pl
