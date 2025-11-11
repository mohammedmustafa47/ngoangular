import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Auth } from '../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-donordashboard',
  templateUrl: './donordashboard.page.html',
  styleUrls: ['./donordashboard.page.scss'],
  standalone:false,
})
export class DonordashboardPage implements OnInit, AfterViewInit {

  constructor(private service:Auth) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // small delay to ensure canvases are present
    setTimeout(() => this.initCharts(), 50);
  }

  private initCharts() {
    const dCtx: any = document.getElementById('donorDonationsLine');
    if (dCtx) {
      new Chart(dCtx, {
        type: 'line',
        data: {
          labels: ['May','Jun','Jul','Aug','Sep','Oct'],
          datasets: [{ label: 'Donations', data: [20, 28, 24, 36, 40, 48], borderColor: '#06b6d4', backgroundColor: 'rgba(59,130,246,0.08)', tension:0.35, fill:true, pointRadius:0 }]
        },
        options: { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ display:true }, y:{ display:false } } }
      });
    }

    const pCtx: any = document.getElementById('donorCategoryPie');
    if (pCtx) {
      new Chart(pCtx, { type:'doughnut', data:{ labels:['Cooked','Groceries','Packed'], datasets:[{ data:[45,30,25], backgroundColor:['#8b5cf6','#06b6d4','#f59e0b'] }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
    }
  }

}
