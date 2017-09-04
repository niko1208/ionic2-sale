import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-region',
  templateUrl: 'region.html'
})

export class RegionPage {

    public ecolor = "";
    public acolor = "light";
    public selRegion = "kuwait";
    public selLang = "en";

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {

  }


  ionViewWillEnter()
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
  }

  onregion(region) {
    this.selRegion = region;
  }

  onlang(lang) {
    this.selLang = lang;
    if(lang == 'en') {
        this.acolor = "light";
        this.ecolor = "";
    } else {
        this.ecolor = "light";
        this.acolor = "";
    }
  }
  gotologin() {
      var regionView = this.viewCtrl;
      Global.Static_region = this.selRegion;
      Global.Static_lang = this.selLang;
      this.navCtrl.push(LoginPage, {viewCtrl:regionView});
  }

}
