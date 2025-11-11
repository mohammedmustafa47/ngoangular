import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-adminreport',
  templateUrl: './adminreport.page.html',
  styleUrls: ['./adminreport.page.scss'],
  standalone:false
})
export class AdminreportPage implements OnInit {


  constructor() { }

  ngOnInit() {
    this.renderChart();
    // start small count-up for metric cards
    setTimeout(()=> this.startCountUp(), 60);
  }

    renderChart() {
    const ctx: any = document.getElementById('forecastChart');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{
          data: [80, 60, 75],
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

  private startCountUp() {
    const els = document.querySelectorAll<HTMLElement>('h2[data-target]');
    els.forEach(el => {
      const target = Number(el.getAttribute('data-target')) || 0;
      const duration = 900;
      const start = 0;
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * (target - start) + start);
        el.textContent = value.toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
}