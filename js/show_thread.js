var index = {};

var data = {};
data.id_log = "?id_log=serie_1_groupe_3";//
data.arguments_="";
data.id_thread_traiter=$_GET('id');

var objet_des_messages= {};
objet_des_messages.page_number = $_GET('page_number')-1;	

/**
fonction lancer au démarrage
*/
index.start=function(){		
	index.show_thread(data.id_thread_traiter);//pour récupérer tous les message du thread
	index.post_message_btn();
};
/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/
/**
on affiche les messages du thread
on en affiche que 5
*/
index.afficher_les_messages = function(array){
	var htmlGlobalToAdd = "";
	array=array.reverse();
	for (var i = objet_des_messages.page_number*5; i<objet_des_messages.page_number*5+5; i++){
		if(array[i]){
		htmlGlobalToAdd+=  '<li class="list-group-item active" style="">'+index.chercher_auteur(array[i])+'</li>';
		htmlGlobalToAdd+=  '<li class="list-group-item" style="height:50px;">'+index.chercher_balise(array[i])+'</li></br>';
		}
		else 
			htmlGlobalToAdd+=  '<li class="list-group-item" style="height:50px;">pas de réponse</li></br>';
	}
	document.getElementById('messages_a_afficher').innerHTML = htmlGlobalToAdd;
};
/**
analyse si une chaine contient [author][/author] et renvoie l'auteur sous forme de chaine
*/
index.chercher_auteur = function(str){
	if(str.indexOf("[author]")!=(-1) && str.indexOf("[/author]")!=(-1)){
		var author_name = str.substring(str.indexOf("[author]")+8, str.indexOf("[/author]"));
		return "Nom de l'auteur: "+author_name;
	}else return "guest";

};
/**
renvoi la meme chaine en supprimant les balise author, et en remplacant les lien des video
*/
index.chercher_balise = function(str){
	/** suppression des balises author*/
	if(str.indexOf("[author]")!=(-1) && str.indexOf("[/author]")!=(-1)){
		str = str.replace(str.substring(str.indexOf("[author]")+8, str.indexOf("[/author]"))," ");
		str = str.replace("[author]"," ");
		str = str.replace("[/author]"," ");
	}
	/** remplacement des balise video par un embed code*/
	if(str.indexOf("[vid]")!=(-1) && str.indexOf("[/vid]")!=(-1)){
		var lien_video_a_lire = str.substring(str.indexOf("[vid]")+5, str.indexOf("[/vid]"));
		str = str.replace(lien_video_a_lire,'<a href='+lien_video_a_lire+' target="_blank">video</a>');		
		str = str.replace("[vid]"," ");
		str = str.replace("[/vid]"," ");
	}if(str.indexOf("[img]")!=(-1) && str.indexOf("[/img]")!=(-1)){
		//str = str.replace(str.substring(str.indexOf("[img]")+5, str.indexOf("[/img]"))," ");
		str = str.replace("[img]"," ");
		str = str.replace("[/img]"," ");
	}
	return str;
};
/**
on afiche le pagination panel en bas
*/
index.afficher_pagination_panel =function(){
	var htmlGlobalToAdd = "";	
	for(var i=0;i<objet_des_messages.nombre_de_page;i++){
		if(objet_des_messages.page_number==i)
			htmlGlobalToAdd+='<li class="active" onclick="index.redirection_pagination_panel('+(i+1)+')"><a href="#">'+(i+1)+'</a></li>';
		else
			htmlGlobalToAdd+='<li class="" onclick="index.redirection_pagination_panel('+(i+1)+')"><a href="#">'+(i+1)+'</a></li>';
	}	
	document.getElementById('pagination_panel').innerHTML =  '<li>'+htmlGlobalToAdd+'</li>';
	
};
/**
fonction qui redirige lorsque l'on clique sur un numero
*/
index.redirection_pagination_panel = function(nb){
	window.location=('./show_thread.html?id='+data.id_thread_traiter+'&page_number='+nb);	
}

/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/
/**
BOUTON la partie poster un message
*/
index.post_message_btn =function(){
	$( "#post_message_btn" ).click(function( event ) {
		console.log("je clik");	
		var author = "[author]"+document.getElementById('input_author').value+"[/author]";
		var message = author + document.getElementById('input_message').value;
		if(message.length>=1) index.reply_to_thread(data.id_thread_traiter,message)
		event.preventDefault();
	});
};
/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/
/**
envoie une deamnde de reply sur le thread id avec le message info
*/
index.reply_to_thread = function(id,info){
	id+="";
	info+="";
	data.action_="reply_to_thread";
	data.arguments_="&id="+id+"&info="+info;	
	index.get(data,index.callback);
};
/**
envoie une demande de récupération des message en fonction de l'id du thread entré
*/
index.show_thread=function(id){
	id+="";
	data.action_="show_thread";
	data.arguments_="&id="+id;
	index.get(data,index.callback);
};
/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/
/*************************************************************************************/
index.get =  function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://tp-iwa.waxo.org/"+data.action_+data.id_log+data.arguments_,true);
    xhr.send(null);
    xhr.onreadystatechange = callback;   	
};

index.callback = function () {	
	//console.log(r);
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);
		if(getActionFromUrlResponse(this.responseURL) == "show_thread"){			
			objet_des_messages.nombre_de_message=(r.thread.length);/** nombre de message = taille du tab recu*/
			objet_des_messages.nombre_de_page=Math.ceil(r.thread.length/5);/** nombre de page = nombre de message/5*/	
			index.afficher_les_messages(r.thread);//on afficher les messages
			index.afficher_pagination_panel();//on affiche le 1,2,3....

		}else if(getActionFromUrlResponse(this.responseURL) == "reply_to_thread"){
			console.log(r);
			window.location=('./show_thread.html?id='+data.id_thread_traiter+'&page_number=1');	
		}			
 	}else if (this.readyState == 4 && this.status == 500) {
 		console.log("erreur");
 	}
};

window.onload = function(){
	setTimeout(index.start,10);

}


/**
fonction pour recuperer l'action dans responseURL
*/
var getActionFromUrlResponse = function(str){
	str+="";
	str=str.split("http://tp-iwa.waxo.org/");
	str = str[1].split("?");
	str = str[0];
	return str;	
};

/**
on recoi la page sous forme  show_thread.html?id=1000
La fonction permet de récupérer le 1000 
*/
function $_GET(key,default_) {
 if (default_==null) default_="";
       key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
       var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
       var qs = regex.exec(window.location.href);
       if(qs == null) return default_; else return qs[1];
};

