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
/**
fonction lancer au démarrage
*/
index.start=function(){		
	index.show_thread(data.id_thread_traiter);/** pour récupérer tous les message du thread*/
	/** pour récupéer les thread toutes les 10 sec*/
	setInterval(function(){
		index.show_thread(data.id_thread_traiter);
	},10000);
	index.btn_post_message();
	index.btn_ajouter_video();
	index.btn_ajouter_image();
};
/*************************************************************************************/
/***************************AFFICHER LES MESSAGE***************************************/
/*************************************************************************************/
/*************************************************************************************/
/**
on affiche le premier message du thread, cad le sujet, la question + lautor + le numero du thread
*/
index.afficher_le_header_du_thread = function(string){
	//string+="";
	document.getElementById('title_thread').innerHTML = "Title: "+ index.chercher_balise_title(string);
	document.getElementById('date_thread').innerHTML = " Thread published: the "+  date_d_m_y_h_m(data.id_thread_traiter);
	document.getElementById('title_author').innerHTML = ""+index.chercher_auteur(string);
	document.getElementById('title_message').innerHTML = ""+index.chercher_balise(string);
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
			htmlGlobalToAdd+=  '<div class="panel-heading"><h3 class="panel-title">Published by: '+index.chercher_auteur(array[i])+'</h3><h5>published the '+index.chercher_balise_date(array[i])+'</h5></div>';
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
	if(str.indexOf("[author]")!=(-1) && str.indexOf("[/author]")!=(-1)){/** si y a les balise author*/
		var author_name = str.substring(str.indexOf("[author]")+8, str.indexOf("[/author]"));/** onrecupere le str entre les 2 balises*/
		if(author_name.length>=1)	return ""+author_name;/** si le nom de lauteur >= 1*/
		else return "guest";
	}else{
		return "guest";
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
	}/**suupression balise date*/
	if(str.indexOf("[date]")!=(-1) && str.indexOf("[/date]")!=(-1)){
		str = str.replace(str.substring(str.indexOf("[date]")+6, str.indexOf("[/date]"))," ");
		str = str.replace("[date]"," ");
		str = str.replace("[/date]"," ");
	}/** suppression balise title*/
	if(str.indexOf("[title]")!=(-1) && str.indexOf("[/title]")!=(-1)){
		str = str.replace(str.substring(str.indexOf("[title]")+7, str.indexOf("[/title]"))," ");
		str = str.replace("[title]"," ");
		str = str.replace("[/title]"," ");
	}
	str = index.chercher_balise_vid(str);
	str = index.chercher_balise_img(str);
	str = emoticons(str);
	return str;
};
/**
retourne le string en remplacant le contenu de [vid]
*/
index.chercher_balise_vid = function(str){
	if(str.indexOf("[vid]")!=(-1) && str.indexOf("[/vid]")!=(-1)){
		var lien_video_a_lire = str.substring(str.indexOf("[vid]")+5, str.indexOf("[/vid]"));		
		if(lien_video_a_lire.length>10){//si le lien est crédible
			str = str.replace(lien_video_a_lire,'<iframe class="embed-responsive-item" src="'+lien_video_a_lire.replace("watch?v=", "v/")+'" height="50%" width="50%" allowfullscreen="" frameborder="0"></iframe>');
		}else{
			str.replace(lien_video_a_lire," ");
		}	
		str = str.replace("[vid]"," ");
		str = str.replace("[/vid]"," ");
		return str;
	}else{
		return str;
	}
};
/**
retourne le string en remplacant le contenu de [img]
*/
index.chercher_balise_img = function(str){
	if(str.indexOf("[img]")!=(-1) && str.indexOf("[/img]")!=(-1)){
		var lien_image_a_afficher = str.substring(str.indexOf("[img]")+5, str.indexOf("[/img]"));
		if(lien_image_a_afficher.length>10){
			str = str.replace(lien_image_a_afficher,'<a  href="'+lien_image_a_afficher+'" TARGET="_new"><img src="'+lien_image_a_afficher+'" alt="image" style="width:25%;height:25%;"></a>');
		}else{
			str = str.replace(lien_image_a_afficher," ");
		}
		str = str.replace("[img]"," ");
		str = str.replace("[/img]"," ");
		return str;
	}else{
		return str;
	}
};
/**
retourne string date
*/
index.chercher_balise_date = function(str){
if(str.indexOf("[date]")!=(-1) && str.indexOf("[/date]")!=(-1)){
		var date = str.substring(str.indexOf("[date]")+6, str.indexOf("[/date]"));				
		return date_d_m_y_h_m(date);
	}else{
		return "undefined";
	}
};
/**
rtourne le string title
*/
index.chercher_balise_title = function(str){
if(str.indexOf("[title]")!=(-1) && str.indexOf("[/title]")!=(-1)){
		var title = str.substring(str.indexOf("[title]")+7, str.indexOf("[/title]"));				
		return title;
	}else{
		return "undefined";
	}
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
	htmlGlobalToAdd=index.pagination_fleche_precedent(htmlGlobalToAdd);/** affichage bouton precedent*/
	for(var i=0;i<objet_des_messages.nombre_de_page;i++){		
		if(objet_des_messages.page_number==i)/** pour mettre en bleu sur la page que lon ait  ACTIVE*/
			htmlGlobalToAdd+='<li class="active" onclick="index.redirection_pagination_panel('+(i+1)+')"><a href="#">'+(i+1)+'</a></li>';
		else
			htmlGlobalToAdd+='<li onclick="index.redirection_pagination_panel('+(i+1)+')"><a href="#">'+(i+1)+'</a></li>';
	}
	htmlGlobalToAdd=index.pagination_fleche_suivant(htmlGlobalToAdd);/** affichage bouton suivant*/
	for(i in document.getElementsByClassName('pagination_panel'))
		document.getElementsByClassName('pagination_panel')[i].innerHTML =  '<li>'+htmlGlobalToAdd+'</li>';		
};
index.pagination_fleche_precedent = function (str){
	if (objet_des_messages.page_number == 0){//si on est deja sur la premiere page, on peut pas faire precedent
		str+='<li class="disabled"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';		
	}else{
		str+='<li onclick="index.redirection_pagination_panel('+objet_des_messages.page_number+')"><a href="#"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';		
	}
	return str;	
};
index.pagination_fleche_suivant = function(str){
	if (objet_des_messages.page_number+1 == objet_des_messages.nombre_de_page){//si on est deja sur la derniere page, on peut pas faire suivant
		 str+='<li class="disabled"><a href="#"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a>';
	}else{
		str+='<li onclick="index.redirection_pagination_panel('+(objet_des_messages.page_number+2)+')"><a href="#"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a>';
	}
	return str;
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
index.btn_post_message =function(){
	document.getElementById("post_message_btn").onclick = function(event) {
		var author = "[author]"+document.getElementById('input_author').value+"[/author]";
		var message = document.getElementById('input_message').value;
		message += "[date]"+(new Date()).valueOf()+"[/date]";
		if(message.length>=1) index.reply_to_thread(data.id_thread_traiter,""+author+message)
		event.preventDefault();
	};
};
index.btn_ajouter_video =function(){
	document.getElementById("btn_ajout_video" ).onclick = function(event) {
		var htmlGlobalToAdd = document.getElementById("input_message").value;
		htmlGlobalToAdd+="[vid][/vid]";
		document.getElementById("input_message").value = htmlGlobalToAdd;
		event.preventDefault();
	};
};
index.btn_ajouter_image =function(){
	document.getElementById("btn_ajout_image").onclick = function(event) {
		var htmlGlobalToAdd = document.getElementById("input_message").value;
		htmlGlobalToAdd+="[img][/img]";
		document.getElementById("input_message").value = htmlGlobalToAdd;
		event.preventDefault();
	};
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
		if(getActionFromUrlResponse(this.responseURL) == "show_thread" && objet_des_messages.nombre_de_message != r.thread.length){			
			objet_des_messages.nombre_de_message=(r.thread.length);/** nombre de message = taille du tab recu*/
			objet_des_messages.nombre_de_page=Math.ceil(r.thread.length/objet_des_messages.messages_par_page);/** nombre de page = nombre de message/page*/	
			index.afficher_le_header_du_thread(r.thread[0]);/** on envoie le premier message posté*/
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
	snow.init(50);
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

 date_d_m_y_h_m = function(d){
 	d = parseInt(d);
	d = new Date(d);
  	var month = (d.getMonth() < 10) ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var day = (d.getDate() < 10) ? "0" + d.getMonth() : d.getMonth();
    var hour = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minute = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var second = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
    return d.getDate() + "." + month + "." + d.getFullYear() + " at " + hour + ":" + minute + ":" + second;
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
    	var tmp = emt[smile];
    	smile = smile.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); 
    	regex = new RegExp(smile,'gi');
        text   = text.replace(regex, '<img src="' + url + tmp + '" class="emoticons" height="21" width="21"/>');
    }

    return (text);
}

