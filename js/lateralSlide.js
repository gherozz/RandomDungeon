
// L'INVENTARIO RIMANE SEMPRE APERTO, GLI ALTRI MENU SCORRONO A TURNO SOPRA
// PER RITORNARE ALL'INVENTARIO BASTA PREMERE SUL PULL1 O SU UNA QUAKSIASI PARTE DELL'INVENTARIO


$(document).ready( function(){
	$("#pull1,#main1").click(function(){
		if($("#main3").css("display") == "block"){
			$("#main3").animate({width: "toggle"}, "slow", "easeOutBounce");	
		}
		if($("#main2").css("display") == "block"){
			$("#main2").animate({width: "toggle"}, "slow", "easeOutBounce");	
		}
	});
	$("#pull2").click(function(){
		$("#main2").css("height", $(".toggle-container").height());
		if($("#main3").css("display") == "block"){
			$("#main3").animate({width: "toggle"}, "slow", "easeOutBounce")
			.queue( function() {
				$("#main2").animate({width: "toggle"},"slow", "easeOutBounce");
				$( this ).dequeue();
			} );
		}
		else
		{
			$("#main2").animate({width: "toggle"},"slow", "easeOutBounce");
		}
	});
	$("#pull3").click(function(){
		$("#main3").css("height", $(".toggle-container").height());
		if($("#main2").css("display") == "block"){
			$("#main2").animate({width: "toggle"}, "slow", "easeOutBounce")
			.queue( function() {
				$("#main3").animate({width: "toggle"},"slow", "easeOutBounce");
				$( this ).dequeue();
			} );
		}
		else
		{
			$("#main3").animate({width: "toggle"},"slow", "easeOutBounce");
		}
	});
});	

