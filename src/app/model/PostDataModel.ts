
///////////////////////////////////////////POST DATA MODEL CLASS 2017/4 MADE BY ZHANG///////////////////////////////////////
export class PostDataModel
{
  post_id:            string ;
  post_img_url : string;
  post_number:string;
  post_price:string;
  post_sticky:string;
  post_title:  string ;
  post_dt    : string ;
  post_category_id: string;
  post_profile_id: string;
  post_profile_image: string;
  post_profile_username: string;
  post_profile_ison: string;
  post_content:string;
  post_date:string;
  post_type:string;
  post_viewcount:string;
  wanted: string;
  islike: string;
  likes: string;
  mark: string;
  review: string;
  pimage: string;
  pid: string;
  post_profile_isfollow: string;
  followtext: string;
  img_url: string;
  num: string;
  condition: string;
  delivery: string;
  delivery_cost: string;

  constructor(data)
  {
     this.post_id            = data["id"];
     this.post_img_url       = data["image_url"];
     this.post_number        = data["number"];
     this.post_date          = data["post_dt"];
     this.post_price         = data["price"];
     this.post_category_id    =  data["category_id"];
     this.post_profile_id    =  data["profile_id"];
     this.post_sticky        =  data["sticky"]
     this.post_title         =  data["title"];
     this.post_content       =  data["content"];
     this.post_viewcount       =  data["viewcount"];
     this.post_type       =  data["post_type"];
     this.wanted       =  data["wanted"];
     this.islike       =  data["islike"];
     this.likes       =  data["likes"];
     this.mark       =  data["mark"];
     this.review       =  data["review"];
     this.pimage       =  data["profile_image"];
     this.pid       =  data["pid"];
     this.num       =  data["num"];
     this.post_profile_image       =  data["image"];
     this.post_profile_username       =  data["username"];
     this.post_profile_ison       =  data["ison"];
     this.post_profile_isfollow       =  data["isfollow"];
     this.img_url       =  data["img_url"];
     this.followtext = "+ Follow";
     this.delivery = data['delivery'];
     this.condition = data['condition'];
     this.delivery_cost = data['delivery_cost'];

  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
