var index = {}; // objet contenant l'appel aux webservices
var data = {}; // obj contenant les données à transmettre à la methode GET
var obj_traitement={}; // obj contenant les fonctions de traitement de données deçu dans la callback
var contenuHTML={}; // obj utilisé pour contenir le contenu de nos éléments html pour l'affichage du gif chargement

data.id_log = "?id_log=serie_1_groupe_3"; // Pour afficher notre nom dans les logs
data.arguments_=""; // Par default : aucun arguments

top3array = new Array();


window.onload = function(){	
	setTimeout(index.start,100);
	snow.init(50);
}

index.start=function(){
	//setInterval(index.new_thread,1);
	//document.addEventListener('click', index.onclick_function);
	index.get_threads();
	index.btn_search_threads();
	index.btn_new_thread();
	//index.btn_delete_thread();
	//index.new_thread("hello");
	//index.show_thread("1417020259481");
	//index.reply_to_thread("1416997123900","kouo");
	//index.delete_thread("1416997123900");
};

index.btn_search_threads = function(){
	document.getElementById("submit_recherche_threads").onsubmit = function(event) {
		event.preventDefault();//à laisser
		var input_user_search_thread = document.getElementById("input_search_thread").value;
		if(("1417020259481".toLowerCase().indexOf(input_user_search_thread.toLowerCase())> -1) || similar("1417020259481".toLowerCase(),input_user_search_thread.toLowerCase())> 50){
				alert("Find !");
		}		
	}
};


index.btn_new_thread=function(){
	document.getElementById("send_thread").onclick = function(event) {		
		event.preventDefault();
		var text_new_thread=document.getElementById("inputText").value;
		var author_new_thread=document.getElementById("inputAuthor").value;
		if(text_new_thread!=""){
			document.getElementById("send_thread").disabled=true;//pour eviter d'appuyer plusieurs fois, estétique
			if(author_new_thread!= ""){				
				index.new_thread(text_new_thread, author_new_thread);
			} else index.new_thread(text_new_thread, "guest");
		}
	}
};

// Methode get


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
index.new_thread=function(info, author_message){
	info+="";
	data.action_="new_thread";
	data.arguments_="&info="+"[author]" + author_message + "[/author]" + info;
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

index.callback = function () {	
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);
		if(getActionFromUrlResponse(this.responseURL) == "get_threads"){
			//delete_all_threads(r.threads);
			obj_traitement.display_liste_threads(r.threads);
			obj_traitement.calcul_top_rated_threads(r.threads);
			setTimeout(function(){$('#myModal').modal('hide');},1000);
		}else if(getActionFromUrlResponse(this.responseURL) == "show_thread"){
			obj_traitement.calcul2_top_rated_threads(r);
		}else if(getActionFromUrlResponse(this.responseURL) == "new_thread"){
			window.location=("./page_1.html");
			//setTimeout(document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string, 1000);//pour remettre le bouton originel (car gif qui tourne)
			//setTimeout(function(){$('#modalAllThread').modal('hide');},1000);
		}else if(getActionFromUrlResponse(this.responseURL) == "delete_thread"){
			console.log(r);
			window.location=("./page_1.html");
			//index.get_threads();
			//setTimeout(function(){$('#myModal').modal('hide');},1000);
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

obj_traitement.display_liste_threads=function(data){
	document.getElementById("all_threads").innerHTML="";
	document.getElementById("all_threads").innerHTML="<li class=\"sidebar-brand\" style=\"color:white\">Tous les Sujets <span class=\"glyphicon glyphicon-pushpin\" aria-hidden=\"true\"></span></li><hr>";
	
	data.reverse().forEach(function callback_display_threads(element, index, array){
		var string="";
		string+="<li><a target='_blank' href='./html/show_thread.html?id="+element+"&page_number=1&messages_par_page=5'>"+date_d_m_y_h_m(element)+"<span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span></a>";
		string+="<a onclick='index.delete_thread("+element+")' id=\""+element+"\" class=\"delete_thread_"+element+"\"+ target='_blank' href='#' style=\"color:red\">Delete<span class=\"glyphicon glyphicon-remove delete_thread_"+element+"\"></span></a></li><li><hr></li>";
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


delete_all_threads=function(tab){
	for(i in tab){
		index.delete_thread(tab[i])
	}
};



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

function compare(a,b) {
  if (a.thread.length < b.thread.length)
     return -1;
  if (a.thread.length > b.thread.length)
    return 1;
  return 0;
}

 date_d_m_y_h_m = function(d){
d = parseInt(d);
d = new Date(d);
  var month = (d.getMonth() < 10) ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    var day = (d.getDate() < 10) ? "0" + d.getMonth() : d.getMonth();
    var hour = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minute = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var second = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();

    return d.getDate() + "." + month + "." + d.getFullYear() + " at " + hour + ":" + minute + ":" + second;};

