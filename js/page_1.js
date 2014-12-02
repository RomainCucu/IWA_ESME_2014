var index = {}; // objet contenant l'appel aux webservices
var obj_traitement={}; // obj contenant les fonctions de traitement de données deçu dans la callback
var data = {}; // obj contenant les données à transmettre à la methode GET
data.id_log = "?id_log=serie_1_groupe_3"; // Pour afficher notre nom dans les logs
data.arguments_=""; // Par default : aucun arguments
top3array = new Array();//tableau contenant le top 3



window.onload = function(){	
	setTimeout(index.start,100);
	snow.init(50);	
}

index.start=function(){
	index.get_threads();
	index.btn_new_thread();
	index.btn_wrapper();
};

/**
*********************************************
*********************************************
*********************************************
Pour afficher les thread à gauche et le top 3
*********************************************
*********************************************
*********************************************
*/

obj_traitement.display_liste_threads=function(data){
	document.getElementById("all_threads").innerHTML="";
	document.getElementById("all_threads").innerHTML="<li class=\"sidebar-brand\" style=\"color:white\">Tous les Sujets <span class=\"glyphicon glyphicon-pushpin\" aria-hidden=\"true\"></span></li><hr>";
	
	data.reverse().forEach(function callback_display_threads(element, index, array){
		var string="";
		string+="<li><a target='_blank' href='./html/show_thread.html?id="+element+"&page_number=1&messages_par_page=5'>"+date_d_m_y_h_m(element)+"<span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span></a>";
		string+="<a onclick='index.delete_thread("+element+")' href='#' style=\"color:orange\">Delete<span class=\"glyphicon glyphicon-remove delete_thread_"+element+"\"></span></a></li><li><hr></li>";
		document.getElementById("all_threads").innerHTML+=string;
		
	});
};

obj_traitement.calcul_top_rated_threads=function(data){
	data.forEach(function callback_display_threads(element, indexe, array){
		index.show_thread(element);
	});
};

obj_traitement.calcul2_top_rated_threads=function(data){
top3array.push(data);
top3array.sort(compare);
top3array.reverse();
if(top3array[0]){
	document.getElementById("lien_carousel_1").href = "./html/show_thread.html?id="+top3array[0].id+"&page_number=1&messages_par_page=5";
	document.getElementById("number_of_messages").innerText = ""+top3array[0].thread.length+" messages !";
}if(top3array[1]){
	document.getElementById("lien_carousel_2").href = "./html/show_thread.html?id="+top3array[1].id+"&page_number=1&messages_par_page=5";
	document.getElementById("number_of_messages2").innerText = ""+top3array[1].thread.length+" messages !";
}if(top3array[2]){
	document.getElementById("lien_carousel_3").href = "./html/show_thread.html?id="+top3array[2].id+"&page_number=1&messages_par_page=5";
	document.getElementById("number_of_messages3").innerText = ""+top3array[2].thread.length+" messages !";
}return;
};

/**
*********************************************
*********************************************
*********************************************
Pour les boutons créer un thread et show thread
*********************************************
*********************************************
*********************************************
*/
index.btn_new_thread=function(){
		document.getElementById("send_thread").onsubmit = function(event) {		
		event.preventDefault();//à laisser		
		var text_new_thread=document.getElementById("inputText").value;
		var author_new_thread="[author]"+document.getElementById("inputAuthor").value+"[/author]";
		var title_new_thread="[title]"+document.getElementById('inputTitle').value+"[/title]";
		document.getElementById("send_thread").disabled=true;//pour eviter d'appuyer plusieurs fois, estétique	
		var info = ""+text_new_thread+author_new_thread+title_new_thread;				
		index.new_thread(info);			
	}
};
index.btn_wrapper = function(){
    document.getElementById("menu-toggle").onclick=function(ev){
    	 $("#wrapper").toggleClass("toggled");
    	 if(window.innerWidth<800){
    	 	$("#bouton_navbar_mobile").trigger('click');
    	 }
    	 
    	 
    };
};

