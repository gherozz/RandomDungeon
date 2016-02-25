var y = 0;

$(document).ready(function(){
	$("#bottone-start").click(function(){
		y++;
	})
})

$(window).keypress(function(e){
	if(e.which === 32){
		if(y > 0){
			if($("#bottone-start").prop("disabled") == false){
			gioco();
			}	
		}
	}
})

