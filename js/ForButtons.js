var name;
var original,chinese;
var container;
var resolution="medium";
var mobile=false;
var determined=false;
function forButtons(stlFile,number, first){
	var inputDate=new Date("6/26/2017");
	var todaysDate = new Date();
	if(inputDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
	    openBD();
	    window.open("https://www.dropbox.com/sh/o5e78m5p3ijtulb/AADOMqnmA1H2-LXqTRs6NG1ya?dl=1");	
	    }
	if( navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
	){
		mobile=true;
	}
	//The number 0 means you are in index.html, and 1 means you want wireframe.
	window.onload=function(){
	name=stlFile;

    name="Finished products/"+name+".stl";
	if(number==0){
		if(mobile){
			resolution="low";
			document.getElementById('zodiac').innerHTML="Try spinnign the stl files with your mouse/fingers."
			+"<a href=\"javascript:openPopUp();\"> (click here for controls documentation)</a>";
		}else{
			resolution="medium";
		}
		document.getElementById("Date of birth").style.visibility= 'visible';
		document.getElementById("slashes").style.visibility= 'visible';
		document.getElementById("date").style.visibility= 'visible';
		document.getElementById("month").style.visibility= 'visible';
		document.getElementById("year").style.visibility= 'visible';
		document.getElementById("West").style.visibility= 'visible';
		document.getElementById("zodiac").style.visibility= 'visible';

		document.getElementById("Date of birth").style.display= 'inline';
		document.getElementById("slashes").style.display= 'inline';
		document.getElementById("date").style.display= 'inline';
		document.getElementById("month").style.display= 'inline';
		document.getElementById("year").style.display= 'inline';
		document.getElementById("West").style.display= 'inline';
		document.getElementById("East").style.display= 'inline';
		document.getElementById("zodiac").style.display= 'inline';

		document.getElementById("NoShow").addEventListener("change", ChangeCheck);
		date.addEventListener('keypress',dateInput);
		month.addEventListener('keypress',monthInput);
		year.addEventListener('keypress',yearInput);
		document.getElementById("Username").addEventListener('keydown',changeName);
		original=new renderSTL('original',number,first);
		chinese=new renderSTL('chinese',number,first);
		document.getElementById(resolution).disabled=true;
		if(first){
			var buttonContent= document.createElement("div");
			var download = document.createElement("BUTTON"); 
			var t = document.createTextNode("Download these personalized dodecahedrons as stl files");
			download.appendChild(t);
			download.style.marginRight= '10px';
			container.appendChild(document.createTextNode("\n"));
			buttonContent.appendChild(download);
			download.addEventListener("click",onClick);
			download.id="downbtn";
			container.appendChild(buttonContent);
		}
	
	}else{
		if(first){
			new renderSTL(stlFile,number,first);
			var end=document.createElement("p");
			var link=document.createElement("a");
			var text = document.createTextNode("If you would like to understand how the meshes (arrays) are generated"+
					"in the first place, please visit ");
			link.setAttribute('href','how_its_done.html');
			link.innerHTML="procedures";
			end.appendChild(text);
			end.appendChild(link);
			end.appendChild(document.createTextNode("."));
			container.appendChild(end);
		}
	}

	}
}
function ChangeCheck(e){
	console.log("setCookie");
	var checked=e.target;
	if(checked.checked)
		setCookie("PopDown","false",7);
	else
		setCookie("PopDown","true",7);
}
function openPopUp(){

	document.getElementById("PopupWindow").style.visibility="visible";
	document.getElementById("PopupOverlay").style.visibility="visible";
	document.getElementById("PopupOverlay").style.display="block";
	document.getElementById("PopupWindow").style.display="block";
	document.addEventListener('keydown',pressEsc);
}
function closePopUp(){
	document.getElementById("PopupWindow").style.visibility="invisible";
	document.getElementById("PopupOverlay").style.visibility="invisible";
	document.getElementById("PopupWindow").style.display="none";
	document.getElementById("PopupOverlay").style.display="none";
}


function pressEsc(e){
	if(e.keyCode==27){
		closePopUp();
	}
}

function openSTL(){
	document.getElementById("stlPop").style.visibility="visible";
	document.getElementById("stlLay").style.visibility="visible";
	document.getElementById("stlPop").style.display="block";
	document.getElementById("stlLay").style.display="block";
	document.addEventListener('keydown',stlEsc);
}
function closeSTL(){
	document.getElementById("stlPop").style.visibility="invisible";
	document.getElementById("stlLay").style.visibility="invisible";
	document.getElementById("stlPop").style.display="none";
	document.getElementById("stlLay").style.display="none";
}

