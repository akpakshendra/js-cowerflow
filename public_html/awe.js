// global variables
window.page_width = document.body.clientWidth;
window.page_height = document.body.clientHeight;
window.array = [];
window.n = 9;
window.pos = Math.floor(n/2); // in this case 2
window.pos_array = [];
window.td = null;
window.td2 = null;
window.td3 = null;
window.td4 = null;

//a function to zoom in the image when clicked
function zoom () 
{
	var element = window.array[window.pos_array[pos]];
	if (window.td === null && window.td3 === null && window.td2 === null) {
		for (var i = 0 ; i < n; ++i) {
			if (i !== window.pos_array[pos])
				window.array[i].container.style.display = "none";
		}
		if (element.zoomed === false) {
			if (element.width < 1100) {
				window.td4 = window.setTimeout (function () {
					if (element.top > 30) {
						element.top = element.top - Math.floor((element.top - 30)/3) - 2;
						element.container.style.top = element.top + "px";
					}
					if (element.left > 75) {
						element.left = element.left - Math.floor((element.left - 75)/3) - 2;
						element.container.style.left = element.left + "px";
					}
					if (element.width < 1100) {
						element.width = element.width + Math.floor((1100 - element.width)/3) + 2;
						element.pic.style.width = element.width + "px";
					}
					if (element.height < 600) {
						element.height = element.height + Math.floor((600 - element.height)/3) + 2;
						element.pic.style.height = element.height + "px";
					}
					zoom();
				}, 100);
			}
			else {
				window.td4 = null;
				element.zoomed = true;
				return;
			}
		}
		if (element.zoomed === true) {
			if (element.width > 450) {
				window.td4 = window.setTimeout (function () {
					if (element.top < 100) {
						element.top = element.top + Math.floor((100 - element.top)/3) + 2;
						element.container.style.top = element.top + "px";
					}
					if (element.left < Math.floor(window.page_width/2) - 225) {
						element.left = element.left + Math.floor(((Math.floor(window.page_width/2) - 225) - element.left )/3) + 2;
						element.container.style.left = element.left + "px";
					}
					if (element.width > 450) {
						element.width = element.width - Math.floor((element.width - 450)/3) - 2;
						element.pic.style.width = element.width + "px";
					}
					if (element.height > 450) {
						element.height = element.height - Math.floor((element.height - 450)/3) - 2;
						element.pic.style.height = element.height + "px";
					}
					zoom();
				}, 100);
			}
			else {
				window.td4 = null;
				element.zoomed = false;
				for (var i = 0 ; i < n; ++i) {
					window.array[i].container.style.display = "block";
				}
				return;
			}
		}
	}	
}

