# Monitoring and Alerting Configuration

## Overview

This directory contains monitoring dashboards and alert configurations for Clubbasse.pl infrastructure.

## Components

### Grafana Dashboards

Located in `dashboards/`:

1. **app-performance.json** - Application performance metrics
   - CPU and memory usage
   - Response times
   - Request rates
   - Error rates

2. **infrastructure.json** - Infrastructure health
   - Database performance
   - Redis cache metrics
   - Storage account metrics
   - Network traffic

3. **business-metrics.json** - Business KPIs
   - User activity
   - Sales metrics
   - Image upload statistics
   - Component catalog views

### Azure Monitor Alerts

Configured in Terraform (`terraform/modules/monitoring/`):

- **High CPU Usage**: Triggers when App Service CPU > 80%
- **High Memory Usage**: Triggers when memory > 80%
- **Slow Response Time**: Triggers when avg response time > 3s
- **Database DTU**: Triggers when database DTU > 80%
- **Storage Availability**: Triggers when availability < 99%

## Accessing Dashboards

### Azure Portal

1. Navigate to Azure Portal
2. Go to Application Insights: `clubbasse-{env}-appinsights`
3. View built-in metrics and custom dashboards

### Grafana

1. Access Grafana instance (if deployed)
2. Import dashboards from `dashboards/` directory
3. Configure Azure Monitor data source

## Alert Notifications

Alerts are sent to:
- Email: Configured in `terraform/environments/{env}.tfvars`
- Teams/Slack: Configure webhooks in Azure Action Groups
- PagerDuty: For production critical alerts

## Custom Metrics

### Application Insights

Track custom events:

```javascript
import { ApplicationInsights } from '@azure/monitor-opentelemetry';

const appInsights = new ApplicationInsights({
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
});

// Track custom event
appInsights.trackEvent({
  name: 'ComponentPurchased',
  properties: {
    componentId: '123',
    price: 99.99
  }
});
```

### Log Analytics Queries

Common queries:

```kusto
// Error rate over time
requests
| where timestamp > ago(1h)
| summarize ErrorRate = countif(success == false) * 100.0 / count() by bin(timestamp, 5m)

// Top slow requests
requests
| where timestamp > ago(1h)
| top 10 by duration desc
| project timestamp, name, duration, resultCode

// Database query performance
dependencies
| where type == "SQL"
| summarize avg(duration), percentile(duration, 95) by name
```

## Metrics to Monitor

### Performance
- Response time (p50, p95, p99)
- Request rate
- Error rate
- Database query time
- Cache hit rate

### Availability
- Uptime percentage
- Failed requests
- Health check status

### Business
- Active users
- Transactions per minute
- Image uploads
- Component views

### Infrastructure
- CPU utilization
- Memory usage
- Disk I/O
- Network throughput
- Database connections

## Setting Up Alerts

### Via Terraform

Alerts are automatically created when deploying infrastructure:

```bash
cd terraform
terraform apply -var-file="environments/prod.tfvars"
```

### Manual Configuration

1. Go to Azure Portal → Monitor → Alerts
2. Create new alert rule
3. Select resource and metric
4. Define threshold
5. Add action group
6. Save and enable

## Cost Optimization

Monitor costs with Azure Cost Management:

1. Set budget alerts
2. Review resource utilization
3. Identify unused resources
4. Optimize SKUs based on metrics

## Troubleshooting

### High Alert Noise

- Adjust thresholds in `terraform/modules/monitoring/main.tf`
- Increase alert window size
- Add severity levels

### Missing Metrics

- Verify Application Insights is enabled
- Check connection strings
- Ensure SDK is properly initialized

### Dashboard Not Loading

- Verify Grafana data source configuration
- Check Azure Monitor permissions
- Validate JSON dashboard syntax
