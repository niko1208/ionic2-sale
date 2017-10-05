import { Component } from '@angular/core';
import { ViewController, NavController, ActionSheetController, ToastController, Platform, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { PostPage } from '../post/post';
import { MyadsPage } from '../myads/myads';
import { MychatPage } from '../mychat/mychat';
import { ChatPage } from '../chat/chat';
import { FViewPage } from './../fview/fview';
import { MyDataModel } from './../../app/model/DataModel';
import { PostDataModel } from './../../app/model/PostDataModel';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import { WantedthingPage } from './../wantedpage/wantedpage';
import { LatestSubPage } from './../latest-sub/latest-sub';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { ReviewPage } from './../review/review';
import { FollowPage } from './../follow/follow';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import { TranslateService } from 'ng2-translate';
import { Service } from './../../providers/service';

import { SMS } from 'ionic-native';

import * as $ from 'jquery';

declare var window;
declare var cordova : any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
   providers : [ServerDataModel]
})

export class ProfilePage {

    lastImage: string = null;

    public ads = "0";
    public follower = "0";
    public following = "0";
    public username = "";
    public image = "";
    public profile_id = "0";
    public ison = "0";
    public state = "";
    public myRating = "0.0";
    public isfollow = "0";
    public mark1 = 0;
    public mark2 = 0;
    public mark3 = 0;
    public mark4 = 0;
    public mark5 = 0;
    public ratingCount = 0;
    public membership1 = '';
    public membership2 = '';
    public membership3 = '';
    public membership4 = '';
    public membership = '';
    public points = "0";
    public about = "";
    public backurl = "";

    public ml = [];

    loading: Loading;
    public phonecode = "";
    public prevView : any;
    keys : Array<MyDataModel> = [];
    temp : any;
    public fitem : any;
    public fitem1 : any;
    /////////////////////////////
    public reviewlist = [];
    public  postsDataArray : Array<PostDataModel> = new Array<PostDataModel>();

    public flag: any;
    public badge = '0';

    public strtooltip = "";
    public tool_tip = false;

    public viewstyle = 0;

    public bpopup : any;
    public bsms : any;
    public dialog_title : any;
    public phonenumber = "+1-1111-111-1111";

