import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { RegionPage } from '../region/region';

import { SplashPage } from '../splash/splash';
import { RegisterPage } from '../register/register';
import { Http } from '@angular/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

    public mnumber = "";
    loading: Loading;
    public phonecode = "";
    public regionView : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController) {

                this.regionView = navParams.get("viewCtrl");
                this.mnumber = localStorage.getItem('number');
  }

  ionViewWillEnter()
  {
    if(Global.Static_region == "kuwait")
      this.phonecode = Global.Static_kuwait_code;
    else if(Global.Static_region == "ksa")
      this.phonecode = Global.Static_ksa_code;
    else 
      this.phonecode = Global.Static_jor_code;

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    
  }

  onback(){
    //this.navCtrl.push(RegionPage, {}, {animate:true, direction:'backward', animation:'ios-transition'});
    this.navCtrl.push(RegionPage);
    //this.navCtrl.pop();
  }
  onskip(){
    Global.badge = "0"; 
    Global.Static_profile_id = "";
    localStorage.setItem('profile_id', Global.Static_profile_id);
    this.navCtrl.push(SplashPage).then(()=> {
      this.removePages();
    });
  }
  
  removePages() {
    

    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    /*
    if(this.regionView != null && this.regionView != 'undefined') {
      const index1 = this.regionView.index;
      this.navCtrl.remove(index1);
    }*/
  }

  onlogin() {
    if(this.mnumber == "") {
      alert("Please input number");
      return;
    }
    var num = this.mnumber;
    localStorage.setItem('number', num);
    Global.flag = "assets/img/"+Global.Static_region+".png";
    this.navCtrl.push(RegisterPage, {
      number: num
    }, {animation:'ios-transition'}).then(()=> {
      this.removePages();
    });

  }

}
