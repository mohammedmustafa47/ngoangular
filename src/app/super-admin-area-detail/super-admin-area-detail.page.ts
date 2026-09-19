import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../services/auth.service';
import { describeHttpError } from '../shared/http-error/http-error';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-super-admin-area-detail',
  templateUrl: './super-admin-area-detail.page.html',
  styleUrls: ['./super-admin-area-detail.page.scss'],
  standalone: false,
})
export class SuperAdminAreaDetailPage implements OnInit, OnDestroy {

  loading = true;
  error = false;
  errorMessage = '';

  areaName = '';
  totalDonations = 0;
  delivered = 0;
  successRate = 0;
  avgDeliveryHours: number | null = null;
  leaderboard: any[] = [];

  private lineChart?: Chart;
  private statusChart?: Chart;

  constructor(private route: ActivatedRoute, private service: Auth) { }

  ngOnInit() {
    const areaId = this.route.snapshot.paramMap.get('areaId');
    if (!areaId) {
      this.loading = false;
      this.error = true;
      return;
    }

    this.service.getAreaAdminAnalytics(areaId).subscribe({
      next: (data: any) => {
        this.applyData(data);
        this.loading = false;
        setTimeout(() => this.initCharts(data), 0);
      },
      error: (err) => {
        console.error('Failed to load area analytics:', err);
        this.loading = false;
        this.error = true;
        this.errorMessage = describeHttpError(err, 'load this area\'s dashboard');
      }
    });
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
    this.statusChart?.destroy();
  }

  private applyData(data: any) {
    this.areaName = data.area || '';
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };
    this.totalDonations = (totals.pending || 0) + (totals.picked || 0) + (totals.delivered || 0) + (totals.cancelled || 0);
    this.delivered = totals.delivered || 0;
    this.successRate = this.totalDonations > 0 ? Math.round((this.delivered / this.totalDonations) * 100) : 0;
    this.avgDeliveryHours = data.avg_delivery_hours ?? null;
    this.leaderboard = data.leaderboard || [];
  }

  private initCharts(data: any) {
    const timeseries = data.timeseries || [];
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };

    const dCtx: any = document.getElementById('areaDonationsLine');
    if (dCtx) {
      this.lineChart = new Chart(dCtx, {
        type: 'line',
        data: {
          labels: timeseries.map((t: any) => t.date),
          datasets: [{
            label: 'Donations',
            data: timeseries.map((t: any) => t.count),
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(59,130,246,0.08)',
            tension: 0.35,
            fill: true,
            pointRadius: 0
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { display: true }, y: { display: false } } }
      });
    }

    const pCtx: any = document.getElementById('areaStatusPie');
    if (pCtx) {
      this.statusChart = new Chart(pCtx, {
        type: 'doughnut',
        data: {
          labels: ['Pending', 'Picked', 'Delivered', 'Cancelled'],
          datasets: [{ data: [totals.pending || 0, totals.picked || 0, totals.delivered || 0, totals.cancelled || 0], backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444'] }]
        },
        options: { plugins: { legend: { position: 'bottom' } } }
      });
    }
  }

}
