import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Auth } from '../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-vdashboard',
  templateUrl: './vdashboard.page.html',
  styleUrls: ['./vdashboard.page.scss'],
  standalone:false,
})
export class VdashboardPage implements OnInit, AfterViewInit {

  constructor(private service:Auth) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
      this.startCountUp();
    }, 50);
  }

  private initCharts() {
    const pCtx: any = document.getElementById('pickupsLine');
    if (pCtx) {
      new Chart(pCtx, {
        type: 'line',
        data: { labels: ['W1','W2','W3','W4','W5','W6'], datasets: [{ label:'Pickups', data:[2,3,4,5,6,4], borderColor:'#06b6d4', backgroundColor:'rgba(59,130,246,0.06)', tension:0.35, fill:true, pointRadius:0 }] },
        options: { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ display:true }, y:{ display:false } } }
      });
    }

    const cCtx: any = document.getElementById('completionPie');
    if (cCtx) {
      new Chart(cCtx, { type:'doughnut', data:{ labels:['Completed','Missed'], datasets:[{ data:[75,25], backgroundColor:['#10b981','#f97316'] }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
    }

    const hCtx: any = document.getElementById('hoursBar');
    if (hCtx) {
      new Chart(hCtx, { type:'bar', data:{ labels:['Mon','Tue','Wed','Thu','Fri','Sat'], datasets:[{ data:[2,4,3,5,6,4], backgroundColor:'#7c3aed' }] }, options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ display:false } } } });
    }
  }

  private startCountUp() {
    const els = document.querySelectorAll<HTMLElement>('.kpi-value[data-target]');
    els.forEach(el => {
      const target = Number(el.getAttribute('data-target')) || 0;
      const text = el.textContent || '';
      const isPercent = text.includes('%');
      const suffix = isPercent ? '%' : '';
      const duration = 900;
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

}
