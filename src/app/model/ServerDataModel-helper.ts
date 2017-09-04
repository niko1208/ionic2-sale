import { OfferDataModel } from './OfferModel';
// import { Global } from './global';
import { TreeModel } from './TreeDataModel';
import { PostDataModel } from './PostDataModel';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { MyDataModel } from './DataModel';
import { Global } from './../../app/model/global';


// import { Transfer, File } from 'ionic-native';
import { Loading, LoadingController, ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/Observable/throw";
declare var cordova : any;

export interface ServerDataModelDelegate
{
   dataSourceUpdated(any);
}

@Injectable()
export class ServerDataModel
{
  public data_receive = {};
  public     my_array : any;
  loading: Loading;

  public  url ="http://sale4allz.com/ws/get_categories.php?parent_id=0 ";
 // public _http: Http;

  public  homedata_array :      Array<MyDataModel> = new Array<MyDataModel>();
  public  postData_array :      Array<PostDataModel> = new Array<PostDataModel>();
  public  wantedData_array :    Array<TreeModel> = new Array<TreeModel>();
  public  offferData_array :    Array<OfferDataModel> = new Array<OfferDataModel>();

  public homedelegate :   ServerDataModelDelegate;

  // constructor(public _http:Http)
  constructor(public _http: Http, public loadingCtrl: LoadingController,public toastCtrl: ToastController)
  {
    // this.my_array = this.initHomeDataArray();
    // this.insertdataToMyDataModel();
  }

ionViewWillEnter()
{

}

//////////////////////////////mobile amd server communication content///////////////////////////
   SendPost(nextid)
  {
        var temp_array = new Array<MyDataModel>();
        var temp_url = 'http://sale4allz.com/ws/get_categories.php';
        // var data = JSON.stringify({'parent_id':nextid});
//////////////////////////very important/////////////////////////////////
        var Form_data = new FormData();
        Form_data.append('parent_id',nextid);
//////////////////////////////////////////////////////////////////////////
        this._http.post(temp_url,Form_data).map(res =>res.json())
        .subscribe(res => {

        for(let index in res["items"])
        {
            var TempDataModel = new MyDataModel(res["items"][index]);
           temp_array.push(TempDataModel);
        }

        this.homedelegate.dataSourceUpdated(temp_array)
        }, error => {
            console.log("Oooops!");
        });
  //////////////////////////////// update views ///////////////////////////////////////////////
   }
updateviews(id, wanted)
  {
        var temp_url = 'http://sale4allz.com/ws/updateviews.php';
        
        var Form_data = new FormData();
        Form_data.append('id', id);
        Form_data.append('wanted', wanted);
//////////////////////////////////////////////////////////////////////////
        this._http.post(temp_url,Form_data).map(res =>res.json())
        .subscribe(res => {
            //var aa = [];
            //this.homedelegate.dataSourceUpdated(aa);
        }, error => {
            console.log("Oooops!");
        });
  ///////////////////////////////////////////////////////////////////////////////
   }
//////////////////////////////// login ///////////////////////////////////////////////
userlogin(mnumber)
{
    var temp_url = 'http://sale4allz.com/ws/login.php';
    
    var Form_data = new FormData();
    Form_data.append('phoneNumber', mnumber);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        this.homedelegate.dataSourceUpdated(res);
    }, error => {
        console.log("Oooops!");
    });
}

GetFavoritePosts() {
    var temp_array = new Array<PostDataModel>();
    var temp_url = 'http://sale4allz.com/ws/get_user_posts.php';
    // var data = JSON.stringify({'parent_id':nextid});
//////////////////////////very important/////////////////////////////////
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('lang', Global.Static_lang);
    Form_data.append('country', Global.Static_region);
    Form_data.append('isfavorite', '1');
//////////////////////////////////////////////////////////////////////////
    this._http.post(temp_url,Form_data).map(res =>res.json())
    .subscribe(res => {
    for(let index in res["items"])
    {
        var TempDataModel = new PostDataModel(res["items"][index]); 
        temp_array.push(TempDataModel);
    }

    console.log("postarray==========>",this.postData_array);
    this.homedelegate.dataSourceUpdated(temp_array)

    }, error => {
        console.log("Oooops!");
    });
}

