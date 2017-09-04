

export class TreeModel
{
  id:            string ;
  cate_name:     string ;
  img_url     :  string ;
  parent_id    : string ;
  is_parent_id : string ;
  tree_array   = [] ;

  constructor(data)
  {
      this.id = data["id"];
      this.cate_name = data["name"];
      this.img_url = data["image_file"];
      this.parent_id = data["parent_id"];
      this.is_parent_id = data["is_parent"];
      this.tree_array = data["tree"];
  }
}
