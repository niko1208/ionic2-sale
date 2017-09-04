import { LoadingController } from 'ionic-angular';
import { Component} from '@angular/core';
import {SMS} from 'ionic-native';
import { NavController, NavParams, Events } from 'ionic-angular';

declare var window : any;
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public smsNumber:any;
  public smsText:any;
  public callNumber:any;
  public call : any;
  public passedNumber:any;
  public flag :any;

  constructor(public navCtrl: NavController,public navParams : NavParams,public events : Events,private loading:LoadingController) {
    this.flag=true
  }


  // logIn()
  // {
  //   this.events.publish('user:login');
  // }
  ionViewDidLoad()
  {
      this.call = 'ms';
  }

  ionViewWillEnter()
  {
    this.callNumber = "";
    this.smsText ="";
    this.smsNumber = "";
  }


  selectMessageButton()
  {
    this.call = 'ms';
  }

  selectCallButton()
  {
    this.call = 'ca';
  }
///////////////////////send message part////////////////////////////////
  sendSMS()
  {

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
    SMS.send(this.smsNumber,this.smsText,options)
      .then(()=>{
        alert("success");
        load.dismiss();
      },()=>{
        load.dismiss();
      alert("failed");
      });
  }
////////////////////////calling part ///////////////////////////////////////////
  sendCall()
  {
    this.passedNumber =encodeURIComponent(this.callNumber);
    window.location = "tel:" + this.passedNumber;
   // window.plugins.CallNumber.
    // document.location.href = this.passedNumber
  }


}
