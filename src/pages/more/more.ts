import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { LoginPage } from '../login/login';
import { PostPage } from '../post/post';
import { FavoritePage } from '../favorite/favorite';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { Http } from '@angular/http';
import { Events, Platform } from 'ionic-angular';
import { SearchPage } from './../search/search';
import { TranslateService } from 'ng2-translate';
import { Service } from './../../providers/service';
import * as $ from 'jquery';

@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {

 items : String[];
 country : any;
 public profile_id : any;
 public region : any;
 public lang : any;

    public flag: any;
    public badge = '0';

  constructor(public platform: Platform, public navCtrl: NavController, public _http:Http, private ev: Events, public translate: TranslateService, public service:Service) {
    this.region = Global.Static_region;
    this.lang = Global.Static_lang;
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
  
  selregion(re) {
    Global.Static_region = re;
    Global.flag = "assets/img/"+Global.Static_region+".png";
    this.flag = Global.flag;
    localStorage.setItem('flag', Global.flag);
  }

  sellang(la) {
    Global.Static_lang = la;
    this.service.lang = la;
    this.translate.use(la);
    if(la == 'en') {
      window.location.reload();
    } else {
      this.platform.setDir('rtl', true);
    }
    localStorage.setItem('lang', Global.Static_lang);
    this.navCtrl.pop();
  }

  ionViewWillEnter() {
    //this.lang = Global.Static_lang;
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    this.profile_id = Global.Static_profile_id;
  }
  
  onpostad() {
    if(Global.Static_profile_id == "") {
      alert("You have to login.");
      this.onlogin();
    } else {
      this.navCtrl.push(PostPage,{});
    }
  }
//, {animate:true, direction:'forward', animation:'ios-transition'}
  onlogin() {
    localStorage.setItem('loggedin', '');
    Global.Static_enter = "";
    this.navCtrl.push(LoginPage,{});
  }

  onlogout() {
    localStorage.setItem('loggedin', '');
    Global.Static_profile_id = "";
    Global.Static_enter = "";

    var tt = this;
    var temp_url = 'http://sale4allz.com/ws/logout.php';
    var Form_data = new FormData();
    Form_data.append('pid', Global.Static_profile_id);
    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        tt.navCtrl.push(LoginPage,{});
        $('.tabbar').css('display', 'none');
    }, error => {

    });
    
  }

  onfavorite() {
    this.navCtrl.push(FavoritePage,{});
  }

  onprofile() {
    if(Global.Static_profile_id != "") {
      this.navCtrl.push(MyprofilePage,{});
    } else {
      this.navCtrl.push(LoginPage,{});
    }
  }

}
