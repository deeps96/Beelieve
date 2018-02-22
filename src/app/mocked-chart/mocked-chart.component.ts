import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {ChartComponent} from 'angular2-chartjs';
import {Mock} from 'protractor/built/driverProviders';
import {MockedDataService} from '../mocked-data.service';

@Component({
  selector: 'app-mocked-chart',
  templateUrl: './mocked-chart.component.html',
  styleUrls: ['./mocked-chart.component.css']
})
export class MockedChartComponent implements OnInit {

  @ViewChild('chart') private chart: ChartComponent;

  public chartData: any;
  private timer: any;
  private updateSubscription: Subscription;

  constructor(private mockedDataService: MockedDataService) {
    this.timer = Observable.timer(0, 500);
    this.initChartData();
  }

  ngOnInit() {
    this.addUpdateListener();
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code == 'KeyP') {
      if (this.updateSubscription.closed) {
        this.addUpdateListener();
      } else {
        this.updateSubscription.unsubscribe();
      }
    }
  }

  private addUpdateListener() {
    this.updateSubscription = this.timer.subscribe(time =>
      this.mockedDataService.getMockData().subscribe(response => {
        this.addWeightData({
          label: MockedChartComponent.getPrettyTime(new Date()),
          data: response.weight
        });
      })
    );
  }

  private static getPrettyTime(time: Date): string {
    return ("0" + time.getHours()).slice(-2)   + ":" +
      ("0" + time.getMinutes()).slice(-2) + ":" +
      ("0" + time.getSeconds()).slice(-2);
  }

  private addWeightData(data: any): void {
    this.chart.chart.data.labels.push(data.label);
    this.chart.chart.data.datasets[0].data.push(data.weight);
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
            label: 'Weight',
            data: [],
            borderColor: 'rgba(255, 0, 0, 0.3)',
            backgroundColor: 'rgba(0, 0, 0, 0.0)'
          },
          {
            label: 'Count',
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
              min: 0
            }
          }]
        }
      }
    }
  }
}