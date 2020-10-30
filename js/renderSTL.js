var renderSTL=function(stlFile, number,first){
	var camera, scene, renderer, mesh,helper,dot;
	var zoom;
	var whichDodec;
	var previous=[0,0,0];
	var withHelper;
	var yourZodiac;
	var textMesh; createTextMesh();
	var loadingScene={
			scene: new THREE.Scene(),
			camera: new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 10000 ),

	};
	var stlScene=new THREE.Scene();
	var textScene=new THREE.Scene();
	var group = new THREE.Object3D();
	var RESOURCES_LOADED=false;
	var LOADING_MANAGER=null;
	init(stlFile, number,first);

	this.getGroup =function(){
		return group;
	}

	function init(stlFile, number,first) {

		// loading scene


		loadingManager=new THREE.LoadingManager();
		loadingManager.onProgress=function(item,loaded,total){
			RESOURCES_LOADED=false;
			console.log(item,loaded,total);
		};
		loadingManager.onLoad=function(){
			console.log("all done");
			if(number==0){
				// re-enable the buttons
				document.getElementById("chinese: pics").disabled=false;
				document.getElementById("chinese: words").disabled=false;
				document.getElementById("low").disabled=false;
				document.getElementById("medium").disabled=false;
				document.getElementById("high").disabled=false;
				document.getElementById(resolution).disabled=true;
			}
			RESOURCES_LOADED=true;
		};

		if(first){
			// The number 0 means you are in index.html, and 1 means you want
			// wireframe.
			container = document.getElementById( "content" );
			document.body.appendChild( container );



			// renderer

			renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
			renderer.autoClear = true;

			if(window.innerWidth<window.innerHeight){
				renderer.setSize( window.innerWidth/2, window.innerWidth/2 );
			}else{
				renderer.setSize( window.innerHeight/2, window.innerHeight/2 );
			}

			container.appendChild( renderer.domElement );

			// scene


			scene = new THREE.Scene();
			// scene.background = new THREE.Color( 0xccd9ff );
			renderer.setClearColor(0xccd9ff,0);
			renderer.domElement.style.border="thin solid #ff3300";
			// camera

			camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 10000 );

			camera.position.set( 4,0,0 );
			scene.add( camera ); // required, because we are adding a light
			// as a child of the camera

			// lights

			scene.add( new THREE.AmbientLight( 0x222222 ) );

			var light1 = new THREE.PointLight( 0xffffff, 0.6 );
			light1.position.set(0,1,0);	
			camera.add(light1);
		}else{
			container = document.getElementById( "content" );
			for (var i = group.children.length - 1; i >= 0 ; i--) {
				var child = group.children[ i ];

				if (child !== camera ) { // plane & camera are stored earlier
					group.remove(child);
					createTextMesh();
				}
			}
		}	
		if(number==0){
			// disable the buttons for a little while to prevent spamming errors
			document.getElementById("chinese: pics").disabled=true;
			document.getElementById("chinese: words").disabled=true;
			document.getElementById("low").disabled=true;
			document.getElementById("medium").disabled=true;
			document.getElementById("high").disabled=true;
		}

		// object

		var loader = new THREE.STLLoader(loadingManager);
		whichDodec=stlFile;
		if(number==0){
			stlFile="Finished products/"+stlFile+"_"+resolution+".stl";
		}else{
			stlFile="Finished products/"+stlFile+".stl";
		}
		loader.load( stlFile, function ( geometry ) {
			if(number==0){
				if(whichDodec=='original')
					var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
				else
					var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
				mesh = new THREE.Mesh( geometry, material );
				group.rotation.x=previous[0];
				group.rotation.y=previous[1];
				group.rotation.z=previous[2];
				group.add(mesh); scene.add( group );
			}else{
				var material = new THREE.MeshPhongMaterial( { color: 0xccd9ff } );
				mesh = new THREE.Mesh( geometry, material );
				group.rotation.x=previous[0];
				group.rotation.y=previous[1];
				group.rotation.z=previous[2];
				group.add(mesh); scene.add( group );
			}
			if(number==1){
				helper = new THREE.WireframeHelper( mesh );
				helper.material.color.set( 0xff0000 );
				helper.rotation.x=previous[0];
				helper.rotation.y=previous[1];
				helper.rotation.z=previous[2];
				scene.add(helper);
				var material=new THREE.PointsMaterial( {size:0.04, color: 0x27ae60 } );
				dot = new THREE.Points( geometry,material );
				scene.add(dot);
				withHelper=true;
			}

		} );


		camera.aspect = 1;  
		camera.updateProjectionMatrix();
		window.addEventListener( 'resize', onWindowResize, false );
		addMouseHandler(renderer);
		animate();
		if(number==1){
			zoom=3;
		}else{
			zoom=3.5;
		}
	}

	this.changePics=function changePics(stlFile, number,first){
		RESOURCES_LOADED=false;
		first2=true;
		previous=[ group.rotation.x, group.rotation.y, group.rotation.z];

		init(stlFile, number,first);

	}
	this.changeRes=function changeRes(res, number,first){
		RESOURCES_LOADED=false;
		first2=true;
		previous=[ group.rotation.x, group.rotation.y, group.rotation.z];

		init(whichDodec, number,first);

	}
	function onWindowResize() {

		if(window.innerWidth<window.innerHeight){
			renderer.setSize( window.innerWidth/2, window.innerWidth/2 );

		}else{
			renderer.setSize( window.innerHeight/2, window.innerHeight/2 );
		}

	}

