
function PythonFunction(URL, termNo, value)
{
  var form = document.createElement( "form" );
  form.setAttribute( "action", URL ); // ������URL
  form.setAttribute( "method", "post" );  // POST�ꥯ����������
  form.setAttribute( "target", "hiddeniframe" );  // �������ܤ��ʤ�����λųݤ�
  //form.setAttribute( "value",  10);
  form.style.display = "none";  // ����ɽ���ʤ�
  document.body.appendChild( form );  // body�λ����ǤȤ����ɲ�

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
      max: 16,  // ������
      min:  0,  // �Ǿ���
      value:0,  // �����
      step: 4,  // �Ѳ���ñ��
      //orientation: "vertical",  // ���ָ���

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