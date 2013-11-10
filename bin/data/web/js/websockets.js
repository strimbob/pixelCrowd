// setup web socket
function fSocketConnection(oActions, oOptions){
	var oKeepAlive;	
	var oThis=this;	//useful to differentiate jQuery localised this
	
	this.status='pending';


	// setup websocket
	// get_appropriate_ws_url is a nifty function by the libwebsockets people
	// it decides what the websocket url is based on the broswer url
	// e.g. https://mygreathost:9099 = wss://mygreathost:9099

	var oConnection=BrowserDetect.browser=='Firefox'?new MozWebSocket(get_appropriate_ws_url()):new WebSocket(get_appropriate_ws_url());
	
	// open	
	
	// is is really OK to bind the open event after the socket has been created??
	
	// call the events passed in creation.  Ensure that 'this' refers to the oThis object
	
	try {
		$(oConnection).bind('open',function(){
			oThis.status='open';
			if(oOptions && oOptions.keep_alive) oKeepAlive=setInterval(function(){
				oConnection.send('here I am!');
			},5000);			
			
			if(oActions.onopen) oActions.onopen.call(oThis);
		});
		
		if(oActions.onmessage) $(oConnection).bind('message',function (oEvent){
			try {
				oData=$.evalJSON(oEvent.originalEvent.data);
				oActions.onmessage.call(oThis,{
					type:'JSON',
					data:oData
				});
			} catch(e) {
				oActions.onmessage.call(oThis,{
					type:'text',
					data:oEvent.originalEvent.data
				});
			}
		});
			
		if(oActions.onclose) $(oConnection).bind('close',function(){
			 oActions.onclose.call(oConnection);
		});
		
		this.send=function(vValue){
			var oValueToSend={'value':vValue};
			var sValueToSend=$.toJSON(oValueToSend);
			oConnection.send(sValueToSend);
		}
		
	} catch(e) {
		this.status='error'; 
	}	
	
	this.socket=oConnection;
	
}