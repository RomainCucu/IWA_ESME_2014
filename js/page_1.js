var index = {}; // objet contenant l'appel aux webservices
var data = {}; // obj contenant les données à transmettre à la methode GET
var obj_traitement={}; // obj contenant les fonctions de traitement de données deçu dans la callback

data.id_log = "?id_log=serie_1_groupe_3"; // Pour afficher notre nom dans les logs
data.arguments_=""; // Par default : aucun arguments


index.start=function(){
	//setInterval(index.new_thread,1);
	index.get_threads();
	index.btn_search_threads();
	index.btn_new_thread();
	//index.new_thread("hello");
	//index.show_thread("1417020259481");
	//index.reply_to_thread("1416997123900","kouo");
	//index.delete_thread("1416997123900");
};

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



index.btn_search_threads = function(){
	document.getElementById("submit_recherche_threads").onsubmit = function(event) {
		event.preventDefault();//à laisser
		var input_user_search_thread = document.getElementById("input_search_thread").value;
		if(("1417020259481".toLowerCase().indexOf(input_user_search_thread.toLowerCase())> -1) || similar("1417020259481".toLowerCase(),input_user_search_thread.toLowerCase())> 50){
				alert("Find !");
		}
		//index.replace_content_by_animation_GIF_loader("btn_register_");//pour remplacer le bouton par un chargement
	}
};

index.btn_new_thread=function(){
	document.getElementById("send_thread").onclick = function(event) {
		console.log("biatch");
		//event.preventDefault();
		var text_new_thread=document.getElementById("inputText").value;
		var author_new_thread=document.getElementById("inputAuthor").value;
		if(text_new_thread!=""){
			if(author_new_thread!= ""){
				index.new_thread(text_new_thread, author_new_thread);
			} else index.new_thread(text_new_thread, "invité");
		}
	}
};




// Methode get

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
			
			console.log("weshhhhhh");
			index.get_threads();
		}else if(getActionFromUrlResponse(this.responseURL) == "reply_to_thread"){
			console.log(r);
		}else if(getActionFromUrlResponse(this.responseURL) == "delete_thread"){
			console.log(r);
		}			
 	}else if (this.readyState == 4 && this.status == 500) {
 		console.log("erreur");
 	}
};

window.onload = function(){
	//setInterval(index.start,1000);
	setTimeout(index.start,100);

	// pour afficher le chargement
	/*$('#myModal').modal({
		show:true
	});*/
}



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
	document.getElementById("all_threads").innerHTML="<li class=\"sidebar-brand\" style=\"color:white\">Tous les Sujets <span class=\"glyphicon glyphicon-pushpin\" aria-hidden=\"true\"></span></li>";

	data.reverse().forEach(function callback_display_threads(element, index, array){
		document.getElementById("all_threads").innerHTML+="<li><a target='_blank' href='./html/show_thread.html?id="+element+"&page_number=1&messages_par_page=5'>"+element+"</a></li>";
	});
};

obj_traitement.calcul_top_rated_threads=function(data){
	data.forEach(function callback_display_threads(element, indexe, array){
		index.show_thread(element);
	});
};


var notToConsider = 0;
var notToConsider2 = 0;
// les threads arrivent un par un
obj_traitement.calcul2_top_rated_threads=function(data){
	console.log("$$$$$$$$$$$$$$$$$$$$");
	console.log(data.id);
	console.log("$$$$$$$$$$$$$$$$$$$$");
	//tabNombreMessParThread.push([data.id, data.thread.length]);
	//console.log(tabNombreMessParThread);
	//tabNombreMessParThread.forEach(function callback_display_threads(element, indexe, array){
	//});
	//montab.push([data.id, data.thread]);
	var nbr_actuel=document.getElementById("number_of_messages").innerText;
	var nbr_actuel2=document.getElementById("number_of_messages2").innerText;
	var nbr_actuel3=document.getElementById("number_of_messages3").innerText;
	console.log(typeof(nbr_actuel));
	console.log(typeof(parseInt(nbr_actuel)));
	console.log("mlmlml : " + notToConsider);
	//console.log(nbr_actuel);
	//console.log(typeof(nbr_actuel));
	if(data.thread.length>nbr_actuel){
		console.log("good top");
		obj_traitement.display_top_rated_threads(1, [data.id, data.thread.length]);
		notToConsider = data.id;
	}

	if((data.thread.length>nbr_actuel2) && (data.id !=notToConsider)){
		obj_traitement.display_top_rated_threads(2, [data.id, data.thread.length]);
		notToConsider2 = data.id;
		console.log(notToConsider2);
	}

	if((data.thread.length>nbr_actuel3) && (data.id !=notToConsider2)){
		notToConsider2
		console.log(data.id);
		console.log("AAAAAAAAAAAAAAAA")
		obj_traitement.display_top_rated_threads(3, [data.id, data.thread.length]);
	}
};


obj_traitement.display_top_rated_threads=function(nbr, data){
	console.log(data);
	console.log(data[0]);
	//document.getElementById("caroussel1").innerHTML="";																								
	//document.getElementById("caroussel1").innerHTML="popopo";
	if(nbr==1){
		document.getElementById("carousselGlobal1").innerHTML="";
		document.getElementById("carousselGlobal1").innerHTML="<a target='_blank' href='./html/show_thread.html?id="+data[0]+"&page_number=1&messages_par_page=5'><img src=\"images/lion.jpg\" alt=\"\" style=\"height:50%; width:100%;\"><div class=\"carousel-caption\"><h1>"+data[0]+"</h1><h2>First top rated</h2><p id=\"caroussel1\"><span id=\"number_of_messages\">"+data[1]+"</span> Messages</p></div></a>";
	} else if(nbr==2){
		document.getElementById("carousselGlobal2").innerHTML="";
		document.getElementById("carousselGlobal2").innerHTML="<a target='_blank' href='./html/show_thread.html?id="+data[0]+"&page_number=1&messages_par_page=5'><img src=\"images/lion.jpg\" alt=\"\" style=\"height:50%; width:100%;\"><div class=\"carousel-caption\"><h1>"+data[0]+"</h1><h2>Second top rated</h2><p id=\"caroussel2\"><span id=\"number_of_messages2\">"+data[1]+"</span> Messages</p></div></a>";
	} else if(nbr==3){
		document.getElementById("carousselGlobal3").innerHTML="";
		document.getElementById("carousselGlobal3").innerHTML="<a target='_blank' href='./html/show_thread.html?id="+data[0]+"&page_number=1&messages_par_page=5'><img src=\"images/lion.jpg\" alt=\"\" style=\"height:50%; width:100%;\"><div class=\"carousel-caption\"><h1>"+data[0]+"</h1><h2>Second top rated</h2><p id=\"caroussel3\"><span id=\"number_of_messages3\">"+data[1]+"</span> Messages</p></div></a>";
	}
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

/*

if((results[i].pseudo.toLowerCase().indexOf(search_name.toLowerCase())> -1) || similar(results[i].pseudo.toLowerCase(),search_name.toLowerCase())> 50)//pour voir si la chaine est contenu dans un pseudo
								{
									infos.liste_user_found.push(results[i].pseudo);
								}
*/

