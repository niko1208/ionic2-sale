import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading, Platform, Events } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { PostDataModel } from './../../app/model/PostDataModel';
import { LatestSubPage } from './../latest-sub/latest-sub';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import { TranslateService } from 'ng2-translate';
import * as $ from 'jquery';

@Component({
  selector: 'page-bid',
  templateUrl: 'bid.html'
})

export class BidPage {

    loading: Loading;
    public keys = [];
    public flag: any;
    public badge = '0';
    public  postsDataArray : Array<PostDataModel> = new Array<PostDataModel>();
    public info_text = [];
    public lang: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, platform:Platform, private ev: Events, public translate: TranslateService) {
                

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
      this.load();

    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }

    this.info_text = [];
    this.info_text.push({title: this.translate.instant('STR_BIDS'), text:this.translate.instant('STR_INFO_BID1')});
    this.ev.publish('setinfo', this.info_text, true, true);
  }

  showInfo() {
    this.ev.publish('showinfo', true, 0, 's');
  }

  ionViewDidLoad() {
    
  }

  load() {
      var temp_url = 'http://sale4allz.com/ws/get_bid.php';
      var Form_data = new FormData();
      Form_data.append('profile_id', Global.Static_profile_id);
      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
          this.keys = res['items'];
          for(let index in res["items"])
          {
              var TempDataModel = new PostDataModel(res["items"][index]); 
              this.postsDataArray.push(TempDataModel);
          }
      }, error => {
          
      });
  }
  click_card(i) {
      var send_array = this.postsDataArray[i]; 
      var send_content = send_array["post_content"];
      var send_price   = send_array["post_price"];
      var send_title   = send_array["post_title"];
      var send_img_url = send_array["post_img_url"];
      var send_date    = send_array["post_date"];
      var send_desc    = send_array["post_content"];
      var send_profile_id    = send_array["post_profile_id"];
      var send_viewcount    = send_array["post_viewcount"];
      var send_id    = send_array["post_id"];
      var send_wanted    = send_array["wanted"];
      var send_category_id    = send_array["post_category_id"];
      var send_islike    = send_array["islike"];
      var send_isfollow    = send_array["post_profile_isfollow"];

       this.navCtrl.push(LatestSubPage,{
         content:send_content,
         price:send_price,
         title:send_title,
         img_url:send_img_url,
         date:send_date,
         desc:send_desc,
         views:send_viewcount,
         id:send_id,
         wanted:'0',
         category_id:send_category_id,
         islike:send_islike,
         profile_id: send_profile_id,
         isfollow: send_isfollow
       });
  }

}
