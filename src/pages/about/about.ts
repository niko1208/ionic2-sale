import { ServerDataModel } from './../../app/model/ServerDataModel-helper';
// import { JsonData } from './../../providers/json-data';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FViewPage } from './../fview/fview';
import { LatestSubPage } from './../latest-sub/latest-sub';
import {MorePage} from '../more/more';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
 providers : [ServerDataModel]
})
export class AboutPage {

  putdata : any = [];

  current_date : string = new Date().toISOString();
  pass_time : any;
  post_date : string;

  constructor(public navCtrl: NavController,public model : ServerDataModel) {


    }


  ionViewWillEnter()
  {

    this.model.GetOffers();
    this.model.homedelegate = this;

  }

  dataSourceUpdated(data)
  {
      this.putdata = [];
      let postsDataArray = data;
      // this.postsDataArray = new Array<PostDataModel>();
      for (let index in postsDataArray)
    {

      let temp = postsDataArray[index];

       this.putdata.push(temp);
    }
    console.log(this.putdata);
      
  }

/*
  gotoview(suburl, ofid, viewcount) {
    
    var url = suburl;
    this.navCtrl.push(FViewPage,{
      imgurl : url,
      offer : '1',
      id : ofid,
      view: viewcount
    }, {animation:'ios-transition'});
  }*/
  gotoview(i) {
    var send_array = this.putdata[i]; 
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
        wanted:send_wanted,
        category_id:send_category_id,
        islike:send_islike,
        profile_id: send_profile_id,
        isfollow: send_isfollow
      });
      
  }

}
