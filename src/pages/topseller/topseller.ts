import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading, Platform, ToastController } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import { TranslateService } from 'ng2-translate';
import * as $ from 'jquery';

@Component({
  selector: 'page-topseller',
  templateUrl: 'topseller.html'
})
export class TopsellerPage {

    public flag: any;

    loading: Loading;

    public keys : any;
    public badge = '0';
    public strtooltip = "";
    public tool_tip = [];
    public ii = 0;
    info_text = [];

    public lang: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, platform:Platform, private ev: Events, public toastCtrl: ToastController, public translate: TranslateService) {
                
    this.flag = Global.flag;
    
    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    this.lang = Global.Static_lang;
    
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
  
  ionViewWillLeave()
  {
    this.ev.publish('showinfo', false, 0, 'l', '1');
  }

  ionViewWillEnter()
  {

    this.lang = Global.Static_lang;
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    this.load();

    this.info_text = [];
    this.info_text.push({title: this.translate.instant('STR_TOP_SELLER'), text:this.translate.instant('STR_INFO_TOPSELLER1')});
    this.info_text.push({title: this.translate.instant('STR_INFO_TOPSELLER2_T'), text:this.translate.instant('STR_INFO_TOPSELLER2')});
    this.info_text.push({title: this.translate.instant('STR_RANK'), text:this.translate.instant('STR_INFO_TOPSELLER3')});
    
    this.ev.publish('setinfo', this.info_text, true, true);
  }

  showInfo() {
    this.ev.publish('showinfo', true, 0, 's');
  }

  goprofile(pid) { 
    if(pid == Global.Static_profile_id) {
      this.navCtrl.push(MyprofilePage);
    } else {
      this.navCtrl.push(ProfilePage,{
        profile_id: pid
      });
    }
  }
  
  load() {

    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/get_topseller.php';
    var Form_data = new FormData();
    Form_data.append('mypid', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        this.tool_tip = [];
        for(let i=0; i<res["items"].length; i++) {
          let item = res['items'][i];
          item['membership'] = "";
          if(item.membership1 != "") item.membership = "Basic";
          if(item.membership2 != "") item.membership = "Professional";
          if(item.membership3 != "") item.membership = "Shop";
          if(item.membership4 != "") item.membership = "Company";
          res['items'][i] = item;
          res['items'][i]['about'] = res['items'][i]['about'].replace(/\n/g, "<br/>");
          this.tool_tip[i] = false;
        }
        this.keys = res["items"];
        
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  clickicon(i, idx, is) { console.log(i+'--'+idx);
    let msg = ['',
      this.translate.instant('STR_REGISTER'),
      this.translate.instant('STR_EMAIL_V'),
      this.translate.instant('STR_PHONE_V'),
      this.translate.instant('STR_PAYMENT_V'),
      this.translate.instant('STR_BASIC_MEM'),
      this.translate.instant('STR_PRO_MEM'),
      this.translate.instant('STR_SHOP_MEM'),
      this.translate.instant('STR_COMPANY_MEM'),
    ];
    if(is) {
      for(let  j=0; j<this.keys.length; j++) {
        this.tool_tip[j] = false;  
      }
      this.tool_tip[i] = true;
      this.strtooltip = msg[idx];
      this.ii = i;
      let x = 90 + ((idx-1)%4)*30;
      let y = 50;
      if(idx>4) y = 80;
      
      let time1 = setTimeout(() => {
        //$('.tooltip').css('left', x+'px');
        //$('.tooltip').css('top', y+'px');
        clearTimeout(time1);
      }, 500);

      let time = setTimeout(() => {
        this.tool_tip[this.ii] = false;
        clearTimeout(time);
      }, 1000)
    }
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  aboutmore(i) {
    if($('#about_more'+i).text() == "More") {
      $('#about'+i).addClass('amore');
      $('#about_more'+i).text('Less');
    } else {
      $('#about'+i).removeClass('amore');
      $('#about_more'+i).text('More');
    }
  }


}