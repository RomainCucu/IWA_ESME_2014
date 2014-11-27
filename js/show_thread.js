var index = {};

var data = {};
data.id_log = "?id_log=serie_1_groupe_3";//
data.arguments_="";
data.id_thread_traiter=$_GET('id');

/**
contient les caractéristiques pour afficher les messages
*/
var objet_des_messages= {};
objet_des_messages.page_number = parseInt($_GET('page_number'))-1;/** pour savoir à quel page on veut accéder*/
objet_des_messages.messages_par_page = parseInt($_GET('messages_par_page'));/** nombre de messages afficher par page*/
console.log(objet_des_messages.messages_par_page);

/**
fonction lancer au démarrage
*/
index.start=function(){		
	index.show_thread(data.id_thread_traiter);//pour récupérer tous les message du thread
	index.post_message_btn();
};
/*************************************************************************************/
/***************************AFFICHER LES MESSAGE***************************************/
/*************************************************************************************/
/*************************************************************************************/
/**
on affiche le premier message du thread, cad le sujet, la question
*/
index.afficher_le_sujet_du_thread = function(string){
	var htmlGlobalToAdd="";
	htmlGlobalToAdd+= "Thread number : "+data.id_thread_traiter;
	htmlGlobalToAdd+="<h3>"+index.chercher_auteur(string)+"</h3>"
	htmlGlobalToAdd+='<h3>Message: </h3><small>'+index.chercher_balise(string)+'</small>';
	document.getElementById('numero_du_thread').innerHTML = htmlGlobalToAdd;
	
};
/**
on affiche les messages du thread
on en affiche que 5
*/
index.afficher_les_messages = function(array){
	var htmlGlobalToAdd = "";/** string pour afficher les réponses*/
	array=array.reverse();/** affichage tu plus récent au plus ancien*/
	for (var i = objet_des_messages.page_number*objet_des_messages.messages_par_page; i<objet_des_messages.page_number*objet_des_messages.messages_par_page+objet_des_messages.messages_par_page; i++){
		
		if(array[i] && i!=(array.length-1)){/** si le message existe et que ce n'est pas le premier message posté, cad la question*/
			htmlGlobalToAdd+='<div class="panel panel-default">';
			htmlGlobalToAdd+=  ' <div class="panel-heading"><h3 class="panel-title">'+index.chercher_auteur(array[i])+'</h3></div>';
			htmlGlobalToAdd+=  '<div class="panel-body" style="overflow:scroll;word-wrap: break-word;">'+index.chercher_balise(array[i])+'</div>';
			htmlGlobalToAdd+='</div>';
		}		
	}
	document.getElementById('messages_a_afficher').innerHTML = htmlGlobalToAdd;
};
/**
analyse si une chaine contient [author][/author] et renvoie l'auteur sous forme de chaine
*/
index.chercher_auteur = function(str){
	if(str.indexOf("[author]")!=(-1) && str.indexOf("[/author]")!=(-1)){
		var author_name = str.substring(str.indexOf("[author]")+8, str.indexOf("[/author]"));
		if(author_name.length>=1)	return "Published by : "+author_name;
		else return "Published by : guest";/** si balise mais pas d'auteur*/
	}else{
		return "Published by : guest";
	}

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
		lien_video_remplacement = lien_video_a_lire.replace("watch?v=", "v/");
		str = str.replace(lien_video_a_lire,'<iframe src="'+lien_video_remplacement+'" height="360" width="640" allowfullscreen="" frameborder="0"></iframe>');
		//str = str.replace(lien_video_a_lire,'<a href='+lien_video_remplacement+' target="_blank">video</a>');		
		str = str.replace("[vid]"," ");
		str = str.replace("[/vid]"," ");
	}if(str.indexOf("[img]")!=(-1) && str.indexOf("[/img]")!=(-1)){
		//str = str.replace(str.substring(str.indexOf("[img]")+5, str.indexOf("[/img]"))," ");
		str = str.replace("[img]"," ");
		str = str.replace("[/img]"," ");
	}
	str=emoticons(str);
	return str;
};
/*************************************************************************************/
/********************************PAGINATION PANEL**************************************/
/*************************************************************************************/
/*************************************************************************************/
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
	window.location=('./show_thread.html?id='+data.id_thread_traiter+'&page_number='+nb+'&messages_par_page='+objet_des_messages.messages_par_page);	
}

/*************************************************************************************/
/**********************************POSTER UN MESSAGE*****************************************/
/*************************************************************************************/
/*************************************************************************************/
/**
BOUTON la partie poster un message
*/
index.post_message_btn =function(){
	$( "#post_message_btn" ).click(function( event ) {

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
			objet_des_messages.nombre_de_page=Math.ceil(r.thread.length/objet_des_messages.messages_par_page);/** nombre de page = nombre de message/page*/	
			index.afficher_le_sujet_du_thread(r.thread[0]);/** on envoie le premier message posté*/
			index.afficher_les_messages(r.thread);/** on afficher les messages*/
			index.afficher_pagination_panel();/** on affiche le 1,2,3....*/
			setTimeout(function(){$('#myModal').modal('hide');},1000);
		}else if(getActionFromUrlResponse(this.responseURL) == "reply_to_thread"){
			console.log(r);
			window.location=('./show_thread.html?id='+data.id_thread_traiter+'&page_number=1&messages_par_page='+objet_des_messages.messages_par_page);	
		}			
 	}else if (this.readyState == 4 && this.status == 500) {
 		console.log("erreur");
 	}
};

window.onload = function(){
	$('#myModal').modal('show');
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
/**
function qui retourne le text avec les emoticons
*/
function emoticons(text){
    var url = "../emoticons/";
    var emt = {
       ":D"  : '03.gif',
       ":d"  : '03.gif',
       ":-d"  : '03.gif',
       ":-D" : '03.gif',       
       ":)"  : '01.gif',
       ":-)" : '01.gif',       
       ";)"  : '06.gif',
       ";-)" : '06.gif',
		";-(" : '07.gif',
		";(" : '07.gif',
		

       ":("  : '02.gif',
       ":-(" : '02.gif',
       ":o"  : '05.gif',
       ":O"  : '05.gif',
       ":-O"  : '05.gif',
       ":-o"  : '05.gif',
       ":?"  : '25.gif',
       ":s"  : '25.gif',
       ":S"  : '25.gif',
       ":-s"  : '25.gif',
       ":-S"  : '25.gif',
       "8-)" : '27.gif',
		"8)" : '27.gif',

       ":x"  : '28.gif',
       ":X"  : '28.gif',
       ":-X"  : '28.gif',
       ":-x"  : '28.gif',
       ":P"  : '11.gif',
       ":p"  : '11.gif',
       ":-P"  : '11.gif',
       ":-p"  : '11.gif',
    };

    for (smile in emt){        
        text   = text.replace(smile, '<img src="' + url + emt[smile] + '" class="emoticons" height="21" width="21"/>');
    }

    return (text);
}

