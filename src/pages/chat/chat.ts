import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, Loading, Platform , Events} from 'ionic-angular';
import { Global } from './../../app/model/global';
import { Http } from '@angular/http';
import { ProfilePage } from './../profile/profile';
import { MynotificationPage } from './../notification/notification';
import { MyprofilePage } from './../myprofile/myprofile';
import { SearchPage } from './../search/search';
import {MorePage} from '../more/more';
import * as $ from 'jquery';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})

export class ChatPage {

    loading: Loading;

    public messages = [];
    public chatbox = "";
    public recid = "";
    public username = "";
    public image = ""; 
    public ison = "0";
    public state = "0";

    public pending = false;

    public flag: any;
    public badge = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public _http:Http, private viewCtrl: ViewController, platform:Platform, private ev: Events) {
                
                this.recid = navParams.get("rid");

    this.flag = Global.flag;
    this.badge = Global.badge;
    
    this.ev.subscribe('badge', (badge)=>{
      this.badge = badge;
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
  
  ionViewWillLeave() {
      this.pending = true;
      this.ev.publish('offline', Global.Static_profile_id);
      /*
      var temp_url = 'http://sale4allz.com/ws/logut.php';
      var Form_data = new FormData();
      Form_data.append('pid', Global.Static_profile_id);
      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
      }, error => {
      });*/
  }
  ionViewWillEnter()
  {
    if(Global.Static_profile_id == "") {
      $('.fstatusbar img').css('display', 'none');
    }
      if(Global.Static_profile_id == "") {
          return;
      }
      this.pending = true;
      var temp_url = 'http://sale4allz.com/ws/updateon.php';
      var Form_data = new FormData();
      Form_data.append('pid', Global.Static_profile_id);
      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
          this.pending = false;
      }, error => {
          this.pending = false;
      });
      this.callFunc();
  }

  goprofile(pid) { 
    
      this.navCtrl.push(ProfilePage,{
        profile_id: pid
      });
  }

  change() {
    // get elements
    var element   = document.getElementById('messageInputBox');
    var textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight  = '0';
    textarea.style.height     = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = textarea.scrollHeight;
    if(scroll_height > 96)
      scroll_height = 96;

    // apply new style
    element.style.height      = (scroll_height*1+22) + "px";
    textarea.style.minHeight  = scroll_height + "px";
    textarea.style.height     = scroll_height + "px";

    document.getElementById('div_space').style.height = (scroll_height*1+22) + "px";
  }

  ionViewDidLoad() {
    
  }

  public callFunc() {
      var tt = this;
    if(this.pending == false) {
        tt.onget();
    }
    setTimeout(function() {
        tt.callFunc();
    }, 8000);
  }

  onsend() {
      var message = this.chatbox;
    if(message == "") {
        return;
    }
    this.chatbox = "";
    var temp_url = 'http://sale4allz.com/ws/post_user_chat.php';
    var rid = this.recid;
    var Form_data = new FormData();
    Form_data.append('pid', Global.Static_profile_id);
    Form_data.append('rid', rid);
    Form_data.append('msg', message);
    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.onget();
    }, error => {

    });
    
  }

  onget() {
      this.pending = true;

      var temp_url = 'http://sale4allz.com/ws/get_user_chat.php';
      var Form_data = new FormData();
      Form_data.append('profile_id', Global.Static_profile_id);
      Form_data.append('aid', this.recid);
      this._http.post(temp_url, Form_data).map(res =>res.json())
      .subscribe(res => {
          this.pending = false;
        this.load(res.items);

        this.username = res.pp['username'];
        this.image = res.pp['image'];
        this.ison = res.pp['ison'];
        if(this.ison == '1') {
            this.state = "online";
        } else {
            this.state = "offline";
        }
      }, error => {
        this.pending = false;
      });

  }

  load(data) {
      this.messages = [];
    for(var i=0; i<data.length; i++) {
        var row = data[i];
        var item = row;
        this.messages.push(item);
    }
  }

  fdate(dt) {
      var months = ["","Jan", "Feb", "Mar", 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
      var ary = dt.split(' ');
      var arydate = ary[0].split('-');
      var arytime = ary[1].split(':');  
      var ap = "AM";
      if(arytime[0]*1 > 11) ap = "PM";
      if(arytime[0]*1 > 12) arytime[0] = arytime[0]*1 - 12;
      return months[arydate[1]*1]+' '+arydate[2]+", "+arytime[0]*1+':'+arytime[1]+' '+ap;
  }

}
