import { Global } from './../../app/model/global';
import { CategoryDelegate } from './wanted';
import * as $ from 'jquery';
import { TreeModel } from '../../app/model/TreeDataModel';
import { Service } from './../../providers/service';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



export interface CategoryDelegate
{
   categoryUpdate(any);
}
/*
  Generated class for the Wanted page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({ 
  selector: 'page-wanted1',
  templateUrl: 'wanted1.html',
  providers:[Service,ServerDataModel]
})
export class WantedPage1 implements ServerDataModelDelegate {

////////////////////////server data//////////////
  serverData : any ;
  keys : Array<TreeModel> = [];
  temp : any;

  keys_sub = [];
  temp_sub :any;

    flag : boolean  = false;

    add_cate_array = [];
    add_cate_nameArray = [];
    temp_array = [];

  /////////////////////////////
  public  postsDataArray : Array<TreeModel> = new Array<TreeModel>();

  constructor(public navCtrl: NavController, public navParams: NavParams,public wantedModel:ServerDataModel)
  {
    this.wantedModel.homedelegate = this;
    this.wantedModel.GetTreeCategoryInformation();

  }


  dataSourceUpdated(data)
  {
      this.postsDataArray = data;
      console.log(data);

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

  }

  ionViewDidLoad() {

    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
  }

  onCickParentItem(index)
  {

    // !this.flag == this.flag
    console.log("clicked parent item",this.keys_sub[index]);

    // if(this.flag == false)
    // {
     // $("."+index).append("<button *ngFor = 'let item of keys_sub[i]><img src ='{{item.image_file}}'></button><label>geegegege</label>");
    // }
  }
/*
  clickItem(i)
  {

      var str  = this.postsDataArray[i].cate_name;
      var category_id = this.postsDataArray[i].id;

      Global.Static_category = str;
      Global.Static_category_id = category_id;
            
      Global.Static_initPost = "0";
      this.navCtrl.pop();
  }
*/
  clickItem(i) {
    if($('.list1_'+i).css('display') == 'block') {
      $('.list1_'+i).css('display', 'none');
    } else {
      $('.list1').css('display', 'none');
      $('.list1_'+i).css('display', 'block');
    }
  }
  clickItem1(j, item1) {
    if(!('tree' in item1)) {
      Global.Static_category = item1.name;
      Global.Static_category_id = item1.id;
      Global.Static_initPost = "0";
      this.navCtrl.pop();
      return;
    }
    if($('.list2_'+j).css('display') == 'block') {
      $('.list2_'+j).css('display', 'none');
    } else {
      $('.list2').css('display', 'none');
      $('.list2_'+j).css('display', 'block');
    }
  }
  clickItem2(k, item2) {
    Global.Static_category = item2.name;
    Global.Static_category_id = item2.id;
    Global.Static_initPost = "0";
    this.navCtrl.pop();
    return;
  }
}
