import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the Service provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Service {

  posts : any = [];
  public badgenum = '0';
  public info_cls = "l";
  public lang = 'en';

  constructor(public http: Http) {
    console.log('Hello Service Provider');

    //this.posts = null;
  }

  load() {
    //console.log('json called');
    return this.http.get("data/categories.json").map((response:Response)=>
            response.json());
}

}
