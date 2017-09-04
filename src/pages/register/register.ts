import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Global } from './../../app/model/global';
import { SplashPage } from '../splash/splash';
import { Http } from '@angular/http';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {

    public mnumber = "";
    loading: Loading;
    public phonecode = "";
    public regionView : any;
    public iscode = '1';
    public username = "";
    public email = "";
    public vcode = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController) {

                this.mnumber = navParams.get("number");
                

  }

  ionViewWillEnter()
  {
    
  }

  ionViewDidLoad() {
    
  }

  removePages() {
    localStorage.setItem('loggedin', '1');
    localStorage.setItem('region', Global.Static_region);
    localStorage.setItem('lang', Global.Static_lang);
    localStorage.setItem('profile_id', Global.Static_profile_id);
    localStorage.setItem('flag', Global.flag);
    localStorage.setItem('username', Global.Static_username);
    localStorage.setItem('number', Global.Static_number);
    
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    /*
    const index1 = this.regionView.index;
    this.navCtrl.remove(index1);
    */
  }

  ongo(){
    if(this.username == "") {
      alert("Please input Username");
      return;
    }
    this.loading = this.loadingCtrl.create({
        content: 'Loading...',
    });
    this.loading.present();

    var temp_url = 'http://sale4allz.com/ws/login.php';
    var number = this.mnumber;
    var uname = this.username;
    var em = this.email;
    var Form_data = new FormData();
    Form_data.append('phoneNumber', number);
    Form_data.append('username', uname);
    Form_data.append('email', em);
    Form_data.append('lang', Global.Static_lang);
    Form_data.append('region', Global.Static_region);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.loading.dismissAll();
        if(res['success'] == "true") {
            Global.Static_profile_id = res['data'];
            Global.Static_username = this.username;
            this.navCtrl.push(SplashPage, {}, {animation:'ios-transition'}).then(()=> {
              this.removePages();
            });
        } else {
            alert(res['error']);
        }
    }, error => {
        this.loading.dismissAll();
        alert("Error");
    });

  }

}
