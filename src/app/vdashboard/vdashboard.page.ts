import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from '../services/auth.service';
import { describeHttpError } from '../shared/http-error/http-error';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-vdashboard',
  templateUrl: './vdashboard.page.html',
  styleUrls: ['./vdashboard.page.scss'],
  standalone:false,
})
export class VdashboardPage implements OnInit, OnDestroy {

  loading = true;
  error = false;
  errorMessage = '';

  assigned = 0;
  completed = 0;
  cancelled = 0;
  successRate = 0;
  avgDeliveryHours: number | null = null;

  private lineChart?: Chart;
  private completionChart?: Chart;
  private statusChart?: Chart;

  constructor(private service: Auth) { }

  ngOnInit() {
    this.service.getVolunteerAnalytics().subscribe({
      next: (data: any) => {
        this.applyData(data);
        this.loading = false;
        setTimeout(() => this.renderCharts(data), 0);
      },
      error: (err) => {
        console.error('Failed to load volunteer analytics:', err);
        this.loading = false;
        this.error = true;
        this.errorMessage = describeHttpError(err, 'load your dashboard');
      }
    });
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
    this.completionChart?.destroy();
    this.statusChart?.destroy();
  }

  private applyData(data: any) {
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };
    this.assigned = totals.picked || 0;
    this.completed = totals.delivered || 0;
    this.cancelled = totals.cancelled || 0;
    const denom = this.completed + this.cancelled;
    this.successRate = denom > 0 ? Math.round((this.completed / denom) * 100) : 0;
    this.avgDeliveryHours = data.avg_delivery_hours ?? null;
  }

  private renderCharts(data: any) {
    const timeseries = data.timeseries || [];
    const totals = data.totals || { pending: 0, picked: 0, delivered: 0, cancelled: 0 };

    const pCtx: any = document.getElementById('pickupsLine');
    if (pCtx) {
      this.lineChart = new Chart(pCtx, {
        type: 'line',
        data: { labels: timeseries.map((t: any) => t.date), datasets: [{ label:'Delivered', data: timeseries.map((t: any) => t.count), borderColor:'#06b6d4', backgroundColor:'rgba(59,130,246,0.06)', tension:0.35, fill:true, pointRadius:0 }] },
        options: { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ display:true }, y:{ display:false } } }
      });
    }

    const cCtx: any = document.getElementById('completionPie');
    if (cCtx) {
      this.completionChart = new Chart(cCtx, { type:'doughnut', data:{ labels:['Completed','Cancelled'], datasets:[{ data:[this.completed, this.cancelled], backgroundColor:['#10b981','#f97316'] }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
    }

    const hCtx: any = document.getElementById('hoursBar');
    if (hCtx) {
      this.statusChart = new Chart(hCtx, { type:'bar', data:{ labels:['Picked','Delivered','Cancelled'], datasets:[{ data:[totals.picked || 0, totals.delivered || 0, totals.cancelled || 0], backgroundColor:'#7c3aed' }] }, options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ display:false } } } });
    }
  }

}
