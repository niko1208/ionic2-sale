import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading, Platform } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { Events } from 'ionic-angular';
import {MorePage} from '../more/more';
import * as $ from 'jquery';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

    public flag: any;
    public badge = '0';

    loading: Loading;

    public keys : any;

    public searchTerm = "";


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, platform:Platform, private ev: Events) {
                
    this.flag = Global.flag;
    
    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    
  }

  gotonotification() {
    this.navCtrl.push(MynotificationPage);
  }
  gotoprofile() {
    this.navCtrl.push(MorePage);
  }
  gotosearch(){
    
  }
  
  ionViewWillEnter()
  {

    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
  }

  goprofile(pid) { 
      this.navCtrl.push(ProfilePage,{
        profile_id: pid
      });
  }
  
  setFilteredItems() {
    
  }

  search(){
      
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/get_user_search.php';
    var Form_data = new FormData();
    var str = this.searchTerm;
    Form_data.append('str', str);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        this.keys = res["items"];
        
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }


}