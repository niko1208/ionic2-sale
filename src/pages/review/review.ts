import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading, Platform, ToastController } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { SearchPage } from './../search/search';
import { ServerDataModel, ServerDataModelDelegate } from './../../app/model/ServerDataModel-helper';
import {MorePage} from '../more/more';
import * as $ from 'jquery';

@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
   providers : [ServerDataModel]
})

export class ReviewPage {

    loading: Loading;
    keys = [];
    public flag: any;

    public myRating1 = 0;
    public myRating2 = 0;
    public myRating3 = 0;
    public myRating4 = 0;
    public myRating5 = 0;

    public mark : string;
    public title = "";
    public review = "";
    public profile_id = "";
    public post_id;
    
    lang:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, platform:Platform, public datamodel:ServerDataModel,public toastCtrl: ToastController) {

                this.profile_id = navParams.get("profile_id");
                this.post_id = navParams.get("post_id");

                this.mark = '0.0';

                this.flag = Global.flag;
                this.lang = Global.Static_lang;
    
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
    this.lang = Global.Static_lang;
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }

    var pid = this.profile_id;
    var postid = this.post_id;
    var temp_url = 'http://sale4allz.com/ws/load_review.php';
    var Form_data = new FormData();
    Form_data.append('rid', pid);
    Form_data.append('post_id', postid);
    Form_data.append('profile_id', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        let items = res['items'];
        if(items.length > 0) {
          items = items[0];
          this.myRating1 = parseInt(items['mark1']);
          this.myRating2 = parseInt(items['mark2']);
          this.myRating3 = parseInt(items['mark3']);
          this.myRating4 = parseInt(items['mark4']);
          this.myRating5 = parseInt(items['mark5']);
          this.mark = items['mark'];
          this.title = items['title'];
          this.review = items['review'];
          this.presentToast("You are editing a previously written review.");
        }
    }, error => {
        
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

  ionViewDidLoad() {
    
  }

  writereview() {
      var mark = this.mark;
      if(mark == "0.0") {
        alert("Please select rating.")
      }
    
     
    this.loading = this.loadingCtrl.create({
        content: 'Posting...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/post_review.php';
    var Form_data = new FormData();
    var mark = this.mark;
    var title = this.title; 
    var review = this.review; 
    var pid = this.profile_id;
    var postid = this.post_id;
    var r1 = this.myRating1; 
    var r2 = this.myRating2; 
    var r3 = this.myRating3; 
    var r4 = this.myRating4; 
    var r5 = this.myRating5; 
    Form_data.append('rid', pid);
    Form_data.append('mark', mark);
    Form_data.append('title', title);
    Form_data.append('review', review);
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('mark1', r1.toString());
    Form_data.append('mark2', r2.toString());
    Form_data.append('mark3', r3.toString());
    Form_data.append('mark4', r4.toString());
    Form_data.append('mark5', r5.toString());
    Form_data.append('postid', postid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        this.navCtrl.pop();
        this.datamodel.notify_writerate(pid);
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  clickr(i, rate){
      if(i == 1) this.myRating1 = rate;
      if(i == 2) this.myRating2 = rate;
      if(i == 3) this.myRating3 = rate;
      if(i == 4) this.myRating4 = rate;
      if(i == 5) this.myRating5 = rate;

      this.calc();
  }
  calc() {
      var r1 = this.myRating1;
      var r2 = this.myRating2;
      var r3 = this.myRating3;
      var r4 = this.myRating4;
      var r5 = this.myRating5;
      let s = r1*1.0 + r2*1.0 + r3*1.0 + r4*1.0 + r5*1.0;

      this.mark = ((s/5).toFixed(1)).toString();
  }


}