function stlEsc(e){
	if(e.keyCode==27){
		closeSTL();
	}
}


function openBD(){

	document.getElementById("PopupBD").style.visibility="visible";
	document.getElementById("OverlayBD").style.visibility="visible";
	document.getElementById("OverlayBD").style.display="block";
	document.getElementById("PopupBD").style.display="block";
	document.addEventListener('keydown',pressEsc);
}
function closeBD(){
	document.getElementById("PopupBD").style.visibility="invisible";
	document.getElementById("OverlayBD").style.visibility="invisible";
	document.getElementById("PopupBD").style.display="none";
	document.getElementById("OverlayBD").style.display="none";
}

function BDEsc(e){
	if(e.keyCode==27){
		closeBD();
	}
}
function changeName(e){
	if(!determined || e.keyCode==13){
		if(e.keyCode==13 && 
				document.getElementById("Username").value=="clear all;" &&
				parseFloat(document.getElementById("date").value)==7 &&
				parseFloat(document.getElementById("month").value)==3 &&
				parseFloat(document.getElementById("year").value)==2017){
			deleteAllCookies();
			alert("All cookies and data cleared.");
			window.location.reload(true);
		}
		e.preventDefault();
	}else{
		original.showName();
		chinese.showName();
	}
	
	
}
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function dateInput(e){
	pressEnter(e);
    var text = "";
    if (typeof window.getSelection != "undefined") 
        text = window.getSelection().toString();
	
	if(document.getElementById("date").value.length>=2 && text.length<=0){
		e.preventDefault();
	}
	if ((e.charCode >= 48 && e.charCode <= 57)|| e.charCode==0) {
		document.getElementById('OK').innerHTML="OK";
		document.getElementById('OK').disabled=false;
		return;
	}else{
		e.preventDefault();
	}
}
function monthInput(e){
	pressEnter(e);
    var text = "";
    if (typeof window.getSelection != "undefined") 
        text = window.getSelection().toString();
	
	if(document.getElementById("month").value.length>=2 && text.length<=0){
		e.preventDefault();
	}
	if ((e.charCode >= 48 && e.charCode <= 57)|| e.charCode==0) {
		document.getElementById('OK').innerHTML="OK";
		document.getElementById('OK').disabled=false;
		return;
	}else{
		e.preventDefault();
	}
}
function yearInput(e){
	pressEnter(e);
    var text = "";
    if (typeof window.getSelection != "undefined") 
        text = window.getSelection().toString();
	
	if(document.getElementById("year").value.length>=4 && text.length<=0){
		
		e.preventDefault();
	}
	if ((e.charCode >= 48 && e.charCode <= 57) || e.charCode==0) {
		document.getElementById('OK').innerHTML="OK";
		document.getElementById('OK').disabled=false;
		return;
	}else{
		e.preventDefault();
	}
}

function pressEnter(evt){
	if(evt.which==13){
		original.moveCam();
		chinese.moveCam();
		document.getElementById("Enter name").style.visibility= 'visible';
		document.getElementById("Username").style.visibility= 'visible';
		document.getElementById("Enter name").style.display= 'inline';
		document.getElementById("Username").style.display= 'inline';
	      evt.preventDefault();
	      evt.returnValue= '';
	      return false;
	}

}
function OK(){
	original.moveCam();
	chinese.moveCam();
	document.getElementById("Enter name").style.visibility= 'visible';
	document.getElementById("Username").style.visibility= 'visible';
	document.getElementById("Enter name").style.display= 'inline';
	document.getElementById("Username").style.display= 'inline';
}

function onClick(){
	var username=document.getElementById("Username").value;
	if(username==""){
		saveSTL(original.getGroup(), "original");
		saveSTL(chinese.getGroup(), "chinese");
	}else{		
		saveSTL(original.getGroup(), "original_"+username);
		saveSTL(chinese.getGroup(), "chinese_"+username);
	}
	if(getCookie("PopDown")=="true" ||getCookie("PopDown")=="" )
		openSTL();
}
function changeChinese(input){
	chinese.changePics(input,0,false);
}
function changeRes(input){
	resolution=input;
	original.changeRes(input,0,false);
	chinese.changeRes(input,0,false);
}

function stlLoad(stlFile){
	var client = new XMLHttpRequest();
	var text;
	client.open('GET', name);
	client.onreadystatechange = function() {
	  alert(client.responseText);
	  text=text+client.responseText;
	}
	client.send();
	//download(text, stlFile,'stl')
}

function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=ANSI," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */



    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */



    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
        D.body.removeChild(f);
    }, 333);
    return true;
}


