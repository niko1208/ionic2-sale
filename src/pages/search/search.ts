import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading, Platform } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { Events } from 'ionic-angular';
import {MorePage} from '../more/more';
import { PostDataModel } from './../../app/model/PostDataModel';
import { LatestSubPage } from './../latest-sub/latest-sub';
import { WantedthingPage } from './../wantedpage/wantedpage';
import * as $ from 'jquery';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

    public flag: any;
    public badge = '0';

    loading: Loading;

    public keys : any;

    public searchTerm = "";
    public isPeople = false;
    public  postsDataArray : Array<PostDataModel> = new Array<PostDataModel>();
    lang:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, platform:Platform, private ev: Events) {
                
    this.flag = Global.flag;
    
    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })

    if(navParams.get('searchTerm') != null)  {
      this.searchTerm = navParams.get('searchTerm');
      this.search();
    }
    this.lang = Global.Static_lang;
    
  }

  gotonotification() {
    this.navCtrl.push(MynotificationPage);
  }
  gotoprofile() {
    this.navCtrl.push(MorePage);
  }
  gotosearch(){
    
  }
  
  ionViewWillEnter()
  {
    this.lang = Global.Static_lang;
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
  }

  goprofile(pid) { 
      this.navCtrl.push(ProfilePage,{
        profile_id: pid
      });
  }
  
  setFilteredItems() {
    
  }

  showdata(sec) {
    this.keys = [];
    $('.col_tab').removeClass("sel");
    $('#tab_'+sec).addClass("sel");
    if(sec == 'people') {
      this.isPeople = true;
    } else {
      this.isPeople = false;
    }
    this.search();
  }
  
  search(){
      
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/get_user_search.php';
    if(!(this.isPeople)) {
      temp_url = 'http://sale4allz.com/ws/get_item_search.php';
    }
    var Form_data = new FormData();
    var str = this.searchTerm;
    Form_data.append('str', str);
    Form_data.append('country', Global.Static_region);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();  
        if(!(this.isPeople)) {
          this.postsDataArray = res["items"];
          this.keys = [];
          for (let index in this.postsDataArray)
          {
            let temp = new PostDataModel(this.postsDataArray[index]);
            this.keys.push(temp);
          }
        } else {
          this.keys = res["items"];  
          for(let index in this.keys) {
            let item = this.keys[index];
            item['membership'] = "";
            if(item.membership1 != "") item.membership = "Basic";
            if(item.membership2 != "") item.membership = "Professional";
            if(item.membership3 != "") item.membership = "Shop";
            if(item.membership4 != "") item.membership = "Company";
          }
        }
        console.log(this.keys);
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  click_card(i)
  {
      var send_array = this.keys[i]; 
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

      if(send_wanted == '1') {
        this.navCtrl.push(WantedthingPage,{
         content:send_content,
         price:send_price,
         title:send_title,
         img_url:send_img_url,
         date:send_date,
         desc:send_desc,
         views:send_viewcount,
         id:send_id,
         wanted:send_wanted,
         category_id:send_category_id,
         profile_id: send_profile_id
       });
      } else {
       this.navCtrl.push(LatestSubPage,{
         content:send_content,
         price:send_price,
         title:send_title,
         img_url:send_img_url,
         date:send_date,
         desc:send_desc,
         views:send_viewcount,
         id:send_id,
         wanted:send_wanted,
         category_id:send_category_id,
         islike:send_islike,
         profile_id: send_profile_id,
         isfollow: send_isfollow
       });
      }
  }
  clickicon() {

  }

}