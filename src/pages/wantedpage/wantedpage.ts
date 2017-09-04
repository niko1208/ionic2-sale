import { LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams , ToastController} from 'ionic-angular';
import { PostDataModel } from './../../app/model/PostDataModel';
import { Service } from './../../providers/service';
import { MyDataModel } from './../../app/model/DataModel';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import { FViewPage } from './../fview/fview';
import { PostwantedthingPage } from './../postwantedthing/postwantedthing';
import { ChatPage } from './../chat/chat';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { Global } from './../../app/model/global';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
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
  selector: 'page-wantedpage',
  templateUrl: 'wantedpage.html',
   providers : [Service,ServerDataModel]
})
export class WantedthingPage  implements ServerDataModelDelegate{

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

  public catename : any;

  public idx : any;
  public blike : any;
  public bpopup : any;
  public bsms : any;
  public dialog_title : any;
  public phonenumber = "+1-1111-111-1111";

  keys : Array<MyDataModel> = [];
  temp : any;
  public  postsDataArray : Array<PostDataModel> = new Array<PostDataModel>();

  public likeary = [];

    public flag: any;
    public badge = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private loading:LoadingController, public datamodel:ServerDataModel, public _http:Http, private ev: Events) {
    this.navCtrl = navCtrl;

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
    this.idx = 1;
    this.blike = "";
    this.bpopup = false;
    this.bsms = false;
    this.sub_wanted = navParams.get("wanted");
    this.sub_category_id    = navParams.get("category_id");
    
    this.catename = "";
    this.flag = Global.flag;

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
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    this.datamodel.updateviews(this.sub_id, this.sub_wanted);
    

    this.datamodel.GetWantedPost();
    this.datamodel.homedelegate = this;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LatestSubPage');
    
  }

  dataSourceUpdated(data)
  { 
      this.keys = [];

      this.postsDataArray = data;
      
      let id = this.sub_id; 

      for (let index in this.postsDataArray)
      {
        this.temp = this.postsDataArray[index];
        if(this.temp['post_id'] == id) {
            this.keys.push(this.temp);
            break;
        }
      }
      for (let index in this.postsDataArray)
      {
        this.temp = this.postsDataArray[index];
        if(this.temp['post_id'] != id) {
          this.keys.push(this.temp);
        }
      }

      for (let index in this.keys)
      {
        this.temp = this.keys[index];
        this.likeary.push(this.temp['islike']);
      }
      
      if(id != "0") {
          
          //console.log($('#item_'+String(id)));
          /*
          $('.sub_content').animate({
              scrollTop: $('#item_'+id).offset().top
          }, 500);*/
      }
      
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
  goPostWnatedThing()
  {
    this.navCtrl.push(PostwantedthingPage);
  }

  gotoview(i) {
    var url = this.keys[i]['post_img_url'];
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
  
  onchat(rid) {
    if(Global.Static_profile_id == ""){
      alert("You must login.");
      return;
    }
    if(rid == Global.Static_profile_id) {
      return;
    }
    this.navCtrl.push(ChatPage,{
      rid: rid
    });
  }

  onlike(post_id, wanted, islike, idx) {

    if(Global.Static_profile_id == ""){
      alert("You must login.");
      return;
    }
      let load = this.loading.create({
          content:'Please wait...'
      });
      load.present();

      if(islike == '1') islike = '0';
      else islike = '1';
      
      var temp_url = 'http://sale4allz.com/ws/like.php';
      var Form_data = new FormData();
      Form_data.append('id', post_id);
      Form_data.append('wanted', wanted);
      Form_data.append('islike', islike);
      Form_data.append('profile_id', Global.Static_profile_id);

      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
          load.dismissAll();
          this.likeary[idx] = islike;
          this.presentToast("Added to your favorite list.");
      }, error => {
          load.dismissAll();
          alert("Error");
      });
  }

  onfollow(pid, i, isfollow) {
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
        this.datamodel.GetWantedPost();
        this.datamodel.notify_follow(pid, isfollow);
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

}