//	Everything to make the darn loading screen!
	var first1=true;
	var first2=true;
	var first3=true;
	var imageDone=false;
	var numPic=1;
	var images=new Array();
	var sp;
	var twoDcanvas = document.createElement('canvas');
	var context = twoDcanvas.getContext("2d");
	var size=1024;
	function load(images){
		var image=images[numPic%3];
		twoDcanvas.width=size;
		twoDcanvas.height=size;
		context.drawImage(image,0,0,image.width,image.height,0,0,size,size);
		var amap = new THREE.Texture(twoDcanvas);
		amap.needsUpdate = true;
		var mat = new THREE.SpriteMaterial({
			map: amap,
			transparent: true,
		});
		var oldsp=sp;
		sp = new THREE.Sprite(mat);
		scene.add(sp);
		sp.name=numPic;

		render();
		first3=false;
		if(!first3){
			scene.remove(oldsp);
		}
	}
	function timeout(){
		numPic++;
		if(imageDone){
			load(images);
		}
		if(!RESOURCES_LOADED){
			setTimeout(timeout,200);
		}
	}
//	Everything to make the loading screen end!
	function animate() {
		// More making the loading screen
		if(!RESOURCES_LOADED){
			if(first1){
				first1=false;
				var imageLoader=new THREE.ImageLoader();
				imageLoader.load('pics/loading-1.png',function(image0){
					images[0]=image0;

					imageLoader.load('pics/loading-2.png',function(image1){
						images[1]=image1;

						imageLoader.load('pics/loading-3.png',function(image2){
							images[2]=image2;
							imageDone=true;
						});			
					});			
				});

			}
			if(first2&&imageDone){
				first2=false;
				timeout();
			}
			requestAnimationFrame( animate );
			render();
			return;
		}else{
			// Making the actual dodecahedron
			requestAnimationFrame( animate );

			render();
		}

	}
	function render() {

		camera.position.x = zoom;
		camera.position.z = 0;

		camera.lookAt( scene.position );
		renderer.render( scene, camera );

	}




//	All of the stuff needed for MouseListener (what they mean, detact dragging,
//	etc)...
//	Mouse listener
	var mouseDown = false,
	mouseX = 0,
	mouseY = 0;
