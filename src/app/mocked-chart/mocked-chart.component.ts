import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {ChartComponent} from 'angular2-chartjs';

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

  constructor(private dataService: DataService) {
    this.timer = Observable.timer(0, 2000);
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
      this.dataService.getCountAndWeight().subscribe(response => {
        this.addData({
          label: MockedChartComponent.getPrettyTime(new Date()),
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
    this.chart.chart.data.datasets[0].data.push(data.data.weight);
    this.chart.chart.data.datasets[1].data.push(data.data.count);
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
            label: 'Weight, kg',
            data: [],
            borderColor: 'rgba(238, 110, 133, 1)',
            backgroundColor: 'rgba(238, 110, 133, 1)',
            fill: false,
            yAxisID: "y-axis-1"
          },
          {
            label: 'Count',
            data: [],
            borderColor: 'rgba(83, 162, 229, 1)',
            backgroundColor: 'rgba(83, 162, 229, 1)',
            fill: false,
            yAxisID: "y-axis-2"
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
            id: "y-axis-1",
            scaleLabel: {
              display: true,
              labelString: 'Weight',
              fontSize: 12,
            },
            type: "linear",
            position: "left",
            ticks: {
              min: 38,
              max: 45
            }
          },{
            id: "y-axis-2",
            scaleLabel: {
              display: true,
              labelString: 'Count',
              fontSize: 12,
            },
            type: "linear",
            position: "right",
            ticks: {
              min: 0,
              max: 10
            }
          }]
        }
      }
    }
  }
}
