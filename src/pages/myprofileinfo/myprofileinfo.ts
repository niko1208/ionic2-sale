import { Component } from '@angular/core';
import { ViewController, NavController, ActionSheetController, ToastController, Platform, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { PostPage } from '../post/post';
import { MyadsPage } from '../myads/myads';
import { MychatPage } from '../mychat/mychat';
import { MynotificationPage } from './../notification/notification';
import { FollowPage } from './../follow/follow';
import { Events } from 'ionic-angular';
import { SearchPage } from './../search/search';
import { MembershipPage } from './../membership/membership';
import { FavoritePage } from '../favorite/favorite';
import {MorePage} from '../more/more';
import { TranslateService } from 'ng2-translate';
import * as $ from 'jquery';

declare var cordova : any;

@Component({
  selector: 'page-myprofileinfo',
  templateUrl: 'myprofileinfo.html'
})

export class MyprofileinfoPage {

    lastImage: string = null;
    public pnumber = "";
    public email = "";
    public username = "";
    public about = "";
    public image = "assets/img/blank-1.png";
    public pimage = "";

    loading: Loading;
    public phonecode = "";
    public prevView : any;

    public strtooltip = "";
    public tool_tip = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, public actiionSheetCtrl:ActionSheetController, public toastCtrl: ToastController, public platform: Platform, private ev: Events, public translate: TranslateService) {

                let data = navParams.get("data");
                this.pnumber = data.phone;
                this.email = data.email;
                this.username = data.username;
                this.about = data.about;
                this.image = data.backurl;
                this.pimage = data.image;
                
                    
  }

  loadbackground() {
    if(this.image == "") this.image = "assets/img/blank-1.png";
    $('#back_img').css('background', 'url('+this.image+')');
    $('#back_img').css('background-size', 'cover');
    $('#back_img').css('background-position', 'center');
  }
  ionViewWillEnter() {
    this.loadbackground();
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
    this.loadbackground();
    this.onedit();
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

  onedit() {
    var url = "http://sale4allz.com/ws/update_profile_back.php";

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

  onsave() {

    this.loading = this.loadingCtrl.create({
      content: 'Saving...',
    });
    var temp_url = 'http://sale4allz.com/ws/update_profile.php';
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('phone', this.pnumber);
    Form_data.append('email', this.email);
    Form_data.append('username', this.username);
    Form_data.append('about', this.about);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        this.presentToast('Succesful updated.');
        this.navCtrl.pop();
    }, error => {
        this.loading.dismissAll();
        this.presentToast('Error while updating.');
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

}