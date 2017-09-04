
////////////////////////////////////////////////////////////WANTED POST(OFFER)DATAMODEL CLASS  2017/4 MADE BY ZHANG//////////////////////////
export class OfferDataModel
{
  id                : string ;
  post_des          : string ;
  img_url           : string ;
  post_date         : string ;
  viewcount         : string ;

  constructor(data)
  {
      this.id = data["id"];
      this.post_des = data["post_detail"];
      this.post_date= data["post_date"];
      this.img_url = data["img_url"];
      this.viewcount = data["viewcount"];
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
