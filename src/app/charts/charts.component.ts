import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ChartComponent} from 'angular2-chartjs';
import {Observable} from 'rxjs/Observable';
import {DataService} from '../data.service';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/combineLatest';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @ViewChild('chart') private chart: ChartComponent;

  public chartData: any;
  private timer: any;
  private updateSubscription: Subscription;

  constructor(private dataService: DataService) {
    this.timer = Observable.timer(0, 500);
    this.initChartData();
  }

  ngOnInit() {
    this.addUpdateListener();
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code == 'Space') {
      if (this.updateSubscription.closed) {
        this.addUpdateListener();
      } else {
        this.updateSubscription.unsubscribe();
      }
    }
  }

  private addUpdateListener() {
    this.updateSubscription = this.timer.subscribe(time =>
      this.dataService.getDataFromXDK().subscribe(response => {
        this.addData({
          label: ChartsComponent.getPrettyTime(new Date()),
          data: response
        });
      })
    );
  }

  private static getPrettyTime(time: Date): string {
    return ("0" + time.getHours()).slice(-2)   + ":" +
           ("0" + time.getMinutes()).slice(-2) + ":" +
           ("0" + time.getSeconds()).slice(-2);
  }

  private addData(data: any): void {
    this.chart.chart.data.labels.push(data.label);
    this.chart.chart.data.datasets[0].data.push(data.data.humidity);
    this.chart.chart.data.datasets[1].data.push(data.data.temperature);
    this.chart.chart.update();
  }

  //actions
  private initChartData(): void {
    this.chartData = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Humidity',
            data: [],
            borderColor: 'rgba(255, 0, 0, 0.3)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)'
          },
          {
            label: 'Temperature',
            data: [],
            borderColor: 'rgba(0, 255, 0, 0.3)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)'
          }
        ]
      },
      options: {
        animation: {
          duration: 0, // general animation time
        },
        elements: {
          line: {
            tension: 0, // disables bezier curves
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100
            }
          },{
            ticks: {
              beginAtZero: true,
              min: -20,
              max: 100
            }
          }]
        }
      }
    }
  }

}
