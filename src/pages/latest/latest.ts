import { Global } from './../../app/model/global';
import { LatestSubPage } from './../latest-sub/latest-sub';
import { PostwantedthingPage } from './../postwantedthing/postwantedthing';
import { ActionSheetController } from 'ionic-angular';
import { PostDataModel } from './../../app/model/PostDataModel';
import { Service } from './../../providers/service';
import { MyDataModel } from './../../app/model/DataModel';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import { PostPage } from './../post/post';
import { LoginPage } from './../login/login';
import { WantedthingPage } from './../wantedpage/wantedpage';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { TopsellerPage } from './../topseller/topseller';
import { SearchPage } from './../search/search';
import { BidPage } from './../bid/bid';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { MorePage } from '../more/more';
import * as $ from 'jquery';

/*
  Generated class for the Latest page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-latest',
  templateUrl: 'latest.html',
   providers : [Service,ServerDataModel]
})
export class LatestPage implements ServerDataModelDelegate {


///////////////////////server data//////////////
  serverData : any ;
  keys : Array<MyDataModel> = [];
  temp : any;
  pids = [];
  info_text = [];

  public clickFollow = false;
  flag : any;
    public badge = '0';
  /////////////////////////////
  public  postsDataArray : Array<PostDataModel> = new Array<PostDataModel>();

  constructor(public navCtrl: NavController, public navParams: NavParams,public datamodel:ServerDataModel, private ev: Events) {

    this.flag = Global.flag;
    
     this.navCtrl = navCtrl;
     this.flag = Global.flag;
    this.badge = Global.badge;
    
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    


    //  this.datamodel.GetPostProducts();
    //  this.datamodel.homedelegate = this;
  }

 ionViewWillEnter()
 {
    this.datamodel.GetPostProducts(this.clickFollow);
    this.datamodel.homedelegate = this;
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }

    this.info_text = [];
    this.info_text.push({title: 'POST AD', text:'To post an advertisement and list your item in secs'});
    this.info_text.push({title: 'BIDS', text:'Bids page where you can find all items that in bidding now from different sellers'});
    this.info_text.push({title: 'TOPSELLER', text:'here to view best and top sellers in the app, according to their achievements and ratings,badges'});
    this.info_text.push({title: 'SHOPS', text:'To browser officially certificated shops advertisements.'});
    
    this.info_text.push({title: 'ALL', text:'To view all ads from all categories.'});
    this.info_text.push({title: 'FOLLOWING', text:'to view ads only from the sellers that you follow.'});

    this.info_text.push({title: 'LASTEST', text:'To view newest items/products in all the categories, or for your following sellers.'});
    this.info_text.push({title: 'HOME', text:'to browser categories and explore products and sellers.'});
    this.info_text.push({title: 'OFFERS', text:'featured offers and promotions from companies or sellers.'});
    this.info_text.push({title: 'CHAT', text:'Your communication page with customers or sellers. to chat and make deals.'});
    this.info_text.push({title: 'PROFILE', text:'to show profile status and manage or upgrade your ads, it is the place where you can start your business.'});

    this.info_text.push({title: 'SEARCH', text:'to find specific seller/shop or item.'});
    this.info_text.push({title: 'BELL', text:'your notification place to view account activites and updates.'});
    this.info_text.push({title: 'FLAQ', text:'Your current country that you sell and buy in.'});
    this.info_text.push({title: 'MENU', text:'app settings and configrations.'});

    this.ev.publish('setinfo', this.info_text);
 }

  gotonotification() {
    this.navCtrl.push(MynotificationPage);
  }
  gotoprofile() {
    this.navCtrl.push(MorePage);
  }

  onPageDidEnter() {
    //   this.datamodel.GetPostProducts();
    //  this.datamodel.homedelegate = this;
  }

  goBidPage(){
      this.navCtrl.push(BidPage,{});
  }
  gotosearch(){
    this.navCtrl.push(SearchPage,{});
  }

  goTopSellerPage() {
    this.navCtrl.push(TopsellerPage);
  }

  showdata(sec) {
    $('.col_tab').removeClass("sel");
    $('#tab_'+sec).addClass("sel");
    let isfollow = false;
    if(sec == 'following') {
      isfollow = true;
      this.clickFollow = true;
    } else {
      this.clickFollow = false;
    }
    this.datamodel.GetPostProducts(isfollow);
  }
  
   dataSourceUpdated(data)
  {
      console.log(data);
      this.keys = [];
      this.pids = [];
      let pid = "";
     
      this.postsDataArray = data;
     
      for (let index in this.postsDataArray)
      {
        this.temp = this.postsDataArray[index];
        if(this.temp.pid != pid) {
          this.pids.push(this.temp);
          pid = this.temp.pid;
        }
        this.keys.push(this.temp);
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LatestPage');
  }

  goSearch() {
    this.navCtrl.push(SearchPage);
  }

  goWnatedThing()
  {
    this.navCtrl.push(WantedthingPage,{
         id:'0'
    });
    //this.navCtrl.push(WantedthingPage);
  }

  goPostPage()
  {
    if(Global.Static_profile_id == "") {
      alert("You have to login.");
      this.navCtrl.push(LoginPage,{}, {animate:true, direction:'backward', animation:'ios-transition'});
    } else {
      Global.Static_initPost = "1";
      this.navCtrl.push(PostPage);
    }
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
      var send_isfollow    = send_array["post_profile_isfollow"];
      var condition    = send_array["condition"];
      var delivery    = send_array["delivery"];
      var delivery_cost    = send_array["delivery_cost"];
      var likes    = send_array["likes"];

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
         isfollow: send_isfollow,
         condition: condition,
         delivery: delivery,
         delivery_cost: delivery_cost,
         likes: likes
       });
      }
  }

  showInfo() {
    this.ev.publish('showinfo', true);
  }
}