DeleteMyAds(id) {
    var temp_url = 'http://sale4allz.com/ws/del_user_ads.php';
    // var data = JSON.stringify({'parent_id':nextid});
//////////////////////////very important/////////////////////////////////
    var Form_data = new FormData();
    Form_data.append('id', id);
//////////////////////////////////////////////////////////////////////////
    this._http.post(temp_url,Form_data).map(res =>res.json())
    .subscribe(res => {
    
    }, error => {
        console.log("Oooops!");
    });
}
GetMyAds() {
    var temp_array = new Array<PostDataModel>();
    var temp_url = 'http://sale4allz.com/ws/get_user_ads.php';
    // var data = JSON.stringify({'parent_id':nextid});
//////////////////////////very important//////////////////////+///////////
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('lang', Global.Static_lang);
    Form_data.append('country', Global.Static_region);
    Form_data.append('isfavorite', '1');
//////////////////////////////////////////////////////////////////////////
    this._http.post(temp_url,Form_data).map(res =>res.json())
    .subscribe(res => {
    for(let index in res["items"])
    {
        var TempDataModel = new PostDataModel(res["items"][index]); 
        temp_array.push(TempDataModel);
    }

    console.log("postarray==========>",this.postData_array);
    this.homedelegate.dataSourceUpdated(temp_array)

    }, error => {
        console.log("Oooops!");
    });
}

GetWantedPost() {
    var temp_array = new Array<PostDataModel>();
    var temp_url = 'http://sale4allz.com/ws/get_user_wanted.php';
    // var data = JSON.stringify({'parent_id':nextid});
//////////////////////////very important/////////////////////////////////
    var Form_data = new FormData();
    Form_data.append('profile_id', Global.Static_profile_id);
    Form_data.append('lang', Global.Static_lang);
    Form_data.append('country', Global.Static_region);
//////////////////////////////////////////////////////////////////////////
    this._http.post(temp_url,Form_data).map(res =>res.json())
    .subscribe(res => {
    for(let index in res["items"])
    {
        var TempDataModel = new PostDataModel(res["items"][index]); 
        temp_array.push(TempDataModel);
    }

    console.log("postarray==========>",this.postData_array);
    this.homedelegate.dataSourceUpdated(temp_array)

    }, error => {
        console.log("Oooops!");
    });
}
///////////////////////////////////////////////////////////////////////////////

   GetPostProducts()
   {

       var temp_array = new Array<PostDataModel>();
        var temp_url = 'http://sale4allz.com/ws/get_user_posts.php';
        // var data = JSON.stringify({'parent_id':nextid});
//////////////////////////very important/////////////////////////////////
        var Form_data = new FormData();
        Form_data.append('profile_id', Global.Static_profile_id);
        Form_data.append('lang', Global.Static_lang);
        Form_data.append('country', Global.Static_region);
//////////////////////////////////////////////////////////////////////////
        this._http.post(temp_url,Form_data).map(res =>res.json())
        .subscribe(res => {
        for(let index in res["items"])
        {
            var TempDataModel = new PostDataModel(res["items"][index]); 
            temp_array.push(TempDataModel);
        }

        console.log("postarray==========>",this.postData_array);
        this.homedelegate.dataSourceUpdated(temp_array)

        }, error => {
            console.log("Oooops!");
        });
  ///////////////////////////////////////////////////////////////////////////////
   }

   GetTreeCategoryInformation()
   {
      var temp_url = 'http://sale4allz.com/ws/categories_tree.php';

      var send_data = new FormData();
      send_data.append('lang','en');

      this._http.post(temp_url,send_data).map(res =>res.json())
        .subscribe(res => {
          console.log("wantedResponse==>",res);
          this.wantedData_array = [];
        for(let index in res["items"])
        {
            var TempDataModel = new TreeModel(res["items"][index]);
            this.wantedData_array.push(TempDataModel);
        }

        console.log("postarray==========>",this.postData_array);
        this.homedelegate.dataSourceUpdated(this.wantedData_array)

        }, error => {
            console.log("Oooops!");
        });
   }
