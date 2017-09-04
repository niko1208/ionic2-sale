import { DetailSubPage } from './../detail-sub/detail-sub';
import { LoadingController } from 'ionic-angular';
import { Service } from '../../providers/service';
import { MyDataModel } from './../../app/model/DataModel';
import { ServerDataModel } from '../../app/model/ServerDataModel-helper';
import { Component } from '@angular/core';
import { DetailPage1 } from '../detail1/detail1';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';

import { Global } from './../../app/model/global';
import { NavController, NavParams,ViewController, Events } from 'ionic-angular';
import * as $ from 'jquery';

/*
  Generated class for the Detail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
  providers : [Service,ServerDataModel]
})
export class DetailPage {

   data_array:any;

   public firstParam : string;
   public cate_name : string;
   public cate_ar_name : string;

   public  postsDataArray : Array<MyDataModel> = new Array<MyDataModel>();

   keys_detail : Array<MyDataModel> = [];
   temp_detail : any;

    public flag: any;
    public badge = '0';

   constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public params :NavParams,public model :ServerDataModel,private loading:LoadingController, private ev: Events)  {
    this.navCtrl = navCtrl;
   // this.initDataArray();
/////////////////////////////get parameter////////////////////////////////
    this.firstParam = params.get("item_id");
    this.cate_name = params.get("cate_name");
    this.cate_ar_name = params.get("cate_ar_name");
    //var int_firstparam =  +this.firstParam;
//////////////////////////////////////////////////////////////////////////
///////////////////////////get data from server///////////////////////////
     this.model.SendPost(this.firstParam);
///////////////////////////delegate function defintion///////////////////
    this.model.homedelegate = this;

//////////////////////////////////////////////////////////////////////////

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
  
  dataSourceUpdated(data)
  {

      console.log("delegatedatadetail ==>",data)
      this.postsDataArray = data;
      console.log("clicked buttonid", this.postsDataArray);
      for (let index in this.postsDataArray)
    {

      this.temp_detail = this.postsDataArray[index];

       this.keys_detail.push(this.temp_detail);
    }
     console.log("temp====>",this.keys_detail)
  }

  ionViewDidLoad() {
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    console.log('ionViewDidLoad DetailPage');
   // this.navCtrl.canGoBack();

  }
 
OnClickItem(id, i)
{
  var hascate = this.keys_detail[i]['hascate'];

  var name = this.keys_detail[i]['cate_name'];
  var name1 = this.keys_detail[i]['cate_ar_name'];
  console.log(this.keys_detail[i]);
  if(hascate != '0') {
    this.navCtrl.push(DetailPage1,{
       item_id : id,
       cate_name : name,
       cate_ar_name : name1
     });
  } else {
     this.navCtrl.push(DetailSubPage,{
       detail_item_id : id
     });
  }
}

 goBack(){
     console.log('click close button');

     this.navCtrl.pop();
  }

    initDataArray()
  {
      this.data_array =
      [

        {
               flag:"true",
              items: [
                  {title: 'Property for Sale', imgurl: "img/property2.jpg"},
                  {title: 'For rent', imgurl:"img/pro1.jpg" },
                  {title: 'Switch Property', imgurl:"img/pro2.jpg"},
                   {title: 'International Real Estate', imgurl: "img/pro3.jpg"},
                  {title: 'Shops for sale', imgurl:"img/pro4.jpg" },
                  {title: 'Required property', imgurl:"img/pro5.jpg"},
              ],

          },

          {
              flag:"false",
              items: [
                  {title: 'Lands for sale', imgurl: "img/pro7.jpg"},
                  {title: 'Offices & Stores', imgurl:"img/pro1.jpg" },
                  {title: 'Serviced Property', imgurl:"img/pro2.jpg"},
                   {title: 'Chalets for sale', imgurl: "img/pro3.jpg"},
                  {title: 'Chalets for rent', imgurl:"img/pro4.jpg" },
                  {title: 'Farms for sale', imgurl:"img/pro5.jpg"},
              ],

          }

        ];
  }

}
