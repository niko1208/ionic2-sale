import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Service } from './../../providers/service';
import { LoadingController } from 'ionic-angular';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import {MorePage} from '../more/more';

import { Global } from './../../app/model/global';
import * as $ from 'jquery';
import { SMS } from 'ionic-native';
declare var window;

@Component({
  selector: 'page-fview',
  templateUrl: 'fview.html',
   providers : [Service,ServerDataModel]
})
export class FViewPage {

  public imgurl : any;
  public views : any;
  public offer : any;
  public ofid : any;

  public flag: any;
  public phonenumber: any;
  public bpopup: any;
  public dialog_title: any;
  public bsms: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private loading:LoadingController, public datamodel:ServerDataModel) {

    this.views = 0;
    this.imgurl = navParams.get("imgurl");
    this.offer = navParams.get("offer");
    if(this.offer == "1") {
      this.ofid = navParams.get("id");
      this.views = navParams.get("view");
    }
    
    this.flag = Global.flag;
    this.bpopup = false;
    this.bsms = false;
    this.phonenumber = Global.Static_number;
  }

  gotonotification() {
    this.navCtrl.push(MynotificationPage);
  }
  gotoprofile() {
    this.navCtrl.push(MorePage);
  }
  
  ionViewWillEnter()
  {
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    if(this.offer == "1") {
      this.datamodel.updateviews(this.ofid, '2');
      //this.datamodel.homedelegate = this;
    }
  }

  gocancel() {
    this.bpopup = false;
  }
  callIT(passedNumber) {
    this.bpopup = true;
    this.bsms = false;
    this.dialog_title = "Call us";
  }
  sendSMS() {
    this.bpopup = true;
    this.bsms = true;
    this.dialog_title = "Text us";
  }
  dcall() {
    var passedNumber = this.phonenumber;
    this.bpopup = false;
    if(this.bsms) {
      alert(SMS.hasPermission());
      let load = this.loading.create({
          content:'Please wait'
      });

      load.present();

      var  options={
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //  intent: 'INTENT'  // Opens Default sms app
                intent:''
                //intent: '' // Sends sms without opening default sms app
              }
      }
      
      SMS.send(passedNumber, "Hello World",options)
        .then((result)=>{
          let successToast = this.toastCtrl.create({
            message: "Text message sent successfully! :)",
            duration: 3000
          })
          successToast.present();
          load.dismiss();
        },(error)=>{
          load.dismiss();
          let errorToast = this.toastCtrl.create({
            message: "Text message not sent. :(",
            duration: 3000
          })
          errorToast.present();
      });
    
    } else {
      passedNumber = encodeURIComponent(passedNumber);
      window.location = "tel:"+passedNumber;
    }
  }

  navback() {
    this.navCtrl.pop({animate:true, direction:'backward', animation:'ios-transition'});
  }
}