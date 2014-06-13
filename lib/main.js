/**
 * Created by nxcong on 28/05/2014.
 */
_ = lodash;

normalizedString = function(str){
    var strInput = str.trim().toLowerCase();
    while(strInput.contains("  ")){
        strInput = strInput.replace("  "," ");
    }
    var strResult = "";
    var arrInput = strInput.split(' ');
    _.each(arrInput,function(s){
        strResult+= s.substring(0,1).toUpperCase() + s.substring(1)+ " ";
    })
    return strResult.trimEnd();
}

String.prototype.trimStart=function(c)
{
    c = c?c:' ';
    var i=0;
    for(;i<this.length && this.charAt(i)==c; i++);
    return this.substring(i);
}
String.prototype.trimEnd=function(c)
{
    c = c?c:' ';
    var i=this.length-1;
    for(;i>=0 && this.charAt(i)==c;i--);
    return this.substring(0,i+1);
}
