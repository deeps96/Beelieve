import { BrowserModule } from '@angular/platform-browser';
import { MaterializeModule } from 'angular2-materialize';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChartsComponent } from './charts/charts.component';
import {ChartModule} from 'angular2-chartjs';
import {DataService} from './data.service';
import {HttpModule} from '@angular/http';
import { MockedChartComponent } from './mocked-chart/mocked-chart.component';
import {MockedDataService} from './mocked-data.service';


@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    MockedChartComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    ChartModule,
    HttpModule
  ],
  providers: [DataService, MockedDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
