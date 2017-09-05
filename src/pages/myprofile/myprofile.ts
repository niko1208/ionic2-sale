import { Component } from '@angular/core';
import { ViewController, NavController, ActionSheetController, ToastController, Platform, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { PostPage } from '../post/post';
import { MyadsPage } from '../myads/myads';
import { MychatPage } from '../mychat/mychat';
import { MyprofileinfoPage} from '../myprofileinfo/myprofileinfo';
import { MynotificationPage } from './../notification/notification';
import { FollowPage } from './../follow/follow';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
import { MembershipPage } from './../membership/membership';
import { FavoritePage } from '../favorite/favorite';
import {MorePage} from '../more/more';
import * as $ from 'jquery';

declare var cordova : any;

@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html'
})

export class MyprofilePage {

    lastImage: string = null;
    public pnumber = "";
    public follower = "0";
    public following = "0";
    public myads = "";
    public myfreeads = "";
    public preads = "";
    public pinads = "";
    public vipads = "";
    public offads = "";
    public email = "";
    public username = "";
    public image = "";
    public adspackage = "";
    public apage = "";
    public myRating = "0.0";
    public ratingCount = 0;
    public balance = "20";
    points = "2000";
    public profiledata : any;

    loading: Loading;
    public phonecode = "";
    public prevView : any;

    public flag: any;
    public badge = '0';
    public membership1 = '';
    public membership2 = '';
    public membership3 = '';
    public membership4 = '';
    public membership = '';

    public strtooltip = "";
    public tool_tip = false;

