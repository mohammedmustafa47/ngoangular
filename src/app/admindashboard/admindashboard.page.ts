import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Auth } from '../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.page.html',
  styleUrls: ['./admindashboard.page.scss'],
  standalone:false,
})
export class AdmindashboardPage implements OnInit, AfterViewInit {

  constructor(private service: Auth) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // small delay to ensure canvases are present
    setTimeout(() => {
      this.initCharts();
      this.startCountUp();
    }, 50);
  }

  private initCharts() {
    // Donations over time - line
    const dCtx: any = document.getElementById('donationsLine');
    if (dCtx) {
      new Chart(dCtx, {
        type: 'line',
        data: {
          labels: ['May','Jun','Jul','Aug','Sep','Oct'],
          datasets: [{
            label: 'Donations',
            data: [320, 410, 360, 480, 520, 610],
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

    // Category pie
    const pCtx: any = document.getElementById('categoryPie');
    if (pCtx) {
      new Chart(pCtx, {
        type: 'doughnut',
        data: { labels:['Cooked','Groceries','Packed'], datasets:[{ data:[45,30,25], backgroundColor:['#8b5cf6','#06b6d4','#f59e0b'] }] },
        options:{ plugins:{ legend:{ position:'bottom' } } }
      });
    }

    // Volunteer bar
    const vCtx: any = document.getElementById('volunteerBar');
    if (vCtx) {
      new Chart(vCtx, {
        type: 'bar',
        data: { labels:['Mon','Tue','Wed','Thu','Fri','Sat'], datasets:[{ data:[12,18,9,14,16,20], backgroundColor:'#7c3aed' }] },
        options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ display:false } } }
      });
    }
  }

  private startCountUp() {
    const els = document.querySelectorAll<HTMLElement>('.kpi-value[data-target]');
    els.forEach(el => {
      const target = Number(el.getAttribute('data-target')) || 0;
      const isPercent = el.textContent?.includes('%');
      const suffix = isPercent ? '%' : (el.textContent?.match(/[a-zA-Z]+$/) || [''])[0];
      const duration = 1000;
      const start = 0;
      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * (target - start) + start);
        // format with commas for thousands
        el.textContent = value.toLocaleString() + (suffix || (isPercent ? '%' : ''));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

}