// a class to represent the whole picture structure
function Picture (source) // takes the source of the image as argument 
{
	this.container = document.createElement ("div");
	this.pic = document.createElement ("img");
	this.left = 0;
	this.top = 0;
	this.angle = 0;
	this.pic.src = source;
	this.height = 0;
	this.width = 0;
	this.zoomed = false;
	this.in_center = false;
	this.container.style.cssText = "position:absolute; height: 300px; width: 300px; transform-style: preserve-3d; perspective: 1000px;";
	this.container.appendChild (this.pic);
	this.pic.style.cssText = "width:300px; height:300px;";
	// a method which shows the picture at given position with given orientation and centered if required
	this.show = function (x, y, iangle, center) 
	{
		this.top = y;
		this.left = x;
		this.angle = iangle;
		this.container.style.left = x + "px";
		this.container.style.top = y + "px";
		this.height = 300;
		this.width = 300;
		if (center) {
			this.pic.style.cssText = "width:450px; height:450px;";
			this.height = 450;
			this.width = 450;
			this.in_center = true;
		}
		this.pic.style.transform = "rotateY(" + iangle + "deg)";
		document.body.appendChild (this.container);
	}
	// this method moves the picture on the x-axis to the co-ordinate provided
	this.move = function (side, to, i) 
	{
		if (side === 'left') {
			if (this.left > to)	{
				this.left = this.left - i;
				this.container.style.left = this.left + "px";
				var that = this;
				window.td = window.setTimeout (function() {
					if (i > 1)
						that.move(side,to,i-1);
					else
						that.move (side,to,i);
				},10);
			}
			else
				this.left = to;
				window.td = null;
				this.container.style.left = this.left + "px";
		}
		if (side === 'right') {
			if (this.left < to)	{
				this.left = this.left + i;
				this.container.style.left = this.left + "px";
				var that = this;
				window.td = window.setTimeout (function() {
					if (i > 1)
						that.move(side,to,i-1);
					else
						that.move (side,to,i);
				},10);
			}
			else
				this.left = to;
				window.td = null;
				this.container.style.left = this.left + "px";
		}
	}
	// this method sends this picture to the end
	this.sendToEnd = function() 
	{
		this.left = Math.floor(window.page_width/2) + 225 - 150 - (window.pos - (window.n- 1)) * 50;
		this.container.style.left = this.left + "px";
		this.angle = 300;
		this.pic.style.transform = "rotateY(" + this.angle +"deg)";	
	}
	// this method sends this picutre to the start
	this.sendToStart = function() 
	{
		this.left = Math.floor(window.page_width/2) - 225 - 150 - (window.pos - 0) * 50;
		this.container.style.left = this.left + "px";
		this.angle = 60;
		this.pic.style.transform = "rotateY(" + this.angle + "deg)";
	}
	// this method make the picture the centre one
	this.centered = function (side, to, i) 
	{	
		if (side === 'left') {
			if (this.left > to)	{
				this.left = this.left - Math.floor((this.left - to)/3) - 2;
				if (this.angle < 360) {
					this.angle = this.angle + Math.floor((360 - this.angle)/3) + 2;
					this.pic.style.transform = "rotateY(" + this.angle + "deg)";
				}
				this.container.style.left = this.left + "px";
				if (this.height < 450) {
					this.height = this.height + Math.floor((450 - this.height)/3) + 2;
					this.width = this.width + Math.floor((450 - this.width)/3) + 2;
					this.pic.style.height = this.height + "px";
					this.pic.style.width = this.width + "px";
				}
				if (this.top > 100) {
					this.top = this.top - Math.floor((this.top - 100)/3) - 2;
					this.container.style.top = this.top + "px";
				}
				var that = this;
				window.td2 = window.setTimeout (function() {
					if (i > 1)
						that.centered(side,to,i-1);
					else
						that.centered(side,to,i);
				},20);
			}

			else {
				this.left = to;
				this.container.style.left = this.left + "px";
				this.angle = 0;
				this.pic.style.transform = "rotateY(" + this.angle + "deg)";
				this.height = 450;
				this.width = 450;
				this.pic.style.cssText = "width:450px; height:450px;";
				this.top = 100;
				this.container.style.top = this.top + "px";
				this.container.style.zIndex = "99";
				window.td2 = null;
			}
		}
		else {
			if (this.left < to)	{
				this.left = this.left + Math.floor((to - this.left)/3) + 2;
				if (this.angle > 0) {
					this.angle = this.angle - Math.floor((this.angle - 0)/3) - 2;
					this.pic.style.transform = "rotateY(" + this.angle + "deg)";
				}
				this.container.style.left = this.left + "px";
				if (this.height < 450) {
					this.height = this.height + Math.floor((450 - this.height)/3) + 2;
					this.width = this.width + Math.floor((450 - this.width)/3) + 2;
					this.pic.style.height = this.height + "px";
					this.pic.style.width = this.width + "px";
				}
				if (this.top > 100) {
					this.top = this.top - Math.floor((this.top - 100)) - 2;
					this.container.style.top = this.top + "px";
				}
				var that = this;
				window.td2 = window.setTimeout (function() {
					if (i > 1)
						that.centered(side,to,i-1);
					else
						that.centered(side,to,i);
				},20);
			}

			else {
				this.left = to;
				this.container.style.left = this.left + "px";
				this.angle = 0;
				this.pic.style.transform = "rotateY(" + this.angle + "deg)";
				this.height = 450;
				this.width = 450;
				this.pic.style.cssText = "width:450px; height:450px;";
				this.top = 100;
				this.container.style.top = this.top + "px";
				this.container.style.zIndex = "99";
				window.td2 = null;
			}
		}
		this.in_center = true;
	}
	// a method to get the picture back in the stack
	this.getBack = function (side, to, i) 
	{	
		if (side === 'left') {
			if (this.left > to) {
				this.left = this.left - Math.floor((this.left - to)/3) - 2;
				this.container.style.left = this.left + "px";
		
				if (this.top < 175) {
					this.top = this.top + Math.floor((175 - this.top)/3) + 2;
					this.container.style.top = this.top + "px";
				}
				if (this.height > 300) {
					this.height = this.height - Math.floor((this.height - 300)/2) - 2;
					this.width = this.width - Math.floor((this.width - 300)/2) - 2;
					this.pic.style.height = this.height + "px";
					this.pic.style.width = this.width + "px";
				}
				if (this.angle < 60 ) {
					this.angle = this.angle + Math.floor((60 - this.angle)/3) + 2;
					this.pic.style.transform = "rotateY(" + this.angle + "deg)";
				}
				var that = this;
				window.td3 = window.setTimeout (function() {
					that.getBack (side, to , i-1);
				},10);
			}
			else {
				this.left = to;
				this.container.style.left = this.left + "px";
				this.angle = 60;
				this.height = 300;
				this.width = 300;
				this.pic.style.cssText = "width:300px; height:300px;";
				this.top = 175;
				this.pic.style.transform = "rotateY(" + this.angle + "deg)";
				this.container.style.top = this.top + "px";
				this.container.style.zIndex = "-1";
				window.td3 = null;
			}
		}
		if (side === 'right') {
			if (this.left < to) {
				this.left = this.left + Math.floor((to - this.left )/3) + 2;
				this.container.style.left = this.left + "px";
		
				if (this.top < 175) {
					this.top = this.top + Math.floor((175 - this.top)/3) + 2;
					this.container.style.top = this.top + "px";
				}
				if (this.height > 300) {
					this.height = this.height - Math.floor((this.height - 300)/2) - 2;
					this.width = this.width - Math.floor((this.width - 300)/2) - 2;
					this.pic.style.height = this.height + "px";
					this.pic.style.width = this.width + "px";
				}
				if (this.angle < 300 ) {
					this.angle = this.angle + Math.floor((300 - this.angle)/3) + 2;
					this.pic.style.transform = "rotateY(" + this.angle + "deg)";
				}
				var that = this;
				window.td3 = window.setTimeout (function() {
					that.getBack (side, to , i-1);
				},10);
			}
			else {
				this.left = to;
				this.container.style.left = this.left + "px";
				this.angle = 300;
				this.height = 300;
				this.width = 300;
				this.pic.style.cssText = "width:300px; height:300px;";
				this.top = 175;
				this.pic.style.transform = "rotateY(" + this.angle + "deg)";
				this.container.style.top = this.top + "px";
				this.container.style.zIndex = "-1";
				window.td3 = null;
			}
		}
		this.in_center = false;
	}
}

