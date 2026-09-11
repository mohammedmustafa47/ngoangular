import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from '../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-donordashboard',
  templateUrl: './donordashboard.page.html',
  styleUrls: ['./donordashboard.page.scss'],
  standalone:false,
})
export class DonordashboardPage implements OnInit, OnDestroy {

  loading = true;
  error = false;

  totalDonations = 0;
  delivered = 0;
  inProgress = 0;
  fulfillmentRate = 0;
  itemsDonated = 0;

  private lineChart?: Chart;
  private statusChart?: Chart;

  constructor(private service: Auth) { }

  ngOnInit() {
    this.service.getDonorAnalytics().subscribe({
      next: (data: any) => {
        this.applyData(data);
        this.loading = false;
        setTimeout(() => this.renderCharts(data), 0);
      },
      error: (err) => {
        console.error('Failed to load donor analytics:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
    this.statusChart?.destroy();
  }

  private applyData(data: any) {
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };
    this.totalDonations = (totals.pending || 0) + (totals.picked || 0) + (totals.delivered || 0) + (totals.cancelled || 0);
    this.delivered = totals.delivered || 0;
    this.inProgress = totals.picked || 0;
    this.fulfillmentRate = this.totalDonations > 0 ? Math.round((this.delivered / this.totalDonations) * 100) : 0;
    this.itemsDonated = data.total_items_donated || 0;
  }

  private renderCharts(data: any) {
    const timeseries = data.timeseries || [];
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };

    const dCtx: any = document.getElementById('donorDonationsLine');
    if (dCtx) {
      this.lineChart = new Chart(dCtx, {
        type: 'line',
        data: {
          labels: timeseries.map((t: any) => t.date),
          datasets: [{ label: 'Donations', data: timeseries.map((t: any) => t.count), borderColor: '#06b6d4', backgroundColor: 'rgba(59,130,246,0.08)', tension:0.35, fill:true, pointRadius:0 }]
        },
        options: { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ display:true }, y:{ display:false } } }
      });
    }

    const pCtx: any = document.getElementById('donorCategoryPie');
    if (pCtx) {
      this.statusChart = new Chart(pCtx, {
        type: 'doughnut',
        data: {
          labels: ['Pending', 'Picked', 'Delivered', 'Cancelled'],
          datasets: [{ data: [totals.pending || 0, totals.picked || 0, totals.delivered || 0, totals.cancelled || 0], backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444'] }]
        },
        options:{ plugins:{ legend:{ position:'bottom' } } }
      });
    }
  }

}
