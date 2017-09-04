import { Component } from '@angular/core';
import { ViewController, NavController, ActionSheetController, ToastController, Platform, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { MynotificationPage } from './../notification/notification';
import { Events, AlertController } from 'ionic-angular';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import {MorePage} from '../more/more';
import * as $ from 'jquery';

declare var cordova : any;

@Component({
  selector: 'page-membership',
  templateUrl: 'membership.html',
   providers : [ServerDataModel]
})

export class MembershipPage {

    public flag: any;
    public badge = '0';
    loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, public actiionSheetCtrl:ActionSheetController, public toastCtrl: ToastController, public platform: Platform, private ev: Events, private alertCtrl: AlertController, public datamodel:ServerDataModel) {

                
    this.flag = Global.flag;

    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    
  }

  buy(price) {
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/update_package.php';
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('price', price);

    let membership = "";
    if(price*1 == 4) membership = "Basic";
    if(price*1 == 7) membership = "Professional";
    if(price*1 == 15) membership = "Shop";
    if(price*1 == 35) membership = "Company";
    let badge = "icon-5-1.png";
    if(price*1 == 4) badge = "icon-6-1.png";
    if(price*1 == 7) badge = "icon-9-1.png";
    if(price*1 == 15) badge = "icon-5-1.png";
    if(price*1 == 35) badge = "icon-15-1.png";

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        let alert = this.alertCtrl.create({
          title: 'Congratulation!',
          subTitle: 'Membership upgraded',
          message: 'You gained a new badge\n'+ '<img class="pop_img" src="assets/img/'+badge+'"/>',
          buttons: ['Ok']
        });
        alert.present();
        this.viewCtrl.dismiss();
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });

    this.datamodel.notify_membership( Global.Static_profile_id, membership, badge);
  }

  gotonotification() {
    this.navCtrl.push(MynotificationPage);
  }
  gotoprofile() {
    this.navCtrl.push(MorePage);
  }
  
}