    public lang: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, public actiionSheetCtrl:ActionSheetController, public datamodel:ServerDataModel, public toastCtrl: ToastController, public platform: Platform, private ev: Events, public translate: TranslateService, public service:Service) {

                this.profile_id = navParams.get("profile_id");

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

  loadbackground() {
    $('#pback_img').css('background', 'url('+this.backurl+')');
    $('#pback_img').css('background-size', 'cover');
    $('#pback_img').css('background-position', 'center');
  }
  ionViewWillEnter()
  {
    this.lang = Global.Static_lang;
    if(Global.Static_profile_id == "") {
      this.navCtrl.pop();
      $('.fstatusbar img').css('display', 'none');
    }
    this.loadProfile();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    
  }

  perc(val) {
    return Math.round(val*100/5);
  }

  showmore(i) {
    this.ml[i] = 1;
  }
  showless(i) {
    this.ml[i] = 0;
  }

  tabclick(sec) {
    $('.div_cont').css('display', 'none');
    $('.div_tab div').removeClass("sel");
    $('#tab_'+sec).addClass("sel");
    $('#div_'+sec).css('display', 'block');

  }

  view(i) {
    this.viewstyle = i;
  }

  onfollowing() {
    var pid = this.profile_id;
    var uname = this.username;
    this.navCtrl.push(FollowPage, {
      profile_id:pid, 
      mypid:Global.Static_profile_id, 
      follow:'following',
      username: uname
    });
  }

  onfollower() {
    var pid = this.profile_id;
    var uname = this.username;
    this.navCtrl.push(FollowPage, {
      profile_id:pid, 
      mypid:Global.Static_profile_id, 
      follow:'follower',
      username: uname
    });
  }

  writereview() {
    var pid = this.profile_id;
    this.navCtrl.push(ReviewPage, {profile_id:pid});
  }
  loadreview() {
    var temp_url = 'http://sale4allz.com/ws/get_user_review.php';
    var Form_data = new FormData();
    var pid = this.profile_id;
    Form_data.append('pid', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.ratingCount = res['items'].length; 
        this.reviewlist = res['items'];
        this.myRating = res['rating'];
        this.mark1 = res['items1'][0]['mark1'];
        this.mark2 = res['items1'][0]['mark2'];
        this.mark3 = res['items1'][0]['mark3'];
        this.mark4 = res['items1'][0]['mark4'];
        this.mark5 = res['items1'][0]['mark5'];
        for(let i=0; i<res['items'].length; i++) {
          this.ml[i] = 0;
        }
    }, error => {
        alert("Error");
    });
  }

  click_card(i)
  {
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
         profile_id: send_profile_id
       });
      }
  }
  loadAds() {
    var temp_array = new Array<PostDataModel>();
    this.keys = [];

    var temp_url = 'http://sale4allz.com/ws/get_user_posts.php';
    var Form_data = new FormData();
    var pid = this.profile_id;
    Form_data.append('profile_id', pid);
    Form_data.append('post_all', '0');

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        for(let index in res["items"])
        {
            var TempDataModel = new PostDataModel(res["items"][index]); 
            temp_array.push(TempDataModel);
        }
        this.postsDataArray = temp_array;
        for (let index in this.postsDataArray)
        {
          this.temp = this.postsDataArray[index];
          this.keys.push(this.temp);
        }
        this.ads = res["items"].length;
        
    }, error => {
        alert("Error");
    });
  }

  loadFollower() {

    var temp_url = 'http://sale4allz.com/ws/get_user_follower.php';
    var Form_data = new FormData();
    var pid = this.profile_id;
    Form_data.append('profile_id', pid);
    Form_data.append('mypid', Global.Static_profile_id);
    Form_data.append('isnum', '1');

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.follower = res["items"];
        this.following = res["items1"];
    }, error => {
        alert("Error");
    });
  }

  onfollow(pid) {
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/update_follow.php';
    var Form_data = new FormData();
    
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('rid', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        this.loadFollower();
        this.checkfollow();
        var isfollow = this.isfollow;
        this.datamodel.notify_follow(pid, isfollow);
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  loadProfile() {
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/get_profile.php';
    var Form_data = new FormData();
    var pid = this.profile_id;
    Form_data.append('profile_id', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => { console.log(res);
        this.loading.dismissAll();
        if(res['success'] == "true") {
            this.image = res['items'][0]['image'];
            this.username = res['items'][0]['username'];
            this.ison = res['items'][0]['ison'];
            if(this.ison == '1') {
              this.state = "online";
            } else {
              this.state = "offline";
            }
            this.points = res['items'][0]['points'];
            this.about = res['items'][0]['about'];
            this.about = this.about.replace(/\n/g, "<br/>");
            this.backurl = res['items'][0]['backurl'];
            if(this.backurl == "") this.backurl = "assets/img/blank-1.png";
            this.loadbackground();

            this.membership1 = res['items'][0]['membership1'];
            this.membership2 = res['items'][0]['membership2'];
            this.membership3 = res['items'][0]['membership3'];
            this.membership4 = res['items'][0]['membership4'];
   
            this.membership = "";
            if(this.membership2 != "") this.membership = "Professional";
            if(this.membership3 != "") this.membership = "Shop";
            if(this.membership4 != "") this.membership = "Company";

            this.phonenumber = res['items'][0]['phone'];
            this.loadAds();
            this.loadFollower();
            this.checkfollow();
            this.loadreview();
            this.tabclick("ads");
        } else {
            alert(res['error']);
        }
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  aboutmore0() { 
    let more = this.translate.instant('STR_MORE');
    let less = this.translate.instant('STR_LESS');
    if($('#about_more').text() == more) {
      $('#about').addClass('amore');
      $('#about_more').text(less);
    } else {
      $('#about').removeClass('amore');
      $('#about_more').text(more);
    }
  }

  checkfollow() {
    var temp_url = 'http://sale4allz.com/ws/check_follow.php';
    var Form_data = new FormData();
    var pid = this.profile_id;
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('rid', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.isfollow = res["items"];
        if(this.isfollow == "1")
          $('#bt_follow').html(this.translate.instant('STR_FOLLOWED'));
        else 
          $('#bt_follow').html(" + " + this.translate.instant('STR_FOLLOW'));
    }, error => {
        alert("Error");
    });
  }
  gotoview(url) {
    
    this.navCtrl.push(FViewPage,{
      imgurl : url,
      offer : '0'
    }, {animation:'ios-transition'});
  }
  
  getWords(str, len) {
      return str.split(/\s+/).slice(0,len).join(" ");
  }

  clickicon(idx, is) { 
    let msg = ['',
      this.translate.instant('STR_REGISTER'),
      this.translate.instant('STR_EMAIL_V'),
      this.translate.instant('STR_PHONE_V'),
      this.translate.instant('STR_PAYMENT_V'),
      this.translate.instant('STR_BASIC_MEM'),
      this.translate.instant('STR_PRO_MEM'),
      this.translate.instant('STR_SHOP_MEM'),
      this.translate.instant('STR_COMPANY_MEM')
    ];
    if(is) {
      this.tool_tip = true;
      this.strtooltip = msg[idx];
      let x = 20 + ((idx-1)%4)*30;
      let y = 100;
      if(idx>4) y = 130;

      let time1 = setTimeout(() => {
        //$('.tooltip').css('left', x+'px');
        //$('.tooltip').css('top', y+'px');
        clearTimeout(time1);
      }, 100);
      
      let time = setTimeout(() => {
        this.tool_tip = false;
        clearTimeout(time);
      }, 1000)
    }
  }

  onblock() {

  }
  onreport() {

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
      let load = this.loadingCtrl.create({
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
  
  onchat() {
    let rid = this.profile_id;

    if(Global.Static_profile_id == ""){
      alert("You must login.");
      return;
    }
    if(rid == Global.Static_profile_id) {
      return;
    }
    this.navCtrl.push(ChatPage,{
      rid: rid,
      image: this.image
    });
  }


}