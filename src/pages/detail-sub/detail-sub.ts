import { LatestSubPage } from './../latest-sub/latest-sub';
import { PostDataModel } from './../../app/model/PostDataModel';
import { MyDataModel } from './../../app/model/DataModel';
import { Service } from './../../providers/service';
import { Component } from '@angular/core';
import { NavController, NavParams , Events} from 'ionic-angular';
import { ServerDataModel } from '../../app/model/ServerDataModel-helper';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { Data } from '../../providers/data';
import { Global } from './../../app/model/global';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import * as $ from 'jquery';

/*
  Generated class for the DetailSub page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-sub',
  templateUrl: 'detail-sub.html',
  providers : [Service,ServerDataModel, Data]
})
export class DetailSubPage {


 public Array_sub_category : Array<PostDataModel> = new Array<PostDataModel>();

  model_sub_category = [];
  temp_detail : any;

 str_parm : string;

  public searchTerm : string;

    public flag: any;
    public badge = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams,public model : ServerDataModel, public dataService: Data, private ev: Events) {

       this.navCtrl = navCtrl;
       this.str_parm = navParams.get("detail_item_id")
       model.homedelegate = this;

       this.searchTerm = "";
       
   // this.initDataArray();

    this.flag = Global.flag;
    this.badge = Global.badge;
    
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    
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
  
  setFilteredItems() {
    this.model_sub_category = this.dataService.filterItems(this.searchTerm);
  }

  ionViewWillEnter()
  {
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    /////////////////////////////get parameter////////////////////////////////

    //var int_firstparam =  +this.firstParam;
//////////////////////////////////////////////////////////////////////////
///////////////////////////get data from server///////////////////////////
     this.model.GetPostFromCategoryId(this.str_parm);
///////////////////////////delegate function defintion///////////////////


//////////////////////////////////////////////////////////////////////////
  }

    dataSourceUpdated(data)
  {
      console.log("sub_detail ==>",data)
      this.Array_sub_category = data;
      this.model_sub_category = [];
      console.log("sub_detail", this.Array_sub_category);
      for (let index in this.Array_sub_category)
    {

      this.temp_detail = this.Array_sub_category[index];

       this.model_sub_category.push(this.temp_detail);
    }

    this.dataService.items = this.model_sub_category;
     console.log("modelsub===>",this.model_sub_category)
  }

  click_carddetail(i)
  {
      var send_array = this.model_sub_category[i]; 
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailSubPage');
  }

}
