
// L'INVENTARIO RIMANE SEMPRE APERTO, GLI ALTRI MENU SCORRONO A TURNO SOPRA
// PER RITORNARE ALL'INVENTARIO BASTA PREMERE SUL PULL1 O SU UNA QUAKSIASI PARTE DELL'INVENTARIO


$(document).ready( function(){
	$("#pull1,#main1").click(function(){
		// $("#main1").toggle("fold",{horizFirst: false, size: 1000}, "slow");
		$("#main2").hide("slide",{horizFirst: false, size: 1000}, "slow", function(){
			$(".toggle2").width("10%");
			$("#pull2").width("100%");
		});
		$("#main3").hide("slide",{horizFirst: false, size: 1000}, "slow", function(){
			$(".toggle3").width("10%");
			$("#pull3").width("100%");
		});
	});
	$("#pull2").click(function(){
		$(".toggle2").width("100%");
		$("#pull2").width("10%");
		$("#main2").css("height", $(".toggle-container").height());
		// $("#main2").animate({marginTop: "-5.3%"}, "slow");
		
		
		// $("#main1").hide("fold",{horizFirst: false, size: 1000}, "slow");
		$("#main3").hide("slide",{horizFirst: false, size: 1000}, "slow")
		.queue( function() {
			$("#main2").toggle("slide",{horizFirst: false, size: 1000}, "slow");
			$( this ).dequeue();
		} );
	});
	$("#pull3").click(function(){
		$(".toggle3").width("100%");
		$("#pull3").width("10%");
		// $(".toggle2").width("100%");
		// $("#pull2").width("5%");
		$("#main3").css("height", $(".toggle-container").height());
		// $("#main2").css("height", $(".toggle-container").height());
		
		// if($(".toggle2").width() == $(".toggle").width()){
		$("#main2").hide("slide",{horizFirst: false, size: 1000}, "slow")
		.queue( function() {
			$("#main3").toggle("slide",{horizFirst: false, size: 1000}, "slow");
			$( this ).dequeue();
		} );
		// } else{
		// $("#main2").show("slide",{horizFirst: false, size: 1000}, "slow");
		// }
	});
});	

