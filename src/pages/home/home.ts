import { Console } from '@angular/compiler/src/private_import_core';
import { MyDataModel } from './../../app/model/DataModel';
import { serialize } from '@angular/compiler/src/i18n/serializers/xml_helper';
import { Global } from './../../app/model/global';
import { ServerDataModel,ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import { Http } from '@angular/http';
import { Service } from './../../providers/service';
import { Component } from '@angular/core';
import { DetailPage } from '../detail/detail';
import { PostPage } from './../post/post';
import { LoginPage } from './../login/login';
import { WantedthingPage } from './../wantedpage/wantedpage';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { TopsellerPage } from './../topseller/topseller';
import { SearchPage } from './../search/search';
import { BidPage } from './../bid/bid';
import { Events } from 'ionic-angular';
import {MorePage} from '../more/more';
import 'rxjs/add/operator/map';
import * as $ from 'jquery';


import { NavController,ViewController,Platform} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers : [Service,ServerDataModel]
})


export class HomePage implements ServerDataModelDelegate {

  headers_title:any;
  image_names:any;

  data_array:any;
  my_array : any;
  keys_sub = [];
  temp_sub :any;

  detailpage = DetailPage;
////////////////////////server data//////////////
  serverData : any ;
  keys : Array<MyDataModel> = [];
  temp : any;
  /////////////////////////////
  public  postsDataArray : Array<MyDataModel> = new Array<MyDataModel>();


    public flag: any;
    public badge = '0';

  constructor( public plateform:Platform, public navCtrl: NavController, public viweCtrl : ViewController,public server :Service,public http: Http,public datamodel:ServerDataModel, private ev: Events)
   {
     this.navCtrl = navCtrl;
     this.plateform = plateform;
     //this.initDataArray();

    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })
    
    this.flag = Global.flag;
    

  }

  gotonotification() {
    this.navCtrl.push(MynotificationPage);
  }
  gotoprofile() {
    this.navCtrl.push(MorePage);
  }
  
ionViewWillEnter()
{

    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
  ///////////////////////////////this array is used of hometab page//////////////////////////////////////////////////////
    
     this.datamodel.GetTreeCategoryInformation();
     this.datamodel.homedelegate = this;
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

  goBidPage(){
    this.navCtrl.push(BidPage,{});
  }
  goTopSellerPage() {
    this.navCtrl.push(TopsellerPage);
  }
  
  gotosearch(){
    this.navCtrl.push(SearchPage,{});
  }

  dataSourceUpdated(data)
  {
    
    this.keys = [];
      console.log("delegatedata ==>",data);
      this.postsDataArray = data;
      console.log("home page------------------------");
      console.log(data);
      console.log(this.postsDataArray);

      for (let index in this.postsDataArray)
    {

      this.temp = this.postsDataArray[index];

       this.keys.push(this.temp);
    }
     console.log("temp====>",this.keys)
     /*
    console.log(" wanted delegatedata ==>",data)
      this.postsDataArray = data;

      for (let index in this.postsDataArray)
    {

      this.temp = this.postsDataArray[index];

       this.keys.push(this.temp);
    }

     for (let i in this.keys)
    {
        this.temp_sub = this.keys[i]["tree_array"];
       this.keys_sub.push(this.temp_sub);
    }
    */
  }

  clickItem(i,button_index)
  {
      var str  = this.keys[i]["tree_array"][button_index].name;
      var category_id = this.keys[i]["tree_array"][button_index].id;
      this.navCtrl.push(DetailPage,{
       item_id : category_id,
       cate_name : str,
       cate_ar_name : str
     });
  }

  initDataArray()
  {
      this.data_array = [
    {
            title: 'Featured',
            items: [
                {title: 'Property', imgurl: "img/property1.jpg"},
                {title: 'Motors', imgurl:"img/motor3.jpg" },
                {title: 'Electronics', imgurl:"img/elc1.jpg"}
            ]
    },
        {
            title: 'Services',
            items: [
                {title: 'Pack & Move', imgurl: "img/pack1.jpg"},
                {title: 'General Contracting', imgurl:"img/contracting.jpg" },
                {title: 'Satellite', imgurl:"img/satellite.jpg"},
                {title: 'Nannies & Laborers', imgurl:"img/2.jpg"}
            ]
        },
        {
            title: 'Family',
            items: [
                {title: 'Man', imgurl: "img/man.jpg"},
                {title: 'Woman', imgurl:"img/woman.jpg" },
                {title: 'Children', imgurl:"img/children.jpg"},
                {title: 'Gift & Watches', imgurl:"img/gift.jpg"}
            ]
        }
    ];
  }


    gotoNextPage(id, name, name1)
  {

    //var navOptions = { animate : true, direction:'back'};
    //  var navOptions = {
    //   animation: 'ios-transition'};
    // this.navCtrl.push(DetailPage,{},{animate:true,direction:'back'});
     this.navCtrl.push(DetailPage,{
       item_id : id,
       cate_name : name,
       cate_ar_name : name1
     });

    //this.navCtrl.setRoot(DetailPage);
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

  goWnatedThing()
  {
    this.navCtrl.push(WantedthingPage,{
         id:'0'
    });
    //this.navCtrl.push(WantedthingPage);
  }
}
