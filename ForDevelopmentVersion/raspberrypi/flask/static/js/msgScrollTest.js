var msg = "あかまきがみあおまきがみきまぎかみ〜........"
const scr_speed = 1000	// スクロールするまでの時間 大きいほどゆっくりに
const scr_chr = 1           // 一度にスクロールする文字数
const filename="testcsv.csv"

//function msgScroll()
//{

//  document.forms[0].msgDisp.value = msg;
//  msg = msg.substring(scr_chr,msg.length);
//  timerID = setTimeout("msgScroll()", scr_speed);
//}

//function msgAdder(text)
//{
//  msg = msg + text;
//}

//function successTextLoader()
//{
//  let text;
//  let str = $.csv.toArrays(data); // 渡されるのは読み込んだCSVデータ
//  let tmp = str.split("\n");
//  
//  $(csv).each(function()
//  { 
//    if(this.length > 0)
//    { 
//      for(var i = 0; i < tmp.length; i++)
//      {
//        if(i!=0)text = text + ", ";
//        text = text + tmp[i].substr(-1, 1);
//        text = text + "番";
//      };
//      text = text + "のゲート操作が完了しました　　　　　　　　";//
//    }
//  });
//  //$(function(){$.get(filename,   
//}
 
function scrollcontrol()
{
  jQuery.get(filename)
  .done(function(data)
  {
    let text;
    let tmp = jQuery.csv.toArrays(data); // 渡されるのは読み込んだCSVデータ
    //let tmp = str.split("\n");
  
    //$(csv).each(function()
    //{ 
      if(tmp.length > 0)
      { 
        for(var i = 0; i < tmp.length; i++)
        {
          if(i!=0)text = text + ", " + tmp[i];
          else text = tmp[i];
          //text = text + "番";
        };
        text = text + "のゲート操作が完了しました　　　　　　　　";
      }
    //});
    msg = msg + text;
  })
  document.forms[0].msgDisp.value = msg;
  msg = msg.substring(scr_chr,msg.length);
  timerID = setTimeout("scrollcontrol()", scr_speed);
}