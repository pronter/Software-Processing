//对className的判断、增添和删除操作
function hasClass(element, name) {
	if (!element) return; 
	var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
	return element.className.match(reg);
}
function addClass(element, name) {
	if (!element) return; 
	if (!hasClass(element, name)) {
		element.className += ' ' + name;
	}
}
function removeClass(element, name) {
	if (!element) return; 
	if (hasClass(element, name)) {
		var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
		element.className = element.className.replace(reg, ' ');
	}
}

//封装的Ajax函数，传入回调函数
function ajax(url, callback) {
	var oAjax;
	if (window.XMLHttpRequest) {
		oAjax = new XMLHttpRequest();
	} else {
		oAjax = new ActiveXObject("Microsoft.XMLHTTP");
	}
	oAjax.open('GET', url, true);
	oAjax.send();
	oAjax.onreadystatechange = function() {
		if (oAjax.readyState == 4) {
			callback(oAjax.responseText);
		}
	}
}

//获取小气泡元素
function getBubbles() {
	var aNodes = document.getElementById('control-ring-container').childNodes;
	var aBubbles = [];
	for (var i = 0; i < aNodes.length; i++) {
		if (aNodes[i].nodeType == 1) {
			aBubbles.push(aNodes[i]);
		}
	}
	return aBubbles;
}

//点击小气泡后，在得到随机数前的动作
function clickOnBubble(certainBubble, aBubbles) {
	certainBubble.state = 'clicked';
	var oNumber = certainBubble.getElementsByTagName('div')[0];
	oNumber.style.display = 'block';
	oNumber.innerHTML = '...';
	for (var i = 0; i < aBubbles.length; i++) {
		if (i != certainBubble.index && aBubbles[i].state == 'unclicked') {
			removeClass(aBubbles[i], 'enable');
			addClass(aBubbles[i], 'disable');
		}
	}
}

//得到随机数后的三个动作：显示数字、激活其他气泡、判断info-bar是否该激活
function showNumber(certainBubble, number) {
	var oNumber = certainBubble.getElementsByTagName('div')[0];
	oNumber.innerHTML = number;
	removeClass(certainBubble, 'enable');
	addClass(certainBubble, 'disable');
}

function changeState(aBubbles) {
	for (var i = 0; i < aBubbles.length; i++) {
		if (aBubbles[i].state == 'unclicked') {
			removeClass(aBubbles[i], 'disable');
			addClass(aBubbles[i], 'enable');
		}
	}
}

function allNumbersGot(aBubbles) {
	var oBar = document.getElementById('info-bar');
	var all_got = true;
	for (var i = 0; i < aBubbles.length; i++) {
		if (aBubbles[i].state == 'unclicked') {
			all_got = false;
			break;
		}
	}
	if (all_got) {
		removeClass(oBar, 'disable');
		addClass(oBar, 'enable');
	}
}

//求和并显示
function addUp(bar, aBubbles) {
	if (hasClass(bar, 'enable')) {
		var sum = 0;
		var aNumbers = [];
		for (var i = 0; i < aBubbles.length; i++) {
			var number = aBubbles[i].getElementsByTagName('div')[0].textContent;
			sum += parseInt(number);
		}
		if (!hasClass(bar, 'disable')) {
			bar.innerHTML = '<span>' + sum + '</span>';
			removeClass(bar, 'enable');
			addClass(bar, 'disable');
		}
	}
}

function robot(randomList, index, aBubbles) {
	var oBar = document.getElementById('info-bar');
	if (index < aBubbles.length) {
		clickOnBubble(aBubbles[randomList[index]], aBubbles);
		var that = aBubbles[randomList[index]];
		ajax('http://localhost:3000', function(number) {
			showNumber(that, number);
			changeState(aBubbles);
			allNumbersGot(aBubbles);
			robot(randomList, index+1, aBubbles);
		});
	} else {
		addUp(oBar, aBubbles);
	}
}

window.onload = function() {
	var aBubbles = getBubbles();
	var oBar = document.getElementById('info-bar');
	var oContainer = document.getElementById('bottom-positioner');
	var oBtn = document.getElementById('button');
	var oList = oContainer.getElementsByTagName('span')[0];
	for (var i = 0; i < aBubbles.length; i++) {
		aBubbles[i].index = i;
		aBubbles[i].state = 'unclicked';
		//小气泡点击事件
		aBubbles[i].onclick = function(ev) {
			var oEvent = ev || event;
			oEvent.cancelBubble = true;                               //取消事件冒泡
			if (hasClass(this, 'enable') && this.state == 'unclicked') {
				clickOnBubble(this, aBubbles);
				var that = this;
				ajax('http://localhost:3000', function(number) {
					showNumber(that, number);
					changeState(aBubbles);
					allNumbersGot(aBubbles);
				});
			}
		}
	}
	//大气泡点击事件
	oBar.onclick = function(ev) {
		var oEvent = ev || event;
		oEvent.cancelBubble = true;
		addUp(this, aBubbles);
	}
	//鼠标移出事件
	oContainer.onmouseout = function(e) {
		//避免移入子元素导致事件触发
	    if( !e ) e = window.event;  
	    var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;  
	    while( reltg && reltg != this ) reltg = reltg.parentNode;  
	    if( reltg != this ) {
	        // 以下是鼠标移出的动作
	        for (var i = 0; i < aBubbles.length; i++) {
				aBubbles[i].state = 'unclicked';
				removeClass(aBubbles[i], 'disable');
				addClass(aBubbles[i], 'enable');
				var oNumber = aBubbles[i].getElementsByTagName('div')[0];
				oNumber.style.display = 'none';
				oBar.innerHTML = '';
			}
			removeClass(oBar, 'enable');
			addClass(oBar, 'disable');
			oList.innerHTML = '';
		}
	}
	//执行机器人程序
	oBtn.onclick = function() {
		var randomList = [0, 1, 2, 3, 4];
		randomList.sort(function() {
			return Math.random()-0.5;
		});
		robot(randomList, 0, aBubbles);
	}
}