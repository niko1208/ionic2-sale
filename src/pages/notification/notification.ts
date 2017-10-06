import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading, Events } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ChatPage } from '../chat/chat';
import { ProfilePage } from './../profile/profile';
import { MyprofilePage } from './../myprofile/myprofile';
import { Service } from '../../providers/service';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import { TranslateService } from 'ng2-translate';
import * as $ from 'jquery';

@Component({
  selector: 'page-notifiation',
  templateUrl: 'notification.html'
})

export class MynotificationPage {

    loading: Loading;
    public room  = [];

    public flag: any;
    public badge = '0';
    public ss = [];
    public keys = [];
    lang:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, sv:Service, private ev: Events, public translate: TranslateService) {
                
    this.flag = Global.flag;
    
    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    this.lang = Global.Static_lang;
  }

  gotonotification() {
    this.navCtrl.push(MynotificationPage);
  }
  gotoprofile() {
    this.navCtrl.push(MorePage);
  }
  gotosearch(){
    this.navCtrl.push(SearchPage,{});
  }
  
  ionViewWillEnter()
  {
    this.lang = Global.Static_lang;
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    this.onload();
  }

  ionViewDidLoad() {
    
  }

  clear() {
    var temp_url = 'http://sale4allz.com/ws/clear_notification.php';
    var Form_data = new FormData();
    
    Form_data.append('id', Global.devicetoken);
    Form_data.append('pid', Global.Static_profile_id);
    Form_data.append('number', Global.Static_number);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
      this.keys = [];
      Global.badge = "0";
      this.badge = "0";
    }, error => {
    });
  }

  onload(){
    var temp_url = 'http://sale4allz.com/ws/get_notification.php';
    var Form_data = new FormData();
    
    Form_data.append('id', Global.devicetoken);
    Form_data.append('pid', Global.Static_profile_id);
    Form_data.append('number', Global.Static_number);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.keys = res['items'];
        Global.badge = res['num']; 
        this.ev.publish('badge', Global.badge);
    }, error => {
        
    });
  }

  goto(type,pid,id) {
    var temp_url = 'http://sale4allz.com/ws/read_notification.php';
    var Form_data = new FormData();
    
    Form_data.append('id', id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        if(1 || type == 'follow' || type == 'bidprice') {
          if(pid == Global.Static_profile_id) {
            this.navCtrl.push(MyprofilePage,{});
          } else {
            this.navCtrl.push(ProfilePage,{
              profile_id: pid
            });
          }
        }
        var temp_url = 'http://sale4allz.com/ws/get_notification.php';
        var Form_data = new FormData();
        Form_data.append('id', Global.devicetoken);
        Form_data.append('pid', Global.Static_profile_id);
        Form_data.append('number', Global.Static_number);
        this._http.post(temp_url, Form_data).map(res =>res.json())
        .subscribe(res => {
            Global.badge = res['num']; 
            this.ev.publish('badge', Global.badge);
        }, error => {
        });
    }, error => {
        
    });
    
  }

}
