
function PythonFunction(URL, termNo, value)
{
  var form = document.createElement( "form" );
  form.setAttribute( "action", URL ); // 送信先URL
  form.setAttribute( "method", "post" );  // POSTリクエスト送信
  form.setAttribute( "target", "hiddeniframe" );  // 画面遷移しないための仕掛け
  //form.setAttribute( "value",  10);
  form.style.display = "none";  // 画面表示なし
  document.body.appendChild( form );  // bodyの子要素として追加

  var input = document.createElement( "termNo" );
  input.setAttribute( "type", "hidden");
  input.setAttribute( "name", "termNo");
  input.setAttribute( "value", termNo);
  form.appendChild(input);

  var input = document.createElement( "input" );
  input.setAttribute( "type", "hidden");
  input.setAttribute( "name", "val");
  input.setAttribute( "value", value);
  form.appendChild(input);
  
  form.submit();
}

$(function()
{
  $(".namber").find(#slider).each(function(){
    var termNo = parseInt($( this ).text(), 10);
    $( this ).empty().slider(
    {
      max: 16,  // 最大値
      min:  0,  // 最小値
      value:0,  // 初期値
      step: 4,  // 変化の単位
      //orientation: "vertical",  // 設置向き

      slide: function(event, ui)
      {
        length(ui.value);
      },
      change: function(event, ui)
      {
        length(ui.value);
        PythonFunction("/Gate", termNo, ui.value);
      }
    
    });
  });
});

function length(cm)
{
  $("#slidervalue").html(cm+"cm");
}