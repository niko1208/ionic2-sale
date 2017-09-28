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
import { ProfilePage } from './../profile/profile';
import { LoginPage } from './../login/login';
import { WantedthingPage } from './../wantedpage/wantedpage';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { TopsellerPage } from './../topseller/topseller';
import { SearchPage } from './../search/search';
import { BidPage } from './../bid/bid';
import { Events, LoadingController } from 'ionic-angular';
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
  searchTerm: string="";
  list = [];

  detailpage = DetailPage;
////////////////////////server data//////////////
  serverData : any ;
  keys : Array<MyDataModel> = [];
  temp : any;
  /////////////////////////////
  public  postsDataArray : Array<MyDataModel> = new Array<MyDataModel>();


    public flag: any;
    public badge = '0';
    info_text = [];

  constructor( public plateform:Platform, public navCtrl: NavController, public viweCtrl : ViewController,public server :Service,public http: Http,public datamodel:ServerDataModel, private ev: Events, public _http:Http, private loading:LoadingController)
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
  goRProfile(i) {
    this.navCtrl.push(ProfilePage,{
      profile_id: this.list[i].profile_id
    });
  }

  setFilteredItems() {

  }

  search() {
    this.navCtrl.push(SearchPage,{searchTerm: this.searchTerm});
  }
  
  ionViewWillLeave()
  {
    this.ev.publish('showinfo', false, 0, 'l', '1');
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
  var temp_url = 'http://sale4allz.com/ws/get_topseller.php';
    var Form_data = new FormData();
    Form_data.append('mypid', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
      this.list = [];
      let cc = res["items"].length;
      if(cc > 10) cc = 10;
      for(let i=0; i<cc; i++) {
        let item = res['items'][i];
        item['membership'] = "";
        if(item.membership1 != "") item.membership = "Basic";
        if(item.membership2 != "") item.membership = "Professional";
        if(item.membership3 != "") item.membership = "Shop";
        if(item.membership4 != "") item.membership = "Company";
        res['items'][i] = item;
        res['items'][i]['about'] = res['items'][i]['about'].replace(/\n/g, "<br/>");
        this.list.push(item);
      } 
    }, error => {
        alert("Error");
    });

  
    this.info_text = [];
    this.info_text.push({title: 'POST AD', text:'To post an advertisement and list your item in secs'});
    this.info_text.push({title: 'BIDS', text:'Bids page where you can find all items that in bidding now from different sellers'});
    this.info_text.push({title: 'TOPSELLER', text:'here to view best and top sellers in the app, according to their achievements and ratings,badges'});
    this.info_text.push({title: 'SHOPS', text:'To browser officially certificated shops advertisements.'});
    
    this.ev.publish('setinfo', this.info_text, true, true);
}

  showInfo() {
    this.ev.publish('showinfo', true, 0, 'l');
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
        this.datamodel.notify_follow(pid, isfollow);
        if(isfollow == '1') isfollow = '0';
        else isfollow = '1';
        this.list[i].isfollow = isfollow;
    }, error => {
        load.dismissAll();
        alert("Error");
    });
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