//	false means left, true means right.
	var LeftRightMouse=false;

	function onMouseMove(evt) {
		var rect= renderer.domElement.getBoundingClientRect();
		if(evt.clientX<rect.left || evt.clientX>rect.right || evt.clientY<rect.top || evt.clientY>rect.bottom){
			mouseDown=false;
			LeftRightMouse=false;
		}
		if (!mouseDown) {
			return;
		}
		evt.preventDefault();

		var deltaX = evt.clientX - mouseX,
		deltaY = evt.clientY - mouseY;
		mouseX = evt.clientX;
		mouseY = evt.clientY;
		rotateScene(deltaX, deltaY);
	}

	function onMouseDown(evt) {
		evt.preventDefault();
		if(evt.which==3){
			LeftRightMouse=true;

		}
		mouseDown = true;
		mouseX = evt.clientX;
		mouseY = evt.clientY;

	}
	function onMouseUp(evt) {
		evt.preventDefault();
		mouseDown = false;
		LeftRightMouse=false;
	}

//	all of the stuff for mouse listener end.
	function addMouseHandler(canvas) {

		// adds all of the kisteners basically...
		document.addEventListener('mousemove', function (e) {
			onMouseMove(e);
		}, false);
		document.getElementById('zodiac').style.backgroundColor="#fffa00";
		renderer.domElement.addEventListener('mousedown', function (e) {
			onMouseDown(e);
		}, false);
		renderer.domElement.addEventListener('mouseup', function (e) {
			onMouseUp(e);
		}, false);
		renderer.domElement.addEventListener('dblclick', function (e) {
			if(turning){
				group.rotation.x=turnToX;
				console.log(turnToX);
				group.rotation.y=turnToY;
				group.rotation.z=turnToZ;

			}
		}, false);
		document.addEventListener("mouseleave",function(e){
			mouseDown=false;
			LeftRightMouse=false;
		},false);


		// Firefox is weird
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
			renderer.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false );
		}else{
			renderer.domElement.addEventListener( 'mousewheel', mousewheel, false );
		}


		// These are for touch screens only.
		document.addEventListener("touchstart", function(e){
			document.getElementById('zodiac').style.backgroundColor="#fffa00"
		}, true);
		renderer.domElement.addEventListener("touchstart", touchHandler, true);
		renderer.domElement.addEventListener("touchmove", touchHandler, true);
		renderer.domElement.addEventListener("touchend", touchHandler, true);
		renderer.domElement.addEventListener("touchcancel", touchHandler, true); 

		// Rotation, double tap, zoom-in, zoom-out
		var hammer=new Hammer(renderer.domElement);
		// create recognizers
		var Rotate = new Hammer.Rotate();
		var Pinch = new Hammer.Pinch();
		var Tap=new Hammer.Tap();
		hammer.add(Rotate);
		Rotate.recognizeWith(Pinch);
		Rotate.requireFailure(Tap);
		Pinch.requireFailure(Tap);
		// rotate
		hammer.add([Rotate,Pinch,Tap]);
		var currentRotation = 0, lastRotation, startRotation;
		hammer.on('rotatemove', function(e) {
			var xAxis= new THREE.Vector3(-1,0,0);
			var rotation=-e.rotation;
			console.log("rotation:"+rotation);
			if(withHelper){
				rotateAroundWorldAxis(helper,xAxis,rotation*Math.PI/18000);
				rotateAroundWorldAxis(dot,xAxis,rotation*Math.PI/18000);
			}
			rotateAroundWorldAxis(group,xAxis,rotation*Math.PI/18000);
		});
		hammer.on('pinchout',function(e){
			// zooming in
			zoom-=e.scale/10;
			if(!withHelper){
				if(zoom<3.5){
					zoom=3.5;
				}
			}else{
				if(zoom<2){
					zoom=2;
				}
			}

		});
		hammer.on('pinchin',function(e){
			// zooming out
			zoom+=e.scale/10;

		});
		hammer.on('tap',function(e){
			if(turning){
				group.rotation.x=turnToX;
				console.log(turnToX);
				group.rotation.y=turnToY;
				group.rotation.z=turnToZ;

			}
		});





	}

	function touchHandler(event)
	{
		var touches = event.changedTouches,
		first = touches[0],
		type = "";
		if(event.touches.length==1){
			switch(event.type)
			{
			case "touchstart": type = "mousedown"; break;
			case "touchmove":  type = "mousemove"; break;        
			case "touchend":   type = "mouseup";   break;
			case "touchleave":   type = "mouseleave";   break;
			default:           return;
			}

			// initMouseEvent(type, canBubble, cancelable, view, clickCount,
			// screenX, screenY, clientX, clientY, ctrlKey,
			// altKey, shiftKey, metaKey, button, relatedTarget);

			var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent(type, true, true, window, 1, 
					first.screenX, first.screenY, 
					first.clientX, first.clientY, false, 
					false, false, false, 0/* left */, null);

			first.target.dispatchEvent(simulatedEvent);
			event.preventDefault();
		}
	}


	function rotateScene(deltaX, deltaY) {
		// this turn the object if mouse is dragged
		var xAxis= new THREE.Vector3(-1,0,0);
		var yAxis = new THREE.Vector3(0,1,0);
		var zAxis = new THREE.Vector3(0,0,-1);
		if(LeftRightMouse){
			rotateAroundWorldAxis(group,xAxis,deltaX/250);
			if(withHelper){
				rotateAroundWorldAxis(helper,xAxis,deltaX/250);
				rotateAroundWorldAxis(dot,xAxis,deltaX/250);
			}
		}else{
			rotateAroundWorldAxis(group,yAxis,deltaX/250);
			rotateAroundWorldAxis(group,zAxis,deltaY/250);
			if(withHelper){
				rotateAroundWorldAxis(helper,yAxis,deltaX/250);
				rotateAroundWorldAxis(helper,zAxis,deltaY/250);
				rotateAroundWorldAxis(dot,yAxis,deltaX/250);
				rotateAroundWorldAxis(dot,zAxis,deltaY/250);
			}
		}
	}

	function rotateAroundWorldAxis( object, axis, radians ) {
		// function that helps with rotation around world axis
		var rotationMatrix = new THREE.Matrix4();

		rotationMatrix.makeRotationAxis( axis.normalize(), radians );
		rotationMatrix.multiply( object.matrix );                       // pre-multiply
		object.matrix = rotationMatrix;
		object.rotation.setFromRotationMatrix(object.matrix);

	}

	function mousewheel( evt ) {   
		// zoom in our out (make camera/view closer to the mesh).
		evt.preventDefault();
		evt.stopPropagation();              
		var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta // check for
				// detail
				// first,
				// because
				// it is
				// used by
				// Opera and
				// FF
				if(delta > 0) {
					zoom=zoom-0.25;
				}else{
					zoom=zoom+0.25;
				}
		if(!withHelper){
			if(zoom<3.5){
				zoom=3.5;
			}
		}else{
			if(zoom<2){
				zoom=2;
			}
		}
	}

	var turnToX, turnToY, turnToZ;

	this.moveCam=function moveCam(){
		yourZodiac=determineZodiac();
		if(yourZodiac=='' || yourZodiac==null||yourZodiac==undefined){
			if(stlFile=="original")
				alert("Please enter a correct birth date");
		}else{
			try{
				group.remove(textMesh);
				createTextMesh();
			}catch(err){
				// nothing to remove, first time running this...
			}
			setCookie(stlFile,yourZodiac,365);
			document.getElementById('OK').innerHTML="Speed up";
			changeTextShowZodiac(yourZodiac);
			turnTo(yourZodiac);
			turn();
		}
	}
	var turning=false;
	function turn(){
		// this animates the turning of the mesh if button is clicked (with
		// approximated angles)
		turning=true;
		if(group.rotation.x.toFixed(2)<turnToX){
			group.rotation.x+= 0.01;
		}else if(group.rotation.x.toFixed(2)>turnToX){
			group.rotation.x-=0.01;
		}
		if(group.rotation.y.toFixed(2)<turnToY){
			group.rotation.y+=0.01;
		}else if(group.rotation.y.toFixed(2)>turnToY){
			group.rotation.y-=0.01;
		}
		if(group.rotation.z.toFixed(2)<turnToZ){
			group.rotation.z+=0.01;
		}else if(group.rotation.z.toFixed(2)>turnToZ){
			group.rotation.z-=0.01;
		}
		if(group.rotation.x.toFixed(2)!=turnToX || group.rotation.y.toFixed(2)!=turnToY || group.rotation.z.toFixed(2)!=turnToZ){

			setTimeout(turn,40);
		}else{
			document.getElementById('OK').innerHTML="OK";
			document.getElementById('OK').disabled=true;
			turning=false;
		}

	}

	function turnTo(yourZodiac){
		// these are estimated angles for each rotation.
		if ( yourZodiac=='goat'|| yourZodiac=='Cancer'){
			turnToX=0.35;
			turnToY=-0.5;
			turnToZ=0.08;
		}
		else if ( yourZodiac==='rooster'|| yourZodiac=='Scorpio'){
			turnToX=0.2;
			turnToY=-2.08;
			turnToZ=-1.73;
		}
		else if ( yourZodiac=='monkey'|| yourZodiac=='Gemini'){
			turnToX=-0.15;
			turnToY=-1;
			turnToZ=-1.37;
		}
		else if ( yourZodiac=='horse'|| yourZodiac=='Capricorn'){
			turnToX=1.87;
			turnToY=0.04;
			turnToZ=-1.07;
		}
		else if ( yourZodiac=='ox'|| yourZodiac=='Leo'){
			turnToX=-0.1;
			turnToY=2.11;
			turnToZ=1.31;
		}
		else if ( yourZodiac=='rabbit'|| yourZodiac=='Pisces'){
			turnToX=1.55;
			turnToY=2.67;
			turnToZ=0.05;
		}
		else if ( yourZodiac=='snake'|| yourZodiac=='Taurus'){
			turnToX=-1.25;
			turnToY=3.1;
			turnToZ=-1.1;
		}
		else if ( yourZodiac=='rat'|| yourZodiac=='Sagittarius'){
			turnToX=-2.23;
			turnToY=0.98;
			turnToZ=1.63;
		}
		else if ( yourZodiac=='pig'|| yourZodiac=='Libra'){
			turnToX=0;
			turnToY=-6.27;
			turnToZ=1.13;
		}
		else if ( yourZodiac=='dragon'|| yourZodiac=='Aries'){
			turnToX=-0.37;
			turnToY=0.58;
			turnToZ=0.1;
		}
		else if ( yourZodiac=='dog'|| yourZodiac=='Aquarius'){
			turnToX=1.9;
			turnToY=-3.06;
			turnToZ=1.05;
		}
		else if ( yourZodiac=='tiger'|| yourZodiac=='Virgo'){
			turnToX=1.53;
			turnToY=5.8;
			turnToZ=-3.2;
		}else{
			alert('Typo, should not happen, please fix.');
		}

	}


	function changeTextShowZodiac(zodiac){
		if(stlFile=='original'){
			var showWords=document.getElementById('West');
			showWords.innerHTML= ("Your western zodiac: "+zodiac+"</br>").fontsize(5);
		}
		if(stlFile=='chinese' || stlFile=='chinese_word'){
			var showWords=document.getElementById('East');
			showWords.innerHTML= ("Your chinese zodiac: "+zodiac).fontsize(5);
		}


	}

	function determineZodiac(){
		// determines the zodiac from the given date
		var zodiac;
		if(document.getElementById("date").value=='' || document.getElementById("month").value=='' || document.getElementById("year").value==''){
			return zodiac;
		}

		var date = parseFloat(document.getElementById("date").value);
		var month = parseFloat(document.getElementById("month").value);
		var year = parseFloat(document.getElementById("year").value);
		if(date>31 || month>12 ||(month==2 && date>29)
				|| ((month==4 || month==6 || month == 9 || month==11)&& date>30 ) ){
			return zodiac;
		}
		determined=true;
		if(whichDodec=='original'){
			if(date<=20){
				month--;
			}
			switch(month){
			case 0:
				// December 20th or later
				zodiac='Capricorn';
				break;
			case 1:
				zodiac='Aquarius'
					break;
			case 2:
				zodiac='Pisces';
				break;
			case 3:
				zodiac='Aries';
				break;

			case 4:
				zodiac='Taurus';
				break;
			case 5:
				zodiac='Gemini';
				break;
			case 6:
				zodiac='Cancer';
				break;
			case 7:
				zodiac='Leo';
				break;
			case 8:
				zodiac='Virgo';
				break;
			case 9:
				zodiac='Libra';
				break;
			case 10:
				zodiac='Scorpio';
				break;
			case 11:
				zodiac='Sagittarius';
				break;
			case 12:
				zodiac='Capricorn';
				break;
			default:
				zodiac='';


			}
		}else if(whichDodec=='chinese' ||whichDodec=='chinese_word'){

			if(month<2){
				year--;
			}
			var rem=year%12;
			switch(rem){
			case 0:
				zodiac='monkey';
				break;
			case 1:
				zodiac='rooster'
					break;
			case 2:
				zodiac='dog';
				break;
			case 3:
				zodiac='pig';
				break;

			case 4:
				zodiac='rat';
				break;
			case 5:
				zodiac='ox';
				break;
			case 6:
				zodiac='tiger';
				break;
			case 7:
				zodiac='rabbit';
				break;
			case 8:
				zodiac='dragon';
				break;
			case 9:
				zodiac='snake';
				break;
			case 10:
				zodiac='horse';
				break;
			case 11:
				zodiac='goat';
				break;
			default:
				zodiac='';


			}
		}

		return zodiac;
	}

	this.showName=function showName(){
		createTextMesh();
	}
	function createTextMesh(){

		var loader = new THREE.FontLoader();

		loader.load( 'js/Harabara_Regular.json', function ( font ) {
			var userName=document.getElementById("Username").value;
			if(userName==null || userName=="" || userName==undefined)
				userName="Your name here";
			var charSize = 1/userName.length;
			if(charSize>0.07)
				charSize=0.07;
			var textGeo = new THREE.TextGeometry( userName , {

				font: font,

				size: charSize,
				height: 0.025,
				curveSegments: 1,
				bevelSize: 0.1,
				weight:"thin"

			} );

			var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
			if(whichDodec=='chinese' || whichDodec=='chinese_word')
				textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
			else
				textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
			try{
				group.remove(textMesh);
			}catch(err){
				// nothing to remove, first time running this...
			}
			textMesh = new THREE.Mesh( textGeo, textMaterial );

			// Set rotation

			//First rotate to flat
			var R1;
			var R2;
			var R3;
			var xAxis= new THREE.Vector3(1,0,0);
			var yAxis = new THREE.Vector3(0,1,0);
			var zAxis = new THREE.Vector3(0,0,1);
			rotateAroundWorldAxis(textMesh,zAxis,Math.PI);
			rotateAroundWorldAxis(textMesh,xAxis,Math.PI);
			//Then rotate to given
			var K1, K2, K3;
			var theta;

			if ( yourZodiac=='goat'|| yourZodiac=='Cancer'){
				K1=-0.1506;
				K2=-0.9510;
				K3=0.2701;
				theta=1.0605;
			}
			else if ( yourZodiac==='rooster'|| yourZodiac=='Scorpio'){
				K1=-0.1947;
				K2=0.2680;
				K3=0.9435;
				theta=1.9397;
			}
			else if ( yourZodiac=='monkey'|| yourZodiac=='Gemini'){
				K1=0.3520;
				K2=-0.2558;
				K3=0.9004;
				theta=1.3579;
			}
			else if ( yourZodiac=='horse'|| yourZodiac=='Capricorn'){
				K1=-0.2983;
				K2=-0.6439;
				K3=0.7046;
				theta=2.9725
			}
			else if ( yourZodiac=='ox'|| yourZodiac=='Leo'){
				K1=0.5729;
				K2=0.7885;
				K3=-0.2240;
				theta=2.8190;
			}
			else if ( yourZodiac=='rabbit'|| yourZodiac=='Pisces'){
				K1=0.6578;
				K2=0.6578;
				K3=0.3668;
				theta=2.43485;
			}
			else if ( yourZodiac=='snake'|| yourZodiac=='Taurus'){
				K1=-0.9009;
				K2=0.4174;
				K3=-0.1186;
				theta=1.5851;
			}
			else if ( yourZodiac=='rat'|| yourZodiac=='Sagittarius'){
				K1=-0.2983;
				K2=0.9181;
				K3=0.2608;
				theta=2.9725;
			}
			else if ( yourZodiac=='pig'|| yourZodiac=='Libra'){
				K1=-0.4378;
				K2=-0.7853;
				K3=-0.4378;
				theta=1.8102
			}
			else if ( yourZodiac=='dragon'|| yourZodiac=='Aries'){
				K1=0.1558;
				K2=-0.9840;
				K3=-0.0869;
				theta=2.1381;
			}
			else if ( yourZodiac=='dog'|| yourZodiac=='Aquarius'){
				K1=0.9153;
				K2=0.1101;
				K3=0.3875;
				theta=1.7485;
			}
			else if ( yourZodiac=='tiger'|| yourZodiac=='Virgo'){
				K1=-0.4378;
				K2=0.4378;
				K3=-0.7853;
				theta=1.8102;
			}else{
				K1=0;
				K2=0;
				K3=0;
				theta=0;
			}

			rotateAroundWorldAxis(textMesh,new THREE.Vector3(K1,K2,K3),theta);


			// Set position
			var P1;
			var P2;
			var P3;



			if ( yourZodiac=='goat'|| yourZodiac=='Cancer'){
				P1=0.9342;
				P2=-0.3568;
				P3=0;
			}
			else if ( yourZodiac==='rooster'|| yourZodiac=='Scorpio'){
				P1=0.3568;
				P2=0;
				P3=-0.9342;
			}
			else if ( yourZodiac=='monkey'|| yourZodiac=='Gemini'){
				P1=0.5774;
				P2=0.5774;
				P3=-0.5774;
			}
			else if ( yourZodiac=='horse'|| yourZodiac=='Capricorn'){
				P1=0;
				P2=0.9342;
				P3=0.3568;
			}
			else if ( yourZodiac=='ox'|| yourZodiac=='Leo'){
				P1=-0.5774;
				P2=0.5774;
				P3=0.5774;
			}
			else if ( yourZodiac=='rabbit'|| yourZodiac=='Pisces'){
				P1=-0.9342;
				P2=0.3568;
				P3=0;
			}
			else if ( yourZodiac=='snake'|| yourZodiac=='Taurus'){
				P1=0;
				P2=-0.9342;
				P3=0.3568;
			}
			else if ( yourZodiac=='rat'|| yourZodiac=='Sagittarius'){
				P1=0;
				P2=-0.9342;
				P3=0.3568;
			}
			else if ( yourZodiac=='pig'|| yourZodiac=='Libra'){
				P1=0;
				P2=-0.9342;
				P3=0.3568;
			}
			else if ( yourZodiac=='dragon'|| yourZodiac=='Aries'){
				P1=0.5774;
				P2=-0.5774;
				P3=0.5774;
			}
			else if ( yourZodiac=='dog'|| yourZodiac=='Aquarius'){
				P1=-0;
				P2=0.9342;
				P3=-0.3568;
			}
			else if ( yourZodiac=='tiger'|| yourZodiac=='Virgo'){
				P1=-0.9342;
				P2=-0.3568;
				P3=0;
			}else{
				P1=-0;
				P2=0;
				P3=0;
			}


			textMesh.position.set(P1,P2,P3);





			//Set matrix (try)
			var rotationMatrox = new THREE.Matrix4();


			group.add(textMesh);

		} );

	}
}