// function to move the gallary left
function moveLeft () 
{
	// for (var i = 0; i < n; i++) {
	// 	alert(window.pos_array[i]);
	// }
	if (window.td === null && window.td3 === null && window.td2 === null && window.td4 === null) {
		for (var i = 0; i < n; ++i) {
			if (i === 0) {
				window.array[window.pos_array[i]].sendToEnd();
			}
			else if (i === pos) {
				window.array[window.pos_array[i]].getBack('left', Math.floor(window.page_width/2) - 225 - 150 - (window.pos - (window.pos - 1)) * 50, 30);
			}
			else if ( i === pos + 1) {
				window.array[window.pos_array[i]].centered('left', Math.floor(window.page_width/2) - 225, 50);
			}
			else if (i < pos) {
				window.array[window.pos_array[i]].move('left', Math.floor(window.page_width/2) - 225 - 150 - (window.pos - (i-1)) * 50, 10 );
			}
			else if (i > pos){
				window.array[window.pos_array[i]].move('left', Math.floor(window.page_width/2) + 225 - 150 - (window.pos - (i-1)) * 50, 10 );
			}
			
		}
		var temp = window.pos_array[0];
			for (var i = 0; i < n - 1; i++) {
				window.pos_array[i] = window.pos_array[i + 1];
			};
			window.pos_array[n-1] = temp;
	}
	window.array[window.pos_array[pos]].zoomed = false;
	for (var i = 0 ; i < n; ++i) {
		window.array[i].container.style.display = "block";
	}
}

