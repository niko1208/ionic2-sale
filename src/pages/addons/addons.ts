import { Component } from '@angular/core';
import { ViewController, NavController, ActionSheetController, ToastController, Platform, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { PostPage } from '../post/post';
import { MyadsPage } from '../myads/myads';
import { MychatPage } from '../mychat/mychat';
import { MynotificationPage } from './../notification/notification';
import { FollowPage } from './../follow/follow';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
import { MembershipPage } from './../membership/membership';
import {MorePage} from '../more/more';
import { TranslateService } from 'ng2-translate';
import * as $ from 'jquery';

declare var cordova : any;

@Component({
  selector: 'page-addons',
  templateUrl: 'addons.html'
})

export class AddonsPage {

    loading: Loading;

    public check_pre = false;
    public check_pin = false;
    public check_offer = false;
    public preads = 0;
    public pinads = 0;
    public vipads = 0;
    public offads = 0;
    public balance = 0;
    public total = 0;
    public amount = 0;
    public post_price = 0;
    public ary: any;
    public post_type = '';
    public post_id : any;

    public flag: any;
    public badge = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, public actiionSheetCtrl:ActionSheetController, public toastCtrl: ToastController, public platform: Platform, private ev: Events, public translate: TranslateService) {


    this.post_id    = navParams.get("post_id");
                
    this.flag = Global.flag;

    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    
  }

  ionViewWillEnter() {
    this.loadProfile();
  }

  loadProfile() {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/get_profile.php';
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        if(res['success'] == "true") {
            this.balance = res['items'][0]['balance'];
            this.total = this.post_price;

            this.preads = res['items'][0]['num_pre_posts'];
            this.pinads = res['items'][0]['num_pin_posts'];
            this.vipads = res['items'][0]['num_vip_posts'];
            this.offads = res['items'][0]['num_offer_posts'];

        } else {
            alert(res['error']);
        }
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  preChecked(val) {
    this.check_pin = false;
    this.check_offer = false;
    this.calcTotal();
  }
  
  pinChecked(val) {
    this.check_pre = false;
    this.check_offer = false;
    this.calcTotal();
  }
  
  offerChecked(val) {
    this.check_pin = false;
    this.check_pre = false;
    this.calcTotal();
  }

  calcTotal() {
    let total = this.post_price;
    let ary = {pin:this.pinads, pre:this.preads, vip:this.vipads, offer:this.offads, balance:this.balance};

    if(this.check_pre) {
      total = total*1 + 5;
    }
    if(this.check_pin) {
      total = total*1 + 3;
    }
    if(this.check_offer) {
      total = total*1 + 10;
    }

    this.total = total;
    this.amount = 0;
   
    if(this.total > this.balance) {
      this.amount = this.total - this.balance;
      ary.balance = 0;
    } else {
      ary.balance = this.balance - this.total;
      this.amount = 0;
    }

    if(this.check_pre) {
      this.post_type = 'pre';
    } else if(this.check_pin) {
      this.post_type = 'pin';
    } else if(this.check_offer) {
      this.post_type = 'offer';
    }

    this.ary = ary;
  }

  clickpay() {
    let post_id = this.post_id;
    if(post_id != "") {
      var temp_url = 'http://sale4allz.com/ws/update_post_type.php';
      var Form_data = new FormData();
      Form_data.append('post_id', post_id);
      Form_data.append('post_type', this.post_type);

      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
        this.navCtrl.pop();
      }, error => {
          alert("Error");
      });
    } else {
      let ary = this.ary;
      var temp_url = 'http://sale4allz.com/ws/update_user_balance.php';
      var Form_data = new FormData();
      var pid = Global.Static_profile_id;
      Form_data.append('pid', pid);
      Form_data.append('balance', ary.balance);
      Form_data.append('pin', ary.pin);
      Form_data.append('pre', ary.pre);
      Form_data.append('vip', ary.vip);
      Form_data.append('offer', ary.offer);

      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
        localStorage.setItem('pay', '1');
        localStorage.setItem('posttype', this.post_type);
        this.navCtrl.pop();
      }, error => {
          alert("Error");
      });
    }
  }
  cancel() {
    this.navCtrl.pop();
  }
  
}