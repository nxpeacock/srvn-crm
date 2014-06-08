/**
 * Created by nxcong on 06/06/2014.
 */
RootCategories = function(){
   return Categories.find({isRoot : true});
}

MajorsCategories = function(){
    return Categories.find({code : 'majors'});
}

getCategoriesBreadCrumbs = function(id){
    var currentNode = Categories.findOne(id);
    if(currentNode){
        var results = Categories.find({
            code : currentNode.code,
            lft : {$lt:currentNode.lft},
            rgt : {$gt:currentNode.lft}
        }).fetch();
        var str = '<ul class="breadcrumb">';
        str += "<li><a href='/quanlyhethong/danhmuc'>Danh mục</a></li>";
        _.each(results,function(rs){
            str+='<li><a href="/quanlyhethong/danhmuc/'+rs._id+'">'+rs.name+'</a></li>';
        });
        str+='<li class="active">'+currentNode.name+'</li>';
        str+='</ul>';
        return str;
    }
    return '';
}
