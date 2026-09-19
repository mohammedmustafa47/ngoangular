import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth.service';
import { describeHttpError } from '../shared/http-error/http-error';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.page.html',
  styleUrls: ['./super-admin-dashboard.page.scss'],
  standalone: false,
})
export class SuperAdminDashboardPage implements OnInit, OnDestroy {

  loading = true;
  error = false;
  errorMessage = '';

  totalDonations = 0;
  delivered = 0;
  successRate = 0;
  avgDeliveryHours: number | null = null;
  usersByRole: { [role: string]: number } = {};
  byArea: any[] = [];
  leaderboard: any[] = [];

  private areaIdsByName: { [name: string]: number } = {};

  private areaChart?: Chart;
  private roleChart?: Chart;

  constructor(private service: Auth, private router: Router) { }

  ngOnInit() {
    this.service.getSuperAdminAnalytics().subscribe({
      next: (data: any) => {
        this.applyData(data);
        this.loading = false;
        setTimeout(() => this.renderCharts(data), 0);
      },
      error: (err) => {
        console.error('Failed to load super-admin analytics:', err);
        this.loading = false;
        this.error = true;
        this.errorMessage = describeHttpError(err, 'load your dashboard');
      }
    });

    this.service.getAreas().subscribe({
      next: (data: any) => {
        const areas = Array.isArray(data) ? data : (data?.results ?? []);
        this.areaIdsByName = {};
        areas.forEach((a: any) => this.areaIdsByName[a.name] = a.id);
      },
      error: (err) => console.error('Failed to load areas:', err)
    });
  }

  /** Drill down into a specific area's own admin-style dashboard. */
  viewAreaDashboard(areaName: string) {
    const areaId = this.areaIdsByName[areaName];
    if (!areaId) return;
    this.router.navigate(['/super-admin-area-detail', areaId]);
  }

  ngOnDestroy(): void {
    this.areaChart?.destroy();
    this.roleChart?.destroy();
  }

  private applyData(data: any) {
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };
    this.totalDonations = (totals.pending || 0) + (totals.picked || 0) + (totals.delivered || 0) + (totals.cancelled || 0);
    this.delivered = totals.delivered || 0;
    this.successRate = this.totalDonations > 0 ? Math.round((this.delivered / this.totalDonations) * 100) : 0;
    this.avgDeliveryHours = data.avg_delivery_hours ?? null;
    this.usersByRole = data.users_by_role || {};
    this.byArea = data.by_area || [];
    this.leaderboard = data.leaderboard || [];
  }

  private renderCharts(data: any) {
    const byArea = data.by_area || [];
    const usersByRole = data.users_by_role || {};

    const aCtx: any = document.getElementById('byAreaBar');
    if (aCtx) {
      this.areaChart = new Chart(aCtx, {
        type: 'bar',
        data: {
          labels: byArea.map((a: any) => a.area),
          datasets: [
            { label: 'Delivered', data: byArea.map((a: any) => a.delivered || 0), backgroundColor: '#10b981' },
            { label: 'Pending', data: byArea.map((a: any) => a.pending || 0), backgroundColor: '#f59e0b' },
          ]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } }
      });
    }

    const rCtx: any = document.getElementById('usersByRolePie');
    if (rCtx) {
      const labels = Object.keys(usersByRole);
      this.roleChart = new Chart(rCtx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data: labels.map(l => usersByRole[l]), backgroundColor: ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'] }] },
        options: { plugins: { legend: { position: 'bottom' } } }
      });
    }
  }
}
