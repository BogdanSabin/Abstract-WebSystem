import { Component, OnInit } from '@angular/core';
import { AnalyticsService, AnalyticsResponse } from 'src/app/services/analytics.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AnalyticsService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initSitesByNumberOfUsersChart()
      .then(() => {
        return this.initSitesByNumberOfOrdersChart()
      }).then(() => {
        return this.initSitesByNumberOfProductsChart();
      }).then(() => {
        return this.initMostOrderedProductsChart();
      })
  }

  private initSitesByNumberOfUsersChart() {
    return this.authService.getAnalytics('user')
      .then(response => {
        this.getChart(response, 'sitesByNumberOfUsers', 'users from site');
      })
  }

  private initSitesByNumberOfOrdersChart() {
    return this.authService.getAnalytics('order')
      .then(response => {
        this.getChart(response, 'sitesByNumberOfOrders', 'orders from site');
      })
  }

  private initSitesByNumberOfProductsChart() {
    return this.authService.getAnalytics('product')
      .then(response => {
        this.getChart(response, 'sitesByNumberOfProducts', 'products from site');
      })
  }

  private initMostOrderedProductsChart() {
    return this.authService.getAnalytics('mvpProduct')
      .then(response => {
        this.getChart(response, 'mostOrderedProducts', 'most ordered products');
      })
  }

  private getChart(chartData: AnalyticsResponse, chartId: string, label: string) {
    return new Chart(chartId, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData.response),
        datasets: [{
          label: `# of ${label}`,
          data: Object.values(chartData.response),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0)"
            }
          },
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0)"
            }
          }
        }
      }
    })
  }
}