/**
*********************************************
*********************************************
*********************************************
Méthode de connextion avec le serveur de maxou
*********************************************
*********************************************
*********************************************
*/
/**
*envoie une demande de récupération d'id des threads
*/
index.get_threads=function(){
	data.action_="get_threads";
	index.get(data,index.callback);
};

/**
*Créer un nouveau thread avec l'info du premier message
*/
index.new_thread=function(info){
	info+="";
	data.action_="new_thread";
	data.arguments_="&info="+info;
	index.get(data,index.callback);
};

/**
*envoie une demande de récupération des message en fonction de l'id du thread entré
*/
index.show_thread=function(id){
	id+="";
	data.action_="show_thread";
	data.arguments_="&id="+id;
	index.get(data,index.callback);
};

/**
*envoie une deamnde de reply sur le thread id avec le message info
*/
index.reply_to_thread = function(id,info){
	id+="";
	info+="";
	data.action_="reply_to_thread";
	data.arguments_="&id="+id+"&info="+info;	
	index.get(data,index.callback);
};

/**
*envoie une demande de suppression du thread id
*/
index.delete_thread = function(id){
	id+="";
	data.action_="delete_thread";
	data.arguments_="&id="+id;
	index.get(data,index.callback);
};

index.get =  function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://tp-iwa.waxo.org/"+data.action_+data.id_log+data.arguments_,true);
    xhr.send(null);
    xhr.onreadystatechange = callback;   	
};
/**
*********************************************
*********************************************
*********************************************
CALLBACK GENERIQUE
*********************************************
*********************************************
*********************************************
*/
index.callback = function () {	
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);
		if(getActionFromUrlResponse(this.responseURL) == "get_threads"){
			//delete_all_threads(r.threads);
			obj_traitement.display_liste_threads(r.threads);
			obj_traitement.calcul_top_rated_threads(r.threads);			
		}else if(getActionFromUrlResponse(this.responseURL) == "show_thread"){
			obj_traitement.calcul2_top_rated_threads(r);
		}else if(getActionFromUrlResponse(this.responseURL) == "new_thread"){						
			window.location.reload();
		}else if(getActionFromUrlResponse(this.responseURL) == "delete_thread"){
			window.location.reload();
		}			
 	}else if (this.readyState == 4 && this.status == 500) {
 		console.log("erreur");
 	}
};

/**
*fonction pour recuperer l'action dans responseURL
*/
var getActionFromUrlResponse = function(str){
	str+="";
	str=str.split("http://tp-iwa.waxo.org/");
	str = str[1].split("?");
	str = str[0];
	return str;	
};
/**
fonction pour comparer
*/
function similar(a,b) {
    var lengthA = a.length;
    var lengthB = b.length;
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;    
    var maxLength = (a.length < b.length) ? b.length : a.length;    
    for(var i = 0; i < minLength; i++) {
        if(a[i] == b[i]) {
            equivalency++;
        }
    }
    var weight = equivalency / maxLength;
    return (weight * 100);
};

/**
utiliser pour sort le TOP3
*/
function compare(a,b) {
  if (a.thread.length < b.thread.length)
     return -1;
  if (a.thread.length > b.thread.length)
    return 1;
  return 0;
}
/**
récupération de la date en un bon format lisible
*/
 date_d_m_y_h_m = function(d){
 	d = parseInt(d);
	d = new Date(d);
  	var month = (d.getMonth() < 10) ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var day = (d.getDate() < 10) ? "0" + d.getDate() : d.getDate();
    var hour = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minute = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var second = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
    return day + "." + month + "." + d.getFullYear() + " at " + hour + ":" + minute + ":" + second;
};

delete_all_threads=function(tab){
	for(i in tab){
		index.delete_thread(tab[i])
	}
};

