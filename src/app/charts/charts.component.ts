import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartComponent} from 'angular2-chartjs';
import {Observable} from 'rxjs/Observable';
import {DataService} from '../data.service';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/combineLatest';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @ViewChild('chart') private chart: ChartComponent;

  public chartData: any;

  constructor(private dataService: DataService) {
    this.initChartData();
  }

  ngOnInit() {
    Observable.timer(0, 500).subscribe(time =>
      Observable.zip(
          this.dataService.getHumidityInPercent(),
          this.dataService.getTemperatureInCel()
      ).catch(DataService.handleError).subscribe(response => {
        this.addData({
          label: ChartsComponent.getPrettyTime(new Date()),
          data: {
            humidity: response[0],
            temperature: response[1]
          }
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
    this.chart.chart.update(0);
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
            data: []
          },
          {
            label: 'Temperature',
            data: []
          }
        ]
      },
      options: {
        elements: {
          line: {
            tension: 0, // disables bezier curves
          }
        }
      }
    }
  }

}
