import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading, Platform, Events } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import * as $ from 'jquery';

@Component({
  selector: 'page-follow',
  templateUrl: 'follow.html',
   providers : [ServerDataModel]
})
export class FollowPage {

    public flag: any;

    loading: Loading;

    public fitem : any;
    public fitem1 : any;
    public profile_id : any;
    public mypid : any;
    public follower = 0;
    public following = 0;

    public username = "";
    public follow = "";
    public badge = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, platform:Platform, private ev: Events, public datamodel:ServerDataModel) {
                
    this.profile_id = navParams.get("profile_id");
    this.mypid = navParams.get("mypid");
    this.username = navParams.get("username");
    this.follow = navParams.get("follow");

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
    this.loadFollower();
    if(this.follow == "following") {
      this.tabclick("following");
    } else {
      this.tabclick("follower");
    }
  }

  tabclick(sec) {
    $('.div_cont').css('display', 'none');
    $('.div_tab div').removeClass("sel");
    $('#tab_'+sec).addClass("sel");
    $('#div_'+sec).css('display', 'block');

  }

  onfollow(pid, isfollow) {
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/update_follow.php';
    var Form_data = new FormData();
    
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('rid', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        //this.loading.dismissAll();
        this.loadFollower();
        this.datamodel.notify_follow(pid, isfollow);
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  loadFollower() {

    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/get_user_follower.php';
    var Form_data = new FormData();
    var pid = this.profile_id;
    Form_data.append('profile_id', pid);
    Form_data.append('mypid', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        this.fitem = res["items"];
        this.fitem1 = res["items1"];
        this.follower = res["items"].length;
        this.following = res["items1"].length;
        
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }
  navback() {
    this.navCtrl.pop({animate:true, direction:'backward', animation:'ios-transition'});
  }

}