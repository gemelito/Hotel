var info = {};
var sTop = 0;
var pos = 0;
var intv;
var IndividualView;
var flippedElement;
var opcionesHoteles=[{opciones:[{opcion:'Cuarto individual'},{opcion:'Alberca privada'},
					 {opcion:'Jacuzzi con burbujas'}]},{opciones:[{opcion:'Cuarto individual'},{opcion:'Alberca privada'},
					 {opcion:'Jacuzzi de oro'}]},{opciones:[{opcion:'Cuarto individual'},{opcion:'Alberca privada'},{opcion:'Jacuzzi'}]}];
$(document).on('ready',function(){
	$(window).on('resize',function(){
		init();
	});
	window.addEventListener('orientationchange',init);
	init();	
});
function init(){
	index();
}
function handleClick(){
	var m = 0;
	if ($(this).parent().hasClass('nav')){
		m = $(this).index();
		pos = $(this).index();
		clearInterval(intv);
		intv = setInterval(handleClick,10000);
	} 
	else{
		pos++;
		if(pos>=$('.slide').length){
			pos = 0;		
		}
		m = pos;
	}
	$('.form_container .slideContainer').fadeOut('slow',function(){
		$(this).animate({
			'margin-left':-(m  * $('.form_container').width())+'px'
		},'slow',function(){
			$(this).fadeIn('slow');
		});
	})
}
function contacto(){
	var ifr = document.getElementById('map');
	ifr.src = ifr.src;
	$('#map').css('height',(($('#map').width() * 350)/800)+'px');
}
function showNavigation(){
	var n = $('#navigation');
	if(n.is(':visible')){
		n.slideUp();
		return;
	}
	else n.slideDown();
	
}
function index(){
	$.stellar({
		horizontalScrolling: false,
		positionProperty: 'transform'
	});
	$('#navigation').localScroll();
	var scrollorama = $.scrollorama({blocks:'.fullScreen',enablePin:false});
	scrollorama.animate('.mensaje',{delay:700,duration:350,property:'top',end:500});
	scrollorama.animate('.mensaje',{delay:700,duration:200,property:'opacity',end:0});
	scrollorama.animate('.halfRooms',{delay:200,duration:200,property:'left',start:-screen.availWidth,end:0});
	scrollorama.animate('.centerCircle',{delay:400,duration:200,property:'opacity',start:0,end:1});
	scrollorama.animate('.precio',{delay:400,duration:200,property:'zoom',start:0,end:1});
	scrollorama.animate('#google_canvas',{delay:400,duration:200,property:'opacity',start:0,end:1});
	$('#go_up').on('click',function(){
		$('body').animate({scrollTop:0},800);
	});
	$('.nav li').on('click',handleClick);
	$('.image_food').on('click',changeViewport);
	var s = $('.form_container').width();
		$('.slide').each(function(a,e){
			addBackground(e,s,true);
		});	
		clearInterval(intv);
		intv = setInterval(handleClick,10000);
	$(document).on('click','.ver-mas',flipElement);

	$('.image_food').each(function(a,e){
		addBackground(e,false);
		if($(e).hasClass('viewport')) return true;
		$(e).data('top',((a)*100));
		$(e).css({
			'top': $(e).data('top')+'px'
		});
	});
}
function changeViewport(){
	var e = $('.viewport');
	e.css('top',$(e).data('top'))
	e.removeClass('viewport');
	$(this).addClass('viewport');
	$(this).css('top',0);
}
function addBackground(element,width,setSize){
	if(!width) width = $('html').width();
	if(setSize){
		$(element).css({
			'width': width,
			'height': $('html').height()
		});	
	}
	var back = "";
	if($('html').width()<900) back =  $(element).data('background')+'-movil.jpg';
		else back =  $(element).data('background')+'.jpg';
	$(element).css({
		'background-image': "url("+back+")"
	});
	if($(element).height() > $(element).width()){
		$(element).css('background-size','auto 100%');
	}
}
google.maps.event.addDomListener(window, 'load', drawMap);
function flipElement(){
	if(flippedElement != null){$(flippedElement).revertFlip();flippedElement=null;}
	$(flippedElement).remove();
	var p = $(this).parent();
	flippedElement = p;
	$("#precioTemplate").template("CompiledTemplate");
	$(p).flip({
		direction:'rl',
		speed:500,
		content: $("#precioTemplate").tmpl(opcionesHoteles[$(this).data('number')]).html(),
		color:'#f7f7f7',
		onEnd:function(){
			$('#regresar-ventana').on('click',function(){$(flippedElement).revertFlip();flippedElement=null;});

		}
	});		
}

var start;
function drawMap(){
	var map;
	
	var mapOptions = {
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('google_canvas'), mapOptions);
	navigator.geolocation.getCurrentPosition(function(position) {
	var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var marker = new google.maps.Marker({
		map: map,
		draggable: true,
		position: geolocate,
		visible: true
	});
		map.setCenter(geolocate);
		calcRoute(geolocate,map);
	});
	
	
}
function calcRoute(start,mapa) {
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(mapa);
    var end = new google.maps.LatLng(16.756756,-93.143506);
    var marker = new google.maps.Marker({
		map: mapa,
		draggable: true,
		position: end,
		visible: true
		
	});
    var request = {
        origin:start, 
        destination:end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
}