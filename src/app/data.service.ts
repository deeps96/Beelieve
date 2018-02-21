import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class DataService {

  private authorizationHeader: string = 'Basic YmN4MTg6YmN4MTghT3BlbjI=';
  private apiToken: string = 'db7f4e0cca344d32be72914311f1055f';
  private rootUrl: string = 'https://things.s-apps.de1.bosch-iot-cloud.com/api/1/things/';
  private thingID: string = 'bosch.xdk:3367384036162647';

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

  public getDataFromXDK(): Observable<any> {
    return this.http.get(this.rootUrl + this.thingID + '/features', this.getBasicHeader())
      .map(DataService.extractData)
      .catch(DataService.handleError)
      .map(response => {
        return {
          humidity: response.HumiditySensor_0.properties.status.sensorValue,
          temperature: response.TemperatureSensor_0.properties.status.sensorValue
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



}
