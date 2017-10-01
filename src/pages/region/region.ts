import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, Platform } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { LoginPage } from '../login/login';
import { TranslateService } from 'ng2-translate';
import { Service } from './../../providers/service';

@Component({
  selector: 'page-region',
  templateUrl: 'region.html'
})

export class RegionPage {

    public ecolor = "";
    public acolor = "light";
    public selRegion = "kuwait";
    public selLang = "en";

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public translate: TranslateService, public service:Service, public platform: Platform) {

  }


  ionViewWillEnter()
  {
    let lang = Global.Static_lang;
    if(lang == 'en') {
        this.acolor = "light";
        this.ecolor = "";
    } else {
        this.ecolor = "light";
        this.acolor = "";
    }
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
    Global.Static_lang = lang;
    this.service.lang = lang;
    this.translate.use(lang);
    if(lang == 'en') {
      this.platform.setDir('rtl', false);
    } else {
      this.platform.setDir('rtl', true);
    }
  }
  gotologin() {
      var regionView = this.viewCtrl;
      Global.Static_region = this.selRegion;
      Global.Static_lang = this.selLang;
      this.service.lang = this.selLang;
      this.navCtrl.push(LoginPage, {viewCtrl:regionView});
  }

}
