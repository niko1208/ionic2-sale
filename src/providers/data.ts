import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {

  public items : any;
  constructor(public http: Http) {

  }

  filterItems(searchTerm) {
    return this.items.filter((item)=> {
      return item['post_title'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    })
  }

}