function moveRight () 
{
	// for (var i = 0; i < n; i++) {
	// 	alert(window.pos_array[i]);
	// }
	if (window.td === null && window.td3 === null && window.td2 === null && window.td4 === null) {
		for (var i = 0; i < n; ++i) {
			if (i === n-1) {
				window.array[window.pos_array[i]].sendToStart();
			}
			else if (i === pos) {
				window.array[window.pos_array[i]].getBack('right', Math.floor(window.page_width/2) + 225 - 150 - (window.pos - (window.pos + 1)) * 50, 30);
			}
			else if ( i === pos - 1) {
				window.array[window.pos_array[i]].centered('right', Math.floor(window.page_width/2) - 225, 50);
			}
			else if (i < pos) {
				window.array[window.pos_array[i]].move('right', Math.floor(window.page_width/2) - 225 - 150 - (window.pos - (i+1)) * 50, 10 );
			}
			else if (i > pos){
				window.array[window.pos_array[i]].move('right', Math.floor(window.page_width/2) + 225 - 150 - (window.pos - (i+1)) * 50, 10 );
			}
			
		}
		var temp = window.pos_array[n-1];
		for (var i = n-1; i > 0; i--) {
			window.pos_array[i] = window.pos_array[i - 1];
		};
		window.pos_array[0] = temp;
	}
	window.array[window.pos_array[pos]].zoomed = false;
	for (var i = 0 ; i < n; ++i) {
		window.array[i].container.style.display = "block";
	}
}

// things to do when the page loads up 
window.onload = function () 
{
	for (var i = 0; i < window.n; ++i) {
		window.array[i] = new Picture ("../pics/pic" + (i + 1) +".jpg");
		// if the picture is on the left side
		if (i < window.pos)  {
			window.array[i].show (Math.floor(window.page_width/2) - 225 - 150 - (window.pos - i) * 50, 175, 60, false );
			window.array[i].container.style.zIndex = "10";
		}
		// for the picture in the centre
		else if (i === window.pos) { 
			window.array[i].show (Math.floor(window.page_width/2) - 225, 100, 0, true );
			window.array[i].container.style.zIndex = "99";	
		}
		// for those on right
		else {
			window.array[i].show (Math.floor(window.page_width/2) + 225 - 150 - (window.pos - i) * 50, 175, 300, false );
			window.array[i].container.style.zIndex = "10";
		}
		window.pos_array[i] = i;
		window.array[i].container.onclick = zoom;
	}
	// adding the button
	var left_button = document.createElement("div");
	left_button.innerHTML = "<<<";
	left_button.style.cssText = "color:white; background:rgba(0,0,0,0); width : 100px; height: 100px; position:absolute; top:700px; left :0px; font-size:50px;";
	left_button.onclick = moveLeft;
	document.body.appendChild (left_button);
	var rigth_button = document.createElement("div");
	rigth_button.innerHTML = ">>>";
	rigth_button.style.cssText = "color:white; background:rgba(0,0,0,0); width : 100px; height: 100px; position:absolute; top: 700px; left:" + (window.page_width - 100 - 25)+ "px; font-size:50px;";
	rigth_button.onclick = moveRight;
	document.body.appendChild (rigth_button);
}
