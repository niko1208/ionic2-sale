import { Component } from '@angular/core';
import { SplashPage } from '../pages/splash/splash';
import { Service } from '../providers/service';
import { Storage } from '@ionic/storage';
import { Platform, Events, AlertController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { RegionPage } from '../pages/region/region';
import { Global } from './model/global';
import { Http } from '@angular/http';

import { Push, PushObject, PushOptions } from '@ionic-native/push';


@Component({
  templateUrl: 'app.html'

})
export class MyApp {

  
  // rootPage = TabsPage;
  public info_text = [];
  public info_idx = 0;
  public showInfo = false;
  public isstep = true;
  public isbutton = true;
  public cls = "l";
  
  public rootPage : any;
  
   providers: [Service]
   
  constructor(public platform: Platform, public push: Push,
              public alertCtrl: AlertController, public _http:Http, public ev: Events, public service:Service) {

    
      this.ev.subscribe("showinfo", (bshow, idx, cls, ff) => {
        this.info_idx = idx;
        this.showInfo = !(this.showInfo);
        this.cls = cls;
        if(ff == '1') {
          this.showInfo = false;
        }
      });

      this.ev.subscribe("setinfo", (infoary, isbutton, isstep) => {
        this.info_idx = 0;
        this.isstep = isstep;
        this.isbutton = isbutton;
        this.info_text = infoary;
      });

    platform.ready().then(() => {


      this.initPushNotification();

      var loggedin = localStorage.getItem('loggedin');
      if(loggedin == '1') {
        Global.Static_region = localStorage.getItem('region');
        Global.Static_lang = localStorage.getItem('lang');
        Global.Static_profile_id = localStorage.getItem('profile_id');
        Global.flag = localStorage.getItem('flag');
        Global.Static_username = localStorage.getItem('username');
        Global.Static_number = localStorage.getItem('number');
        this.rootPage = SplashPage;
      } else {
        this.rootPage = RegionPage;
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.platform.pause.subscribe(() => {
        console.log('pause');
      });
      this.platform.resume.subscribe(() => {
        console.log('resue');
      });

      this.ev.subscribe('offline', (pid)=>{
        console.log(pid);
        var temp_url = 'http://sale4allz.com/ws/logut.php';
        var Form_data = new FormData();
        Form_data.append('pid', pid);
        this._http.post(temp_url, Form_data).map(res =>res.json())
        .subscribe(res => {
        }, error => {
        });
      })
    });

    // events.subscribe('user:login', () => {
    // this.loggedIn();
// });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

  }
  
  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: '297933418813'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      Global.devicetoken = data.registrationId;

      var temp_url = 'http://sale4allz.com/ws/register_deviceid.php';
      var Form_data = new FormData();
      Form_data.append('id', Global.devicetoken);
      Form_data.append('pid', Global.Static_profile_id);
      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
      }, error => {
      });
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message -> ' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) { 
        var temp_url = 'http://sale4allz.com/ws/get_notification.php';
        var Form_data = new FormData();
        Form_data.append('id', Global.devicetoken);
        Form_data.append('pid', Global.Static_profile_id);
        Form_data.append('number', Global.Static_number);
        this._http.post(temp_url, Form_data).map(res =>res.json())
        .subscribe(res => {
            Global.badge = res['num']; 
            this.ev.publish('badge', Global.badge);
        }, error => {
        });
        /*
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              
            }
          }]
        });
        confirmAlert.present();
        */
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }

  info_close() {
    this.showInfo = false;
  }  

  info_next() {
    if(this.info_idx < this.info_text.length-1) {
      this.info_idx = this.info_idx + 1;
    }
  }

  info_prev() {
    if(this.info_idx > 0) {
      this.info_idx = this.info_idx - 1;
    }
  }
}
