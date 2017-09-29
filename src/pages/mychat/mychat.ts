import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ChatPage } from '../chat/chat';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import { TranslateService } from 'ng2-translate';
import * as $ from 'jquery';

@Component({
  selector: 'page-mychat',
  templateUrl: 'mychat.html'
})

export class MychatPage {

    loading: Loading;
    public room  = [];

    public flag: any;
    public badge = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, private ev: Events, public translate: TranslateService) {
                

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
    this.navCtrl.push(SearchPage,{});
  }
  
  ionViewWillEnter()
  {
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    this.onload();
  }

  ionViewDidLoad() {
    
  }

  onload(){
    if(Global.Static_profile_id == "") {
        return;
    }
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/get_user_chatroom.php';
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        this.room = res.items;
        console.log(this.room);
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });

  }

  ongo(id, name) {
    this.navCtrl.push(ChatPage,{
        rid: id
    });
  }

  fdate(dt) {
      var months = ["","Jan", "Feb", "Mar", 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
      var ary = dt.split(' ');
      var arydate = ary[0].split('-');
      var arytime = ary[1].split(':');  console.log(ary[1]); console.log(arytime);
      var ap = "AM";
      if(arytime[0]*1 > 11) ap = "PM";
      if(arytime[0]*1 > 12) arytime[0] = arytime[0]*1 - 12;
      return months[arydate[1]*1]+' '+arydate[2]+", "+arytime[0]*1+':'+arytime[1]+' '+ap;
  }

}
