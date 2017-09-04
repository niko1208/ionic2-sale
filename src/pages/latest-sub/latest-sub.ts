import { LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams , ToastController, AlertController} from 'ionic-angular';
import { PostDataModel } from './../../app/model/PostDataModel';
import { Service } from './../../providers/service';
import { MyDataModel } from './../../app/model/DataModel';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import { FViewPage } from './../fview/fview';
import { PostwantedthingPage } from './../postwantedthing/postwantedthing';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { ChatPage } from './../chat/chat';
import { BidPage } from './../bid/bid';
import { Global } from './../../app/model/global';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
import { ReviewPage } from './../review/review';
import { AddonsPage } from './../addons/addons';
import {MorePage} from '../more/more';

import { Http } from '@angular/http';

import * as $ from 'jquery';

import { SMS } from 'ionic-native';

declare var window;
/*
  Generated class for the LatestSub page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-latest-sub',
  templateUrl: 'latest-sub.html',
   providers : [Service,ServerDataModel]
})
export class LatestSubPage  implements ServerDataModelDelegate{

  public sub_content : any;
  public sub_title  : any;
  public sub_price  : any;
  public sub_url    : any;
  public sub_date   : any;
  public sub_desc   : any;
  public sub_views   : any;
  public sub_id   : any;
  public sub_wanted : any;
  public sub_category_id : any;
  public sub_profile_id : any;


  public state = "0";
  public username = "";
  public image = "";
  public ison = "0";
  public isfollow = "";
  public myRating = "0.0";
  public ratingCount = 0;
  public bidprice = "0";

  public catename : any;

  public idx : any;
  public blike : any;
  public bpopup : any;
  public bsms : any;
  public dialog_title : any;
  public phonenumber = "";
  public pressedOffer = 0;
  public membership1 = '';
  public membership2 = '';
  public membership3 = '';
  public membership4 = '';
  public membership = '';

  public myprofile_id : any;

  public reviewlist = [];
  public ml = [];
  public pData = {};

  public flag: any;
    public badge = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private loading:LoadingController, public datamodel:ServerDataModel, public _http:Http, private alertCtrl: AlertController, private ev: Events) {
    this.navCtrl = navCtrl;

    this.flag = Global.flag;

    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    
    this.sub_content = navParams.get("content");
    this.sub_price   = navParams.get("price");
    this.sub_title   = navParams.get("title");
    this.sub_url     = navParams.get("img_url");
    this.sub_date    = navParams.get("date");
    this.sub_desc    = navParams.get("desc");
    this.sub_views    = navParams.get("views");
    this.sub_id    = navParams.get("id");
    this.sub_profile_id = navParams.get("profile_id");
    this.idx = 1;
    var islike = navParams.get("islike");
    this.blike = "0";
    if(islike == '1') this.blike = '1';
    this.bpopup = false;
    this.bsms = false;
    this.sub_wanted = navParams.get("wanted");
    this.sub_category_id    = navParams.get("category_id");

    this.myprofile_id = Global.Static_profile_id;

    var isfollow = navParams.get("isfollow");
    
    this.catename = "";
    

    if(this.sub_url.length == 1) {
      $('.div_img_wrapper img').addClass('imgcenter');
    }

    this.phonenumber = Global.Static_number;

    this.pData = {points:0, image:""};
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

  ionViewWillEnter()
  {
    this.datamodel.updateviews(this.sub_id, this.sub_wanted);
    this.datamodel.homedelegate = this;

    this.datamodel.GetTreeCategoryInformation();

    this.checkfollow();

    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }

    this.loadPostReviews();
    
  }

  loadPostReviews() {
    var temp_url = 'http://sale4allz.com/ws/load_post_reviews.php';
    var Form_data = new FormData();
    var id = this.sub_id;
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('post_id', this.sub_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.reviewlist = res['items'];
        for(let i=0; i<res['items'].length; i++) {
          this.ml[i] = 0;
        }
    }, error => {
        alert("Error");
    });
  }

  showmore(i) {
    this.ml[i] = 1;
  }
  showless(i) {
    this.ml[i] = 0;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LatestSubPage');
    
  }
  
  onenterbid(){
    if(this.bidprice == "0") {
      this.onbid();
    } else {
      this.pressedOffer = 1;
    }
  }

  bid(price) {
    let load = this.loading.create({
        content: 'Loading...',
    });
    load.present();

    var temp_url = 'http://sale4allz.com/ws/post_user_bid.php';
    var Form_data = new FormData();
    var id = this.sub_id;
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('id', id);
    Form_data.append('price', price);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        load.dismissAll();
        var pid = this.sub_profile_id;
        this.datamodel.notify_bidprice(pid, price, '1');
    }, error => {
        load.dismissAll();
        alert("Error");
    });
  }

  onbid() {
    var price = this.sub_price;
    if(this.bidprice != "0") {
      price = this.bidprice;
    }
    let alertbox = this.alertCtrl.create({
      title: "Bid a price ",
      inputs :[
        {
          name:'price',
          placeholder: 'Price'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Bid',
          handler: data=> {
            if(data.price != "") {
              if(eval(data.price) < eval(price)) {
                alert("Must input than "+price + " kd");
              } else {
                this.bid(data.price);
              }
            } else {
              return false;
            }
          }
        }
      ]
    });
    alertbox.present();
  }

  onprice(){
    let alertbox = this.alertCtrl.create({
      title: "Send a price to seller",
      inputs :[
        {
          name:'price',
          placeholder: 'Price'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Send',
          handler: data=> {
            if(data.price != "") {
              var pid = this.sub_profile_id;
              this.datamodel.notify_bidprice(pid, data.price, '0');
            } else {
              return false;
            }
          }
        }
      ]
    });
    alertbox.present();
  }

  loadBid() {
    var temp_url = 'http://sale4allz.com/ws/get_user_bid.php';
    var Form_data = new FormData();
    var pid = this.sub_profile_id;
    var id = this.sub_id;
    Form_data.append('profile_id', pid);
    Form_data.append('id', id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.bidprice = res['bidprice'];
        if(this.bidprice != null && this.bidprice != "0") {
          this.pressedOffer = 1;
        } else {
          this.bidprice = '0';
        }
    }, error => {
        alert("Error");
    });
  }
  loadreview() {
    var temp_url = 'http://sale4allz.com/ws/get_user_review.php';
    var Form_data = new FormData();
    var pid = this.sub_profile_id;
    Form_data.append('pid', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.ratingCount = res['items'].length; 
        this.myRating = res['rating'];
    }, error => {
        alert("Error");
    });
  }
  onfollow(pid) {
    if(Global.Static_profile_id == ""){
      alert("You must login.");
      return;
    }
    let load = this.loading.create({
        content: 'Loading...',
    });
    load.present();

    var temp_url = 'http://sale4allz.com/ws/update_follow.php';
    var Form_data = new FormData();
    
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('rid', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        load.dismissAll();
        this.checkfollow();
        var isfollow = this.isfollow;
        this.datamodel.notify_follow(pid, isfollow);
    }, error => {
        load.dismissAll();
        alert("Error");
    });
  }

  checkfollow() {
    var temp_url = 'http://sale4allz.com/ws/check_follow.php';
    var Form_data = new FormData();
    var pid = this.sub_profile_id;
    var id = this.sub_id;
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('rid', pid);
    Form_data.append('post_id', id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.isfollow = res["items"];
        //this.blike = res["islike"];
        if(res["items"] == "1")
          $('#bt_follow .button-inner').html("Followed");
        else 
          $('#bt_follow .button-inner').html(" + Follow");
          
    }, error => {
        alert("Error");
    });
  }

  ongobid() {
    this.navCtrl.push(BidPage,{});
  }

  goprofile(pid) {
    if(pid == Global.Static_profile_id) {
      this.navCtrl.push(MyprofilePage,{});
    } else {
      this.navCtrl.push(ProfilePage,{
        profile_id: pid
      });
    }
  }

  dataSourceUpdated(data)
  { 
    for(var i=0; i<data.length; i++) {
      if(data[i].id == this.sub_category_id) {
        this.catename = data[i].cate_name;
      }
    }
    this.loadreview();
    this.loadBid();

    var temp_url = 'http://sale4allz.com/ws/get_profile.php';
    var Form_data = new FormData();
    var pid = this.sub_profile_id;
    Form_data.append('profile_id', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        if(res['success'] == "true") {
          this.pData = res['items'][0];
            this.image = res['items'][0]['image'];
            this.username = res['items'][0]['username'];
            this.ison = res['items'][0]['ison'];
            if(this.ison == '1') {
              this.state = "online";
            } else {
              this.state = "offline";
            }
            this.membership1 = res['items'][0]['membership1'];
            this.membership2 = res['items'][0]['membership2'];
            this.membership3 = res['items'][0]['membership3'];
            this.membership4 = res['items'][0]['membership4'];
            this.membership = "Basic";
            if(this.membership2 != "") this.membership = "Professional";
            if(this.membership3 != "") this.membership = "Shop";
            if(this.membership4 != "") this.membership = "Company";
        } else {
            //alert(res['error']);
        }
    }, error => {
        
        alert("Error");
    });
  }

  goPostWnatedThing()
  {
    this.navCtrl.push(PostwantedthingPage);
  }

  clickprev() {
    if(this.idx > 1) {
      this.idx = this.idx - 1;
      $('#div_detail img').css('display', 'none');
      $('#img'+(this.idx-1)).fadeIn();
    }
  }
  clicknext() {
    var n = $('#div_detail img').length; 
    if(this.idx < n) {
      this.idx = this.idx + 1;
      $('#div_detail img').css('display', 'none'); 
      $('#img'+(this.idx-1)).fadeIn();
    }
  }

  gotoview(i) {
    var url = this.sub_url[i];
    this.navCtrl.push(FViewPage,{
      imgurl : url,
      offer : '0'
    }, {animation:'ios-transition'});
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
  
  onchat() {
    if(Global.Static_profile_id == ""){
      alert("You must login.");
      return;
    }

    var rid = this.sub_profile_id;
    if(rid == Global.Static_profile_id) {
      return;
    }
    this.navCtrl.push(ChatPage,{
      rid: rid
    });
  }
  clicklike() {
    
    if(Global.Static_profile_id == ""){
      alert("You must login.");
      return;
    }
    
    if(this.blike == "0")
      this.blike = "1";
    else
      this.blike = "0";
    

      let load = this.loading.create({
          content:'Please wait...'
      });
      load.present();

      var islike = this.blike;
      var post_id = this.sub_id;
      var wanted = this.sub_wanted;

      var temp_url = 'http://sale4allz.com/ws/like.php';
      var Form_data = new FormData();
      Form_data.append('id', post_id);
      Form_data.append('wanted', wanted);
      Form_data.append('islike', islike);
      Form_data.append('profile_id', Global.Static_profile_id);

      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
          load.dismissAll();
          this.presentToast("Added to your favorite list.");
      }, error => {
          load.dismissAll();
          alert("Error");
      });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  goreview() {
    var pid = this.sub_profile_id;
    var postid = this.sub_id;
    this.navCtrl.push(ReviewPage, {profile_id:pid, post_id: postid});
  }

  upgrade() {
    this.navCtrl.push(AddonsPage, {post_id: this.sub_id});
  }
  edit() {
    this.navCtrl.push(AddonsPage, {post_id: this.sub_id});
  }
  delete() {
    if(!confirm("Are you sure delete?")) {
        return;
    }
    var id = this.sub_id;
    this.datamodel.DeleteMyAds(id);
  }
}
