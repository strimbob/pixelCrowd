/* 

	fSocketConnection([oActions],[oOptions])
	
	websocket connection is created by calling new fSocketConnection

	an object of actions can be passed and an (optional) object of options.
	
	The URL of the ws:// connection is based on the browser URL	
	
	
	The created object has the properties:
	
		.status: 
			pending / open / error
		.socket: 
			a handle to the websocket object that's created.  This allows bottom level manipulation of
			the object
	
	The created object has the methods:
	
		.send(vValue):
			send a web socket message with the payload sent as as parameter value:
			the content is converted to a JSON string so an object can be sent as vValue
	
		.listen(fCallback)
			fCallback is the function that is run when a message is received.
			the callback can access the value oData
	
			oData is an object with values: type: text / JSON, data: variant payload.  The function
			will automatically try and convert JSON strings to objects when they are returned 
			as oData	
	
			'this' is called such that it refers to the websocket object
	
			the method returns the websocket object to allow chaining
	
			the method uses the jQuery 'bind' method, so multiple listeners can be created.  They are
			executed in the order in which they are created
			
		.add_listener(fCallback)
			as .listen but the callback is returned rather than the websocket object which would be
			handy if you wanted to unbind the event
			
	
	oActions [object] can take the following function values. When the function is run, 'this' is set to reference
	the socket connection object
	
		onopen
			function run when the socket is successfully created
			
		onmessage - function(oEvent)
			function run when a message is received.  Similar to adding a .listen, although the raw
			event is returned un-processed or JSONed.  The data is accessed through oEvent.data.
			
		onclose
			function run when the socket is closed
			*** currently untested ***
			
		onfail - function(eError)
			function run when the socket is not created.  The error object is passed in
			*** currently untested ***
			
	oOptions [object] can take the following values
		
		keep_alive null / !null  [false/true]
			whether to send a message to the server every 5 seconds as a reminder	

*/


// setup web socket
function fSocketConnection(oActions, oOptions){
	
	function fCreateReturnData(vData){
		try {
			var oData=$.evalJSON(vData);
			return {
				type:'JSON',
				data:oData
			};
		} catch(e) {
			return {
				type:'text',
				data:vData
			};
		}
	}

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
			oActions.onmessage.call(oThis,oEvent.originalEvent);
		});
			
		if(oActions.onclose) $(oConnection).bind('close',function(){
			 oActions.onclose.call(oConnection);
		});
		
		this.send=function(vValue){
			var oValueToSend={'value':vValue};
			var sValueToSend=$.toJSON(oValueToSend);
			oConnection.send(sValueToSend);
		}
		
		this.listen=function(fCallback){
			$(oConnection).bind('message',function(oEvent) {
				fCallback.call(oThis,fCreateReturnData(oEvent.originalEvent.data));
			});
			return oThis;
		}
		
		this.add_listener=function(fCallback){
			$(oConnection).bind('message',function(oEvent) {
				fCallback.call(oThis,fCreateReturnData(oEvent.originalEvent.data));
			});
			return fCallback;
		}
		
	} catch(eError) {
		this.status='error'; 
		if(oActions.onfail) oActions.onfail.call(oThis, eError);
	}	
	
	this.socket=oConnection;
	
}