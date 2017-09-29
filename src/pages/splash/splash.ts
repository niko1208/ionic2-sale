import { TabsPage } from '../tabs/tabs';
import { OfferDataModel } from './../../app/model/OfferModel';
import { Component } from '@angular/core';
import { Global } from './../../app/model/global';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FViewPage } from './../fview/fview';
import { Http } from '@angular/http';
import { Service } from '../../providers/service';
import { TranslateService } from 'ng2-translate';

 import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
/*
  Generated class for the Splash page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
  providers:[ServerDataModel]
})
export class SplashPage {

  public putdata = [];
  public pending = false;

  splash_data : Array<OfferDataModel> = [];
  temp : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public datamodel:ServerDataModel, public _http:Http, public sv:Service, private ev: Events, public translate: TranslateService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

   ionViewWillEnter()
 {
     Global.Static_number = localStorage.getItem('number');
     this.datamodel.GetOffers();
     this.datamodel.homedelegate = this;

     Global.request_pending = false;
     this.callFunc();
 }

   dataSourceUpdated(data)
  {
       this.putdata  = [];
       this.putdata = data;
       var temp = this.putdata.length; 
       var test  = Math.random()*1000 % temp ; 
       var intvalue = Math.trunc( test ); 
       this.splash_data = this.putdata[intvalue];

       let ofid = this.splash_data['id'];
       this.datamodel.updateviews(ofid, '0');

       console.log("splash page information ==>",this.splash_data);
 }

 onClickEnter()
 {
   Global.Static_enter = "1";
   this.navCtrl.push(TabsPage);
 }


  //=======================================
  public callFunc() {
    
      var tt = this;
    if(Global.request_pending == false) {
        tt.getnotification();
    }
    /*
    setTimeout(function() {
        tt.callFunc();
    }, 10000);*/
  }
  
  getnotification() {
      Global.request_pending = true;
      var temp_url = 'http://sale4allz.com/ws/get_notification.php';
      var Form_data = new FormData();
      
      Form_data.append('id', Global.devicetoken);
      Form_data.append('pid', Global.Static_profile_id);
      Form_data.append('number', Global.Static_number);

      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
          Global.request_pending = false;
          Global.badge = res['num'];
          this.ev.publish('badge', Global.badge);
      }, error => {
          Global.request_pending = false;
      });
  }
  //=======================================

  gotoFview() {
    var url = this.splash_data['img_url'];
    this.navCtrl.push(FViewPage,{
      imgurl : url,
      offer : '1',
      id : this.splash_data['id'],
      view: this.splash_data['viewcount']
    }, {animation:'ios-transition'});
  }


}