/////////////////////////////////////////////get offer products function///////////////////////////////////
GetOfferPost()
{
  var temp_url = 'http://sale4allz.com/ws/get_offer_post.php';
      var temp_array = new Array<OfferDataModel>();
      var send_data = new FormData();
      send_data.append('lang','en');
      send_data.append('country', Global.Static_region);
      send_data.append('profile', Global.Static_profile_id);

      this._http.post(temp_url,send_data).map(res =>res.json())
        .subscribe(res => {
          console.log("wantedResponse==>",res);
         for(let index in res["item"])
         {
             var TempDataModel = new OfferDataModel(res["item"][index]);
            temp_array.push(TempDataModel);
         }

        console.log("postarray==========>",this.offferData_array);
        this.homedelegate.dataSourceUpdated(temp_array)

        }, error => {
            console.log("Oooops!");
        });

}

GetOffers()
{
  var temp_url = 'http://sale4allz.com/ws/get_offer_post1.php';
      var temp_array = new Array<PostDataModel>();
      var send_data = new FormData();
      send_data.append('lang','en');
      send_data.append('country', Global.Static_region);
      send_data.append('profile', Global.Static_profile_id);

      this._http.post(temp_url,send_data).map(res =>res.json())
        .subscribe(res => {
          console.log("wantedResponse==>",res);
         for(let index in res["item"])
         {
             var TempDataModel = new PostDataModel(res["item"][index]);
            temp_array.push(TempDataModel);
         }

        this.homedelegate.dataSourceUpdated(temp_array)

        }, error => {
            console.log("Oooops!");
        });

}

/////////////////////////////////////////////get post information with category id////////////////////////////////
GetPostFromCategoryId(cate_id)
{
   var temp_url = 'http://sale4allz.com/ws/get_postinformation.php';
    var temp_array = new Array<PostDataModel>();

  console.log("next id ==>",cate_id);
   var send_data = new FormData();
   send_data.append('category_id',cate_id);
   send_data.append('country', Global.Static_region);

   this._http.post(temp_url,send_data).map(res =>res.json())
        .subscribe(res => {
          console.log("seeeeeeeeeeeeeeee==>",res);
           for(let index in res["items"])
         {
             var TempDataModel = new PostDataModel(res["items"][index]);
             temp_array.push(TempDataModel);
         }
       this.homedelegate.dataSourceUpdated(temp_array)
        }, error => {
            console.log("Oooops!");
        });

}

//======================= notification ===========================
notify_follow(pid, isfollow) {
    var temp_url = 'http://sale4allz.com/ws/send_notification.php';
    var Form_data = new FormData();
    
    var msg = Global.Static_username + " followed you.";
    if(isfollow == '1') {
        msg = Global.Static_username + " unfollowed you.";
    }
    Form_data.append('id', Global.devicetoken);
    Form_data.append('number', Global.Static_number);
    Form_data.append('pid', pid);
    Form_data.append('msg', msg);
    Form_data.append('type', 'follow');

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        
    }, error => {
        
    });
}
notify_bidprice(pid, price, b) {
    var temp_url = 'http://sale4allz.com/ws/send_notification.php';
    var Form_data = new FormData();
    
    var msg = Global.Static_username + " bids at " + price + " kd.";
    if(b == '1') {
        msg = Global.Static_username + " has bid on your offer, Total " + price + " KD.";
    }
    Form_data.append('id', Global.devicetoken);
    Form_data.append('number', Global.Static_number);
    Form_data.append('pid', pid);
    Form_data.append('msg', msg);
    Form_data.append('type', 'bidprice');

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        
    }, error => {
        
    });
}
notify_writerate(pid) {
    var temp_url = 'http://sale4allz.com/ws/send_notification.php';
    var Form_data = new FormData();
    
    var msg = "Congratulation! Your items selling chances increased, " + Global.Static_username + " has Rated you!";
    Form_data.append('id', Global.devicetoken);
    Form_data.append('number', Global.Static_number);
    Form_data.append('pid', pid);
    Form_data.append('msg', msg);
    Form_data.append('type', 'rate');

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        
    }, error => {
        
    });
}
notify_membership(pid, membership, badge) {
    var temp_url = 'http://sale4allz.com/ws/send_notification.php';
    var Form_data = new FormData();
    
    var msg = "Your account has been upgraded to " + membership + " membership.";

    Form_data.append('id', Global.devicetoken);
    Form_data.append('number', Global.Static_number);
    Form_data.append('pid', pid);
    Form_data.append('msg', msg);
    Form_data.append('type', 'membership');
    Form_data.append('badge', badge);

    this._http.post(temp_url, Form_data).map(res =>res.json())
    .subscribe(res => {
        
    }, error => {
        
    });
}
}
