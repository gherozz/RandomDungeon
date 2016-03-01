var numeroSchede = 3;


$(document).ready( function(){

	$("#pull1").click(function(){
		chiudiTuttiApriQuesto("#main1");
	});
	$("#pull2").click(function(){
		chiudiTuttiApriQuesto("#main2");
	});
	$("#pull3").click(function(){
		chiudiTuttiApriQuesto("#main3");
	});
});	

function chiudiTuttiApriQuesto(idDaTogglare) {
	$(idDaTogglare).css("height", $(".toggle-container").height());
	solo = true;
	for (var x = numeroSchede; x>0; x--){
		idMain = "#main" + x;
 		if($(idMain).css("display") == "block" && idMain != idDaTogglare){
			solo = false;
			$(idMain).animate({width: "toggle"}, "slow", "easeOutBounce")
			.queue( function() {
				$(idDaTogglare).animate({width: "toggle"},"slow", "easeOutBounce");
				$( this ).dequeue();
			} );
		}
	}
	if (solo == true) $(idDaTogglare).animate({width: "toggle"},"slow", "easeOutBounce");
}

