//////////////////////////////////////////////////POST AD CLASS  2017/4 ZHANG///////////////////////////////////////////////
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { Global } from './../../app/model/global';
import { ServerDataModel } from '../../app/model/ServerDataModel-helper';
import { WantedPage } from './../wanted/wanted';
import { WantedPage1 } from './../wanted1/wanted1';
import { AddonsPage } from './../addons/addons';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import * as $ from 'jquery';
declare var cordova : any; 
/*
  Generated class for the Post page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
  providers:[WantedPage,ServerDataModel,WantedPage1]
})
export class PostPage{

  public post_category_list = [];
  public post_title : any;
  public post_price : any;
  public post_desc  : any;
  public post_image_count : any;
  public picitems = [];
  public image = "";
  public username = "";
  public post_type = "free";

  lastImage: string = null;
  loading: Loading;

    public flag: any;
    public badge = '0';

  isfree = false;
  isnofree = true;
  condition = false;
  add_detail = false;

  constructor(public model:ServerDataModel,
              public navCtrl: NavController,
              public navParams: NavParams,
              public want_page:WantedPage,
              public want_page1:WantedPage1,
              public actiionSheetCtrl:ActionSheetController,
              public toastCtrl: ToastController,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public _http:Http, private ev: Events)
  {


    //  this.actionsheet = actionsheet;
    this.post_image_count = 10;
    this.flag = Global.flag;

    this.badge = Global.badge;
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
      console.log("event : ", badge);
    })

    this.post_desc = "";
    this.post_title = "";
    this.post_price =  "";

    localStorage.setItem('pay', '0');
    
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
  
  changeFree() {
    if(this.isfree)
      this.isnofree = false;
    else
      this.isnofree = true;
  }
  changeNoFree() {
    if(this.isnofree)
      this.isfree = false;
    else
      this.isfree = true;
  }
 ionViewWillEnter()
 {
   let pay = localStorage.getItem('pay');

    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
     
     var str = Global.Static_category;

     if(Global.Static_profile_id == "") {
      this.navCtrl.pop();
     } else {
      if(Global.Static_initPost == "1") {
          $(".category").text("Choose Category");
      } else {
          $(".category").text(str);
          if(pay != '1') {
            this.presentActionSheet();
          }
      }
     }

     var temp_url = 'http://sale4allz.com/ws/get_profile.php';
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        if(res['success'] == "true") {
            this.image = res['items'][0]['image'];
            this.username = res['items'][0]['username'];
        } else {
            //alert(res['error']);
        }
    }, error => {
        
        alert("Error");
    });

    if(pay == '1') {
      this.post_type = localStorage.getItem('posttype');
      this.clickPostButton();
    }
 }


/////////////////////////////////////////////////////////////////get image from camera and gallery , save image , upload//////////////////////////////////////////////
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
    quality: 50,
    allow: true,
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

private addPic() {
  
  if(this.post_image_count > 0) {
    this.picitems.push({filename:this.lastImage, imgurl: this.pathForImage(this.lastImage)});
    $('.bt_choose_category').html('You can add '+(10-this.picitems.length)+' Image(s)');
  } else {
    alert("You can't upload any more.");
  }
}

public removepic(idx) {
   this.picitems.splice(idx, 1);
   $('.bt_choose_category').html('You can add '+(10-this.picitems.length)+' Image(s)');
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
    this.addPic();
  }, error => {
    this.presentToast('Error while storing file.');
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

// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}


    gotoWantedPage()
    {
      
        this.navCtrl.push(WantedPage1,{});
      
    }
    gotoTakePic() {
      if($(".category").text() == "Choose Category") {
        alert("Please select Category");
        return;
      }
      this.presentActionSheet();
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


  ionViewDidLoad()
  {
    console.log('ionViewDidLoad PostPage');
  }
///////////////////////////////////////////File Transer function(POST AD)///////////////////////////////////////////////////////////////////////////////////
//////this function send post title, post price, post description, post category id   to  backend server///////////////////////////////////////////////////

  clickContinue() {
    if(this.picitems.length < 1) {
      alert("Please select Image.");
      //return;
    }
    this.navCtrl.push(AddonsPage, {post_id: ""});
  }
  clickPostButton()
  {
    if(this.picitems.length < 1) {
      alert("Please select Image.");
      return;
    }
           // Destination URL
      var url = "http://sale4allz.com/admin/add_new_post_temp.php";

      this.loading = this.loadingCtrl.create({
        content: 'Uploading...',
      });
      
      this.uploadcall(url, 0, 0);
}

public uploadcall(url, idx, postid) { 
  var targetPath = this.picitems[idx].imgurl;
      var filename = this.picitems[idx].filename;

      var options = {
        fileKey: "media_file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'postid': postid, 'fileName': filename,'title':this.post_title,'price':this.post_price,'content':this.post_desc,'category_id':Global.Static_category_id, 'country':Global.Static_region, 'profile_id':Global.Static_profile_id, 'post_type':this.post_type}
      };

      const fileTransfer = new Transfer();

      if(idx*1 == 0)
        this.loading.present();
            
      fileTransfer.upload(targetPath, url, options).then((data: any) => {
        var dd = data.response;
        dd = JSON.stringify(dd);
        var ary = dd.split(",");
        dd = ary[1];
        ary = dd.split(":");
        dd = ary[1];
        dd = dd.replace('}"', '');
        dd = dd.replace('\"', '').replace('\"', '').replace('\\', '').replace('\\', '');
        
        if(dd*1 == 0) {
          this.loading.dismissAll();
          alert("Please contact us for more posts.");
          this.navCtrl.pop();
        } else if (idx*1 == this.picitems.length-1) {
          this.loading.dismissAll()
          console.log("uploadeddata==>",data);
          this.presentToast('succesful uploaded.');
          this.navCtrl.pop();
        } else {
          var poid = dd;
          //alert('index-'+idx+'=>'+poid); 
          this.uploadcall(url, idx*1+1, poid);
        }
      }, err => {
        this.loading.dismissAll()
        this.presentToast('Error while uploading file.');
      });
      
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }







