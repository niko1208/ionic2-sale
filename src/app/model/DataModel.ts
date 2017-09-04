
//////////////////////////////////////////Model of home page(category page)////////////////////////////
export class MyDataModel
{
  id:            string ;
  cate_name:     string ;
  cate_ar_name:  string ;
  img_url     :  string ;
  parent_id    : string ;
  is_parent_id : string ;
  cate_order   : string ;
  hascate   : string ;

  constructor(data)
  {
      this.id = data["id"];
      this.cate_name = data["category_name"];
      this.cate_ar_name = data["category_ar_name"];
      this.img_url = data["image_file"];
      this.parent_id = data["parent_id"];
      this.is_parent_id = data["is_parent"];
      this.cate_order = data["total_count"];
      this.hascate = data["hascate"];
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
