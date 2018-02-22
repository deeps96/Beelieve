import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/of';

@Injectable()
export class DataService {

  private authorizationHeader: string = 'Basic YmN4MTg6YmN4MTghT3BlbjI=';
  private apiToken: string = 'db7f4e0cca344d32be72914311f1055f';
  private rootUrl: string = 'https://things.s-apps.de1.bosch-iot-cloud.com/api/1/things/';
  private thingID: string = 'bosch.xdk:3367384036162647';

  private currentCount: number = 0;
  private currentWeight: number = 40;
  private index: number = 100;

  constructor(private http: Http) { }

  public static extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  public static handleError(error: any) {
    const errMsg = (error.message) ? error.message : (error._body) ? JSON.parse(error._body).message : 'Server error';
    console.error(errMsg);
    return error;
  }

  public incrementCount(): void {
    this.currentCount++;
  }

  public getCountAndWeightAndVolume(): Observable<any> {
    if (this.index == 100) {
      this.index = 0;
    } else {
      this.index += 2;
    }
    return Observable.of({
      weight: this.calculateWeightForIndex(),
      count: this.currentCount,
      volume: this.calculateVolumeForIndex()
    })
  }

  private calculateWeightForIndex(): number {
    this.currentWeight -= (this.index < 33) ? 0.006 : -0.002;
    return this.currentWeight;
  }

  public getDataFromXDK(): Observable<any> {
    return this.http.get(this.rootUrl + this.thingID + '/features', this.getBasicHeader())
      .map(DataService.extractData)
      .catch(DataService.handleError)
      .map(response => {
        return {
          humidity: response.HumiditySensor_0.properties.status.sensorValue,
          temperature: response.TemperatureSensor_0.properties.status.sensorValue,
          brightness: response.IlluminanceSensor_0.properties.status.sensorValue
        };
      });
  }

  private getBasicHeader(): RequestOptions{
    let headers = new Headers({
      'Authorization': this.authorizationHeader,
      'x-cr-api-token': this.apiToken
    });
    return new RequestOptions({headers: headers});
  }


  private calculateVolumeForIndex(): number {
    return (this.index < 34) ? 70 : 40;
  }
}
