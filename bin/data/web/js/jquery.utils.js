/*
	from http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
*/
Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
    hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
    DontEnums = [
    	'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
	],
    DontEnumsLength = DontEnums.length;
 
    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");
 
        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }
 
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }
 
        return result;
    };
}); 

/*
	from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
*/
Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if(i== 0) return this;
  while(--i) {
     j = Math.floor(Math.random() * (i+1));
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

function fSquare(oObject) {
	if($(oObject).hasClass('square') && ($(oObject).prev('.square').length>0)) {
		var iHeight=$(oObject).prev('.square').height();
	}
	else {
		iHeight=$(oObject).outerWidth();
	}
	
	$(oObject).height(iHeight);
}

function fWait() {
	var oWait=document.createElement('DIV');
	$(oWait).css({
		width:'100%',
		height:'100%',
		position:'absolute',
		top:0,
		left:0,
		background:"#000000 url('resources.spinner.gif') no-repeat center center",
		opacity:0.5,
		'z-index':995
	});
	
	$(oWait).appendTo($('body'));	
	$(oWait).css('top',$(oWait).height()+'px');
	setTimeout(function(){
		$(oWait).animate({top:0},300);
	},250);
	
	oWait.stop=function(){
		$(oWait).fadeOut(300,function(){
			$(oWait).remove();
		});
	}
	return oWait;
}

function fGetHashObject(){
	var aHash=new Array();
	var _aHash = window.location.hash.replace(/^#/,'').split('&');
	$.each(_aHash, function(iKey, sVal) {
		var _aParams=sVal.split('=',2);
		var sKey=_aParams[0];
		var sValue=_aParams[1];
		aHash[sKey]=sValue;
	});
	
	var oHash=$.extend({},aHash); // create an object from the array
	
	return oHash;
}

function fImageToUse(jImage, oContainer){
	var iCellWidth=$(oContainer).outerWidth();
	var iCellHeight=$(oContainer).outerHeight();
	
	if(jImage.type=='film') {
		var aImage=new Array();
		aImage['name']=jImage.file_name;
		//if(jImage.host=='youTube') aImage['path']='http://img.youtube.com/vi/'+jImage.name+'/maxresdefault.jpg';
		//else
		aImage['path']=jImage.thumbnail_path;
		return aImage;
	}
	
	if(bIsMobile) var aSizes=new Array('small','medium','large');
	else var aSizes=new Array('small','medium','large','x_large','orig');
	for(var i=0; i<aSizes.length; i++) {
		var sSize=aSizes[i];				// set the size to use
		if(!jImage.media_sizes[sSize]) continue;	// has that size image been stored? Twitter doesn't create an x_large one for example
		if((jImage.media_sizes[sSize].width*1.5 > iCellWidth) && (jImage.media_sizes[sSize].height*1.5 > iCellHeight)) break;  // if the size is suitable, break and leave the variable set
	}	
	
	return jImage.media_sizes[sSize];
}

function fSizeImage(oImg,oContainer,bCenter,bFitInside) {
	var iCellWidth=$(oContainer).outerWidth();
	var iCellHeight=$(oContainer).outerHeight();
			
	var iImageWidth=$(oImg).outerWidth();
	var iImageHeight=$(oImg).outerHeight();
	
	if((iImageWidth==0) && oImg.naturalWidth) iImageWidth=oImg.naturalWidth;
	if((iImageHeight==0) && oImg.naturalHeight) iImageHeight=oImg.naturalHeight;
	
	if((iImageWidth==0) && oImg.width) iImageWidth=oImg.width;
	if((iImageHeight==0) && oImg.height) iImageHeight=oImg.height;
	
	/* 	resize the image to cover the whole of the cell.
				maintain the aspect ratio...
	*/
	var iWidthRatio=iCellWidth/iImageWidth;
	var iHeightRatio=iCellHeight/iImageHeight;
	var iRatioToUse=bFitInside?Math.min(iWidthRatio, iHeightRatio):Math.max(iWidthRatio, iHeightRatio);

	var iNewWidth=iImageWidth*iRatioToUse;
	var iNewHeight=iImageHeight*iRatioToUse;
	
	$(oImg).css({
		width:iNewWidth+'px',
		height:iNewHeight+'px'
	});
	
	if(bCenter){
		iMarginTop=(-1*iNewHeight)/2;
		iMarginLeft=(-1*iNewWidth)/2;
		$(oImg).css({
			position:'absolute',
			left:'50%',
			top:'50%',
			'margin-left':iMarginLeft+'px',
			'margin-top':iMarginTop+'px'
		});
	}
	
	return {
		width:iNewWidth,
		height:iNewHeight
	};
}