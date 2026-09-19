import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from '../services/auth.service';
import { describeHttpError } from '../shared/http-error/http-error';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-adminreport',
  templateUrl: './adminreport.page.html',
  styleUrls: ['./adminreport.page.scss'],
  standalone:false
})
export class AdminreportPage implements OnInit, OnDestroy {

  loading = true;
  error = false;
  errorMessage = '';

  totalDonations = 0;
  totalDonors = 0;
  totalVolunteers = 0;
  delivered = 0;
  successRate = 0;
  avgDeliveryHours: number | null = null;
  topVolunteer: { username: string; delivered: number } | null = null;

  private chart?: Chart;

  constructor(private service: Auth) { }

  ngOnInit() {
    this.service.getAreaAdminAnalytics().subscribe({
      next: (data: any) => {
        this.applyData(data);
        this.loading = false;
        setTimeout(() => this.renderChart(data), 0);
      },
      error: (err) => {
        console.error('Failed to load area-admin analytics:', err);
        this.loading = false;
        this.error = true;
        this.errorMessage = describeHttpError(err, 'load your reports');
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private applyData(data: any) {
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };
    this.totalDonations = (totals.pending || 0) + (totals.picked || 0) + (totals.delivered || 0) + (totals.cancelled || 0);
    this.delivered = totals.delivered || 0;
    this.successRate = this.totalDonations > 0 ? Math.round((this.delivered / this.totalDonations) * 100) : 0;
    const usersByRole = data.users_by_role || {};
    this.totalDonors = usersByRole.donor || 0;
    this.totalVolunteers = usersByRole.volunteer || 0;
    this.avgDeliveryHours = data.avg_delivery_hours ?? null;
    const leaderboard = data.leaderboard || [];
    this.topVolunteer = leaderboard.length > 0 ? leaderboard[0] : null;
  }

  private renderChart(data: any) {
    const timeseries = data.timeseries || [];
    const ctx: any = document.getElementById('forecastChart');
    if (!ctx) return;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeseries.map((t: any) => t.date),
        datasets: [{
          label: 'Donations',
          data: timeseries.map((t: any) => t.count),
          borderColor: '#3b82f6',
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: { ticks: { color: '#fff' } }
        }
      }
    });
  }
}
