import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from '../services/auth.service';
import { describeHttpError } from '../shared/http-error/http-error';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.page.html',
  styleUrls: ['./admindashboard.page.scss'],
  standalone:false,
})
export class AdmindashboardPage implements OnInit, OnDestroy {

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
  myArea: any = null;

  private lineChart?: Chart;
  private statusChart?: Chart;
  private leaderboardChart?: Chart;

  constructor(private service: Auth) { }

  ngOnInit() {
    this.service.getAreaAdminAnalytics().subscribe({
      next: (data: any) => {
        this.applyData(data);
        this.loading = false;
        this.loadMyArea(data.area);
        setTimeout(() => this.initCharts(data), 0);
      },
      error: (err) => {
        console.error('Failed to load area-admin analytics:', err);
        this.loading = false;
        this.error = true;
        this.errorMessage = describeHttpError(err, 'load your dashboard');
      }
    });
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
    this.statusChart?.destroy();
    this.leaderboardChart?.destroy();
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

  /** Read-only "My Area" info card — resolves the area name from analytics into the full area object (pincodes, is_active). */
  private loadMyArea(area: any) {
    if (!area || area === 'pending') return;
    if (typeof area === 'object') {
      this.myArea = area;
      return;
    }
    this.service.getAreas().subscribe({
      next: (data: any) => {
        const areas = Array.isArray(data) ? data : (data?.results ?? []);
        this.myArea = areas.find((a: any) => a.name === area) || null;
      },
      error: (err) => console.error('Failed to load area info:', err)
    });
  }

  private initCharts(data: any) {
    const timeseries = data.timeseries || [];
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };
    const leaderboard = data.leaderboard || [];

    const dCtx: any = document.getElementById('donationsLine');
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
        options: { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ display:true }, y:{ display:false } } }
      });
    }

    const pCtx: any = document.getElementById('categoryPie');
    if (pCtx) {
      this.statusChart = new Chart(pCtx, {
        type: 'doughnut',
        data: { labels:['Pending','Picked','Delivered','Cancelled'], datasets:[{ data:[totals.pending || 0, totals.picked || 0, totals.delivered || 0, totals.cancelled || 0], backgroundColor:['#f59e0b','#8b5cf6','#10b981','#ef4444'] }] },
        options:{ plugins:{ legend:{ position:'bottom' } } }
      });
    }

    const vCtx: any = document.getElementById('volunteerBar');
    if (vCtx) {
      this.leaderboardChart = new Chart(vCtx, {
        type: 'bar',
        data: { labels: leaderboard.map((l: any) => l.username), datasets:[{ label: 'Delivered', data: leaderboard.map((l: any) => l.delivered), backgroundColor:'#7c3aed' }] },
        options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ display:false } } }
      });
    }
  }

}
