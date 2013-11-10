$(document).ready(function() {
	
	var oSocket=new fSocketConnection({
		onopen:function() {
			$('body').css('background-color','green');
			alert('status: '+this.status);
			if(this.status=='error') alert('connection error');
			
			/*
				// we can bind event actions to the socket at will if we want
				$(this.socket).bind('message',function(){alert('message received')});
			*/
		},
		
		onmessage:function(oData){
			if(oData.type=='JSON') {
				var sRGB='rgb('+oData.data.red+','+oData.data.green+','+oData.data.blue+')';
				$('body').css('background-color',sRGB);
			}
			else $('body').css('background-color',oData.data);
		}
		
	});
	
});
