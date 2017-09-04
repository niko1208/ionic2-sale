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
  selector: 'page-wanted',
  templateUrl: 'wanted.html',
  providers:[Service,ServerDataModel]
})
export class WantedPage implements ServerDataModelDelegate {

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

  clickItem(i,button_index)
  {

      var str  = this.keys[i]["tree_array"][button_index].name;
      var category_id = this.keys[i]["tree_array"][button_index].id;

      Global.Static_category = str;
      Global.Static_category_id = category_id;
      this.wantedModel.GetPostProducts();
      
      Global.Static_initPost = "0";
      this.navCtrl.pop();
    //   if($("#Location" + i + button_index + "").hasClass("checked"))
    //   {
    //      $("#Location" + i + button_index + "").removeClass("checked")
    //      $("#Location" + i + button_index + "").css("background-color", "gray");
    //      var idx =  this.add_cate_array.indexOf(this.keys[i]["tree_array"][button_index].image_file);

    //      if (idx != -1) {
    //       this.add_cate_array.splice(idx, 1); // The second parameter is the number of elements to remove.
    //       this.add_cate_nameArray.splice(idx,1);
    //        }
    //   }
    //   else{
    //      $("#Location" + i + button_index + "").css("background-color", "yellow");
    //      $("#Location" + i + button_index + "").addClass("checked");
    //      this.add_cate_array.push(this.keys[i]["tree_array"][button_index].image_file);
    //      this.add_cate_nameArray.push(this.keys[i]["tree_array"][button_index].name);
    //  }
  }

}
