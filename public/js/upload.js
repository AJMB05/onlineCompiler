$('[name=compile]').on('click', function (){
	$.ajax({
		url: '/compilecode',
		type: 'POST',
		data: { 
			code : $("[name=code]").val(),
			lang : $('#language').val(),
			participantId : getUrlParameter('participantId'),
			studyId : getUrlParameter('studyId')
		},
		//processData: false,
		//contentType: false,
		/*failure: function(data){
			alert(data)
		},*/
		success: function(data, status, xhr){ 
			var ct = xhr.getResponseHeader("content-type") || "";
			var result = "";
			if (ct.indexOf('html') > -1) {
				result = data.replace('uploads/','');
				}
			if (ct.indexOf('json') > -1) {
				result = JSON.stringify(data, undefined, 3);
			}
			
			$('[name=result]').val(result);
			$('#panel-24258').append('<table><tbody><tr><td colspan="2"><div class="td_head">w</div><table style="width:100%"><tbody><tr><td class="td_row_even"><div class="td_row_even">0</div></td></tr><tr><td class="td_row_odd"><div class="td_row_odd">2</div></td></tr><tr><td class="td_row_even"><div class="td_row_even">4</div></td></tr></tbody></table></td></tr><tr><td colspan="2"><div class="td_head">z</div><table style="width:100%"><tbody><tr><td colspan="2"><div class="td_head">a</div><table style="width:100%"><tbody><tr><td><div class="td_head">extra</div></td><td><div class="td_row_even">stuff</div></td></tr><tr><td><div class="td_head">value</div></td><td><div class="td_row_even">1</div></td></tr><tr><td><div class="td_head">name</div></td><td><div class="td_row_even">foo</div></td></tr></tbody></table></td></tr><tr><td colspan="2"><div class="td_head">b</div><table style="width:100%"><tbody><tr><td><div class="td_head">extra</div></td><td><div class="td_row_even">stuff</div></td></tr><tr><td><div class="td_head">value</div></td><td><div class="td_row_even">2</div></td></tr><tr><td><div class="td_head">name</div></td><td><div class="td_row_even">bar</div></td></tr></tbody></table></td></tr><tr><td colspan="2"><div class="td_head">c</div><table style="width:100%"><tbody><tr><td><div class="td_head">extra</div></td><td><div class="td_row_even">stuff</div></td></tr><tr><td><div class="td_head">value</div></td><td><div class="td_row_even">3</div></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td colspan="2"><div class="td_head">x</div><table style="width:100%"><tbody><tr><td><div class="td_head">a</div></td><td><div class="td_row_even">foo</div></td></tr><tr><td><div class="td_head">b</div></td><td><div class="td_row_even">bar</div></td></tr></tbody></table></td></tr><tr><td colspan="2"><div class="td_head">y</div><table style="width:100%"><tbody><tr><td class="td_row_even"><div class="td_row_even">4</div></td></tr><tr><td class="td_row_odd"><div class="td_row_odd">5</div></td></tr><tr><td class="td_row_even"><div class="td_row_even">6</div></td></tr></tbody></table></td></tr></tbody></table>');
			//$('.panel-collapse').collapse('toggle');
			$("#aResults").click();
			var b = new Array();
			b.push(data);
			//var jsonHtmlTable = ConvertJsonToTable(b, 'jsonTable', null, 'Download');
			//document.write(jsonHtmlTable);
			//console.log('upload successful!\n' + data);
		}/*,
		xhr: function() {
			// create an XMLHttpRequest
			var xhr = new XMLHttpRequest();
			
			// listen to the 'progress' event
			
			return xhr;
		}*/
	});
});

$(document).ready(function(){
	$.getJSON('/getOutputs', function( data ){
		$.each(data, function (key, val){
			if (val.extension == 'json')
				$('#language').append('<option value = ' + val.extension + ' selected>' + val.name + '</option>')//alert(val.name);
			else
				$('#language').append('<option value = ' + val.extension + '>' + val.name + '</option>')//alert(val.name);
		});
	});
	if (getUrlParameter('participantId') != undefined && getUrlParameter('studyId') != undefined){
		$.ajax({
			url: '/'+getUrlParameter('participantId')+"/"+getUrlParameter('studyId'),
			type: 'GET',
			//processData: false,
			//contentType: false,
			success: function(data, status, xhr){
				$('[name=code]').val(unescape(data));
			}
		});
	}
});

var getUrlParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};