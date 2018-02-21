import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class MockedDataService {

  private mockWeight: number[] = [

  ];

  private index: number = 0;

  constructor() { }

  public getMockData(): Observable<any> {
    if (this.index < this.mockWeight.length - 1) {
      this.index++;
    } else {
      this.index = 0;
    }
    return Observable.of({
      weight: this.mockWeight[this.index]
    });
  }
}