    public percent1 = "";
    public percent2 = "";
    public percent3 = "";
    public percent4 = "";
    public p1 = "";
    public p2 = "";
    public p3 = "";
    public p4 = "";
    public pp1 = "";
    public pp2 = "";
    public pp3 = "";
    public pp4 = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, public actiionSheetCtrl:ActionSheetController, public toastCtrl: ToastController, public platform: Platform, private ev: Events) {

                
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
  
  ionViewWillEnter()
  {
    this.percent1 = "";
    this.percent2 = "";
    this.percent3 = "";
    this.percent4 = "";
    this.p1 = "";
    this.p2 = "";
    this.p3 = "";
    this.p4 = "";
    this.pp1 = "";
    this.pp2 = "";
    this.pp3 = "";
    this.pp4 = "";

    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
    this.loadProfile();
    this.loadreview();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    
  }
  loadreview() {
    var temp_url = 'http://sale4allz.com/ws/get_user_review.php';
    var Form_data = new FormData();
    var pid = Global.Static_profile_id;
    Form_data.append('pid', pid);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.ratingCount = res['items'].length; 
        this.myRating = res['rating'];
    }, error => {
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

  onclearbid() {
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/clear_bid.php';
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        this.presentToast("Cleared your bids.");
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  loadProfile() {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/get_profile.php';
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        if(res['success'] == "true") {
          this.profiledata = res['items'][0];
            this.pnumber = res['items'][0]['phone'];
            this.image = res['items'][0]['image'];
            this.email = res['items'][0]['email'];
            this.username = res['items'][0]['username'];
            this.balance = res['items'][0]['balance'];
            this.points = res['items'][0]['points'];

            this.myfreeads = Math.floor(parseFloat(this.balance) / 0.5).toString();
            this.myfreeads = (parseInt(this.myfreeads)*1 + parseInt(res['items'][0]['num_posts'])).toString();
            this.preads = res['items'][0]['num_pre_posts'];
            this.pinads = res['items'][0]['num_pin_posts'];
            this.vipads = res['items'][0]['num_vip_posts'];
            this.offads = res['items'][0]['num_offer_posts'];
            this.membership1 = res['items'][0]['membership1'];
            this.membership2 = res['items'][0]['membership2'];
            this.membership3 = res['items'][0]['membership3'];
            this.membership4 = res['items'][0]['membership4'];

            this.membership = "Free";
            if(this.membership1 != "") this.membership = "Basic";
            if(this.membership2 != "") this.membership = "Professional";
            if(this.membership3 != "") this.membership = "Shop";
            if(this.membership4 != "") this.membership = "Company";

            let points = parseInt(this.points);
            if(points <= 400) {
              this.p1 = Math.floor(points*100/400).toString() + "%";
              this.pp1 = this.points + " / 400 points";
            } else if(points > 400 && points <= 600) {
              this.p1 = "100%";
              this.p2 = Math.floor(points*100/600).toString() + "%";
              this.pp1 = "400 / 400 points";
              this.pp2 = this.points + " / 600 points";
            } else if(points > 600 && points <= 1000) {
              this.p1 = "100%";
              this.p2 = "100%";
              this.p3 = Math.floor(points*100/1000).toString() + "%";
              this.pp1 = "400 / 400 points";
              this.pp2 = "600 / 600 points";
              this.pp3 = this.points + " / 1000 points";
            } else if(points > 1000) {
              this.p1 = "100%";
              this.p2 = "100%";
              this.p3 = "100%";
              if(Math.floor(points*100/1500) <= 100) {
                this.p4 = Math.floor(points*100/1500).toString() + "%";
              } else {
                this.p4 = "100%";
              }
              this.pp1 = "400 / 400 points";
              this.pp2 = "600 / 600 points";
              this.pp3 = "1000 / 1000 points";
              this.pp4 = this.points + " / 1500 points";
            }

            this.loadFollower();
        } else {
            alert(res['error']);
        }
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });
  }

  onmembership() {
    this.navCtrl.push(MembershipPage);
  }

  onfollowing() {
    var pid = Global.Static_profile_id;
    var uname = this.username;
    this.navCtrl.push(FollowPage, {
      profile_id:pid, 
      mypid:Global.Static_profile_id, 
      follow:'following',
      username: uname
    });
  }

  onfollower() {
    var pid = Global.Static_profile_id;
    var uname = this.username;
    this.navCtrl.push(FollowPage, {
      profile_id:pid, 
      mypid:Global.Static_profile_id, 
      follow:'follower',
      username: uname
    });
  }

  loadFollower() {

    var temp_url = 'http://sale4allz.com/ws/get_user_follower.php';
    var Form_data = new FormData();
    var pid = Global.Static_profile_id;
    Form_data.append('profile_id', pid);
    Form_data.append('mypid', Global.Static_profile_id);
    Form_data.append('isnum', '1');

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.follower = res["items"];
        this.following = res["items1"];;
    }, error => {
        alert("Error");
    });
  }

  onmyads() {
      this.navCtrl.push(MyadsPage,{});
  }
  onpost() {
    this.navCtrl.push(PostPage,{});
  }
  onmychat() {
      this.navCtrl.push(MychatPage,{});
  }

  onsave() {
    var url = "http://sale4allz.com/ws/update_profile.php";

      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);

      // File name only
      
      var filename = this.lastImage;
        console.log(this.lastImage,targetPath);
      var options = {
        fileKey: "media_file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename, 'profile_id':Global.Static_profile_id}
      };

      const fileTransfer = new Transfer();

      this.loading = this.loadingCtrl.create({
        content: 'Saving...',
      });
      this.loading.present();
      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(data => {
        this.loading.dismissAll();
        this.presentToast('Succesful updated.');
        this.navCtrl.pop();
      }, err => {
        this.loading.dismissAll()
        this.presentToast('Error while updating.');
      });
  }


 public presentActionSheet() {
    let actionSheet = this.actiionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
             this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
             this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    targetWidth: 640,
    targetHeight: 960
  };

  // Get the data of an image
  Camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
      FilePath.resolveNativePath(imagePath)
      .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
 }

// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}

// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
    this.image = this.pathForImage(this.lastImage);
    this.onsave();
  }, error => {
    this.presentToast('Error while storing file.');
  });
}

// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}



    selectPicture() {
       let cameraOptions = {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
      }

      Camera.getPicture(cameraOptions)
        .then(file_uri => {
           this.lastImage = "data:image/jpeg;base64," + file_uri;
        },
        err => {
          this.lastImage = '';
          alert(err)
        });
    }

  clickicon(idx, is) { 
    let msg = ['',
      'Registered',
      'Email Verified',
      'Phone number Verified',
      'Payment Verified',
      'Basic membership',
      'Professional membership',
      'Shop membership',
      'Company membership'
    ];
    if(is) { 
      this.tool_tip = true;
      this.strtooltip = msg[idx];
      let x = 20 + ((idx-1)%4)*30;
      let y = 100;
      if(idx>4) y = 130;
      //$('.tooltip').css('left', x+'px');
      //$('.tooltip').css('top', y+'px');
      
      let time = setTimeout(() => {
        this.tool_tip = false;
        clearTimeout(time);
      }, 1000)
    }
  }

  onmyfav() {
    this.navCtrl.push(FavoritePage,{});
  }

  editinfo() {
    this.navCtrl.push(MyprofileinfoPage,{
      data: this.profiledata
    });
  }


}