
document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('resume',onResume, false);
document.addEventListener('pause',onPause, false);

var canaleScelto;
var model= new Model();
//var indiceDelCanale;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    console.log("Sid avvio: "+localStorage.getItem("StorageSid"));
  //  document.getElementById('deviceready').classList.add('ready');
    checkSid();
    downloadWall();
}

function onResume() {
    // Cordova is now initialized. Have fun!
   // alert("Avvio");
    console.log('Resume cordova-' + cordova.platformId + '@' + cordova.version);
   // document.getElementById('deviceready').classList.add('ready');
}
function onPause() {
    // Cordova is now initialized. Have fun!
    //alert("Avvio");
    console.log('Pause cordova-' + cordova.platformId + '@' + cordova.version);
    //document.getElementById('deviceready').classList.add('ready');
}

function checkSid(){
	if(typeof localStorage.getItem("StorageSid") == "undefined" || localStorage.getItem("StorageSid") == null ){
		downloadSid();			
	}
	else{
		
		console.log("Sid in memoria: "+localStorage.getItem("StorageSid"));
	}
	//createDB();
}
function downloadSid(){
	console.log("chiediamo il sid");
	$.ajax({
		method:'post',
		url:"https://ewserver.di.unimi.it/mobicomp/accordo/register.php",
		success: function(result) {
			console.log(result);
			let resultJson = JSON.parse(result);
			let s=resultJson.sid;
			console.log("Sid ricevuto"+s);
			localStorage.setItem("StorageSid", s);
			downloadWall();
			//downloadProfile();
		},
		error: function(error) {
			console.log('Si è verificato un errore');
		}
	});
}

function downloadWall(){
	console.log("download channels");
	let s=localStorage.getItem("StorageSid");
  // elimina elementi
  $('.list-group-item').remove();

	console.log("Sid wall: "+window.localStorage.getItem("StorageSid"));
	$.ajax({
		method:'post',
		url:"https://ewserver.di.unimi.it/mobicomp/accordo/getWall.php",
		data:JSON.stringify({sid:s}),
		dataType: 'json',
		success:function(result){
			//Model.getInstance().clearWall();
			console.log("Wall ricevuto");	
		//	console.log(result);
			/*let ch= [];
			for(let i=0;i<result.channels.length;i++){
				ch.push(new Channel(result.channels[i].ctitle,result.channels[i].mine));
			}
			//mostro i canali
			Model.getInstance().addWall(ch);
			mostraWall();*/
            let canaliArray=result.channels;
            model.clearChannels();
            for(let i=0;i<canaliArray.length;i++){
              //  console.log(canaliArray[i]);
                let title=""+canaliArray[i].ctitle;
             //   console.log("tipo del titolo "+typeof(title));
                let mine=canaliArray[i].mine;
                let canaleEstratto=new Canale(title,mine);
                model.addChannel(canaleEstratto);
                
            
                if(mine=="t"){
                    $("#listaCanali").append("<li  onclick=\"vaiACanale("+i+")\" style=\"text-align:center; background-color: #e6d705;\" class=\"list-group-item\">"+canaleEstratto.ctitle+"</li>");        
                }
                else{
                    $("#listaCanali").append("<li  onclick=\"vaiACanale("+i+")\" style=\"text-align:center;\" class=\"list-group-item\">"+canaleEstratto.ctitle+"</li>");
                }
                
            }
			
		},
		error: function(error) {
        console.log('Si è verificato un errore');
      }
    });
}

$(function() {
    console.log("document ready");
    bindEvents();
    });
     
    //funzioni che si azionano al click di pulsanti
    function bindEvents() {
    $("#wallBottone").click(nextPageButtonClickWallBottone);
    $("#profiloBottone").click(nextPageButtonClickProfiloBottone);
    $("#homeBottone").click(BackHomeClick);
    $("#homeBottoneProfilo").click(BackHomeClick);
   // $("#canaleBottone").click(vaiACanale);
    $("#creaCanaleBottone").click(vaiACreaCanale);
    $("#TornaScriviBottone").click(nextPageButtonClickWallBottone);
    $("#TornaScriviBottone2").click(nextPageButtonClickWallBottone);
    $("#tornaAProfilo").click(nextPageButtonClickProfiloBottone);
    $("#tornaAProfilo2").click(nextPageButtonClickProfiloBottone);
    $("#cambiaNomeBottone").click(vaiACambiaNome);
    $("#cambiaImmagineBottone").click(vaiACambiaImmagine);
   
   // $("#vaiaScriviText").click(vaiAScrivitext($("#nomeCanale").val()));
   $("#vaiaScriviText").click(vaiAScrivitext);
    $("#vaiAInviaImmagine").click(vaiaInviaImmagine);
    $("#vaiAInviaPosizione").click(vaiAInviaPosizione);
    $("#vaiAImmagineSchermoIntero").click(vaiAImmagineSchermoIntero);
  //  $("#vaiAPosizioneSuMappa").click(vaiAPosizionesuMappa);

   // $("#tornaaCanaleDaScriviText").click(vaiACanale(indiceDelCanale));
  // $("#tornaaCanaleDaScriviText").click(tornaACanale(indiceDelCanale));
    $("#tornaaCanaleDaScriviText").click(tornaACanale);
    $("#tornaCanaledaInviaImmagine").click(tornaACanale);
    $("#tornaCanaleDaPosizione").click(tornaACanale);
    $("#tornaCanaleDaImmagineIntera").click(tornaACanale);
    $("#tornaCanaleDaMappa").click(tornaACanale);

    $("#invioNuovoNome").click(InviaNuovoNome);
    $("#inviaMessaggio").click(InviaNuovoMessaggio);
    $("#inviaNomeCanale").click(InviaNuovoCanale);

    $("#bottoneCambiaImmagine").click(openFilePicker);
    $("#bottoneCambiaImmagine2").click(openFilePicker2);

    $("#InviaImmagineBottone").click(inviaImmagineAlServer); //
    $("#InviaImmagineProfiloBottone").click(inviaImmagineProfilo);
    }

    function nextPageButtonClickWallBottone() {
    console.log("wallBottone button pressed");
    downloadWall();
    showPage(".scrivi");
    }

    function nextPageButtonClickProfiloBottone() {
        console.log("profiloBottone button pressed");
        scaricaProfilo();
        $("#InviaImmagineProfiloBottone").hide();
        showPage(".profilo");
        }

    function BackHomeClick() {
    console.log("home button pressed");
    showPage(".home");
    }
   
    function vaiACanale(indice){
        localStorage.setItem("indiceCanale", indice);
        let nomecanale=model.channels[indice].ctitle;
       let u=model.searchCanale(nomecanale)
        console.log("indice: "+indice+" canale: "+u.ctitle);
       // $('.list-group-item').remove();
        downloadPostCanale(u.ctitle);
       $("#nomeCanale").html(u.ctitle); 
       showPage(".canale");      
    }

    function tornaACanale(){
       console.log("clicco su torna canale!");
      // showPage(".scrivi");*/
       indice=localStorage.getItem("indiceCanale");
       let nomecanale=model.channels[indice].ctitle;
       $('.list-group-item').remove();
       downloadPostCanale(nomecanale);
       $("#nomeCanale").html(nomecanale);
       showPage(".canale"); 
    }

    function vaiACreaCanale(){
        console.log("CanaleBottone button pressed");
        showPage(".CreaCanale");
    }

    function vaiACambiaNome(){
        showPage(".CambiaNome");
    }
    function vaiACambiaImmagine(){
        showPage(".CambiaImmagine");
    }

    function vaiAScrivitext(){
        showPage(".scriviText");
    }


    function vaiaInviaImmagine(){
        $("#InviaImmagineBottone").hide();
        showPage(".InviaImmagine");
    }
    function vaiAInviaPosizione(){
        ottieniPosizione();

        showPage(".InviaPosizione");
    }
    function vaiAImmagineSchermoIntero(pid){
        console.log("il pid del post e': "+pid);
        scaricaImmaginePost(pid);
        showPage(".ImmagineSchermoIntero");
    }
   
    function vaiAPosizionesuMappa(pid){
       console.log("pid: "+pid);
       let postTrovato=model.searchPostbyPID(pid);
       console.log("lat: "+postTrovato.lat+" lon: "+postTrovato.lon);
      // console.log("lat: "+postTrovato.lat+" lon: "+postTrovato.lon);
        loadMap(postTrovato.lon,postTrovato.lat);
        showPage(".PosizioneMappa");
    }
    

    function showPage(cssClass) {
    $(".page").hide();
    $(cssClass).show();
    }


    function downloadPostCanale(titolo){
        console.log("download post");
	let s=localStorage.getItem("StorageSid");
	console.log("Sid wall: "+window.localStorage.getItem("StorageSid"));
	$.ajax({
		method:'post',
		url:"https://ewserver.di.unimi.it/mobicomp/accordo/getChannel.php",
		data:JSON.stringify({sid:s,ctitle:titolo}),
		dataType: 'json',
		success:function(result){
			console.log("post  ricevuti");	
		//	console.log(result);
            let postArray=result.posts;
            model.clearPosts();
            model.clearUserPost();
            $("#listaPost").html("");
            for(let i=0;i<postArray.length;i++){
                let post=postArray[i];
             //   console.log(post);
                model.addPost(post);
                if(model.isUtenteInModel(post.uid)){
                    console.log("utente nel set "+post.uid);
                }
                else{
                    console.log("utente non nel set "+post.uid);
                    model.addUserUid(post.uid);
                }
               // creaCella(post);
              // let postScaricato=new Post(post.uid,post.name,post.pversion,post.pid,post.type);
            }
            downloadUserPicture();	
            // sleep(10);
           // creaCanale();
		},
		error: function(error) {
        console.log('Si è verificato un errore');
      }
    });
    }


    function downloadUserPicture(){
        console.log("download userPicture");
        let s=localStorage.getItem("StorageSid");
        console.log("Sid : "+window.localStorage.getItem("StorageSid"));
        console.log("lunghezza model : "+model.usersUid.length);
        for(let i=0;i<model.usersUid.length;i++){
           let Uid=model.usersUid[i];
           console.log("uid da usare per immagine: "+Uid)
            $.ajax({
                method:'post',
                url:"https://ewserver.di.unimi.it/mobicomp/accordo/getUserPicture.php",
                data:JSON.stringify({sid:s,uid:Uid}),
                dataType: 'json',
                success:function(result){
                    console.log("immagine utente ricevuta "+result);	
                    //console.log(result);
                    if(model.isUserPictureInModel(result.uid)){
                        console.log("immagine utente è già presente nel model");
                        model.uploadUserPicture(result)
                    }
                    else{
                        console.log("immagine utente non presente nel model");
                        model.addUserPicture(result);
                    }
                    if(i==model.usersUid.length-1){
                      // sleep(3);
                        console.log('adesso parte crea canale dal onsucces i=='+i); 
                        creaCanale();
                       }
                },
                error: function(error) {
                console.log('Si è verificato un errore');
                console.error(error);
              }
            });
        }
      
    }

    function creaCanale(){
        for(let i=0;i<model.posts.length;i++){
           // console.log('creo cella: '+i);
            creaCella(model.posts[i]);
        }
    }


   //src=\"data:image/png;base64,"+immagine+"\"
    function creaCella(post){
        let cella;
        let immagine=model.searchUtentePicturebyUID(post.uid);
        //console.log("crea cella: immagini di "+post.uid+" "+immagine);
         if(immagine==null||immagine==undefined){
            // console.log("immagini di "+post.uid+" scassata!"+immagine);
             cella="<li class=\"list-group-item\" ><img src=\"img/userFoto.png\" style=\"width: 80px; height:80px; max-width: 100%; margin: auto; margin-bottom: 20px;  border: #ffffff 5px solid; \">" ;
            }
        else{
          //  console.log("immagine: "+immagine);
          cella="<li class=\"list-group-item\" ><img src=\"data:image/png;base64,"+immagine+"\" style=\"width: 80px;height:80px; max-width: 100%; margin: auto; margin-bottom: 20px;  border: #ffffff 5px solid; \">" ;

        }
        //console.log("immagine: "+immagine);
       // cella="<li class=\"list-group-item\" ><img src=\"https://placebear.com/500/500\" style=\"width: 80px; max-width: 100%; margin: auto; margin-bottom: 20px;  border: #ffffff 5px solid; \">" ;
        switch(post.type){
            case 'i':
              //  console.log("immagine");
                if(post.name==null){
                cella=cella+"<div  onclick=\"vaiAImmagineSchermoIntero("+post.pid+")\" style=\"display:inline;margin:10px\"><strong>Anonimo</strong><div style=\"margin:10px\"><span id=\"descrizioneInvio\">ha inviato un immagine</span></div></div></li>";

                }
                else{
                    cella=cella+"<div onclick=\"vaiAImmagineSchermoIntero("+post.pid+")\"   style=\"display:inline;margin:10px\"><strong>"+post.name+"</strong><div style=\"margin:10px\"><span id=\"descrizioneInvio\">ha inviato un immagine</span></div></div></li>";
                }
                break;
            case 't':
             //   console.log("testo");
             if(post.name==null){
                cella=cella+"<div style=\"display:inline;margin:10px\"><strong>Anonimo</strong><div style=\"margin:10px\"><span id=\"descrizioneInvio\">"+post.content+"</span></div></div></li>";

                }
                else{
                    cella=cella+"<div style=\"display:inline;margin:10px\"><strong>"+post.name+"</strong><div style=\"margin:10px\"><span id=\"descrizioneInvio\">"+post.content+"</span></div></div></li>";
                }
                
                break;
            case 'l':
             //   console.log("posizione");
               //onclick=\"loadMap("+post.lon,post.lat+")\"
             //  vaiAPosizionesuMappa()
             
             if(post.name==null){
                    cella=cella+"<div onclick=\"vaiAPosizionesuMappa("+post.pid+")\" style=\"display:inline;margin:10px\"><strong>Anonimo</strong><div style=\"margin:10px\"><span id=\"descrizioneInvio\">ha inviato la sua posizione</span></div></div></li>";
                    }
                    else{
                        cella=cella+"<div onclick=\"vaiAPosizionesuMappa("+post.pid+")\" style=\"display:inline;margin:10px\"><strong>"+post.name+"</strong><div style=\"margin:10px\"><span id=\"descrizioneInvio\">ha inviato la sua posizione</span></div></div></li>";
                    }
                break;
        }
        $("#listaPost").append(cella);

    }

    function scaricaProfilo(){ //
        console.log("scarica profilo");
        let s=localStorage.getItem("StorageSid");
        console.log("Sid per profilo: "+window.localStorage.getItem("StorageSid"));
        $.ajax({
            method:'post',
            url:"https://ewserver.di.unimi.it/mobicomp/accordo/getProfile.php",
            data:JSON.stringify({sid:s}),
            dataType: 'json',
            success:function(result){
                console.log(" profilo ricevuto");	
                console.log(result);
                let mioProfilo=new User(result.uid,result.name,result.picture,result.pversion);
                model.user=mioProfilo;
                console.log("Profilo: "+model.user.uid);
                if(model.user.name==null){
                    $("#userName").html("Anonimo");
                }
                else{
                    $("#userName").html(model.user.name);
                } 	
                if(model.user.picture===null){ }
                else{
                    let picture=aggiustaImmagine(model.user.picture);
                    $("#profilePic1").attr("src", "data:image/png;base64,"+picture);
                } 
            },
            error: function(error) {
            console.log('Si è verificato un errore');
          }
        });
    }

    function InviaNuovoNome(){
        let nome = $("#userName2").val();
        console.log("Il nome inserito e': "+nome);
        if(nome.length>20){
            console.log("Nome è troppo lungo");   
        }
        else{
            console.log("Nome è giusto!");
            inviaAlServer(nome);
        }
    }

    function inviaAlServer(nome){
        console.log("invio nome al server: "+nome);
        let s=localStorage.getItem("StorageSid");
        console.log("Sid per profilo: "+window.localStorage.getItem("StorageSid"));
        $.ajax({
            method:'post',
            url:"https://ewserver.di.unimi.it/mobicomp/accordo/setProfile.php",
            data:JSON.stringify({sid:s,name:nome}),
            dataType: 'json',
            success:function(result){
                console.log(" nome cambiato");
                $("#userName2").val("Nome Cambiato");		
            },
            error: function(error) {
            console.log('Si è verificato un errore');
            console.error(error);
            $("#userName2").val("Prova un altro nome!");
          }
        });
    }

    function InviaNuovoMessaggio(){
        let messaggio = $("#testoDaInviare").val();
        console.log("Il testo da inviare e'': "+messaggio);
        if(messaggio.length>100){
            $("#testoDaInviare").val("");
            $("#testoDaInviare").attr('placeholder','Messaggio troppo lungo!');
        }
        else{
            inviaMessaggioAlServer(messaggio);
            $("#testoDaInviare").val("");
            $("#testoDaInviare").attr('placeholder','Messaggio inviato!');
        }
        
    }
    function inviaMessaggioAlServer(messaggio){
        let indiceCanale=localStorage.getItem("indiceCanale");
        let nomecanale=model.channels[indiceCanale].ctitle;
        let s=localStorage.getItem("StorageSid");

        console.log(" invio: "+messaggio+" sul canale: "+nomecanale);

        $.ajax({
            method:'post',
            url:"https://ewserver.di.unimi.it/mobicomp/accordo/addPost.php",
            data:JSON.stringify({sid:s,ctitle:nomecanale,type:"t",content:messaggio}),
            dataType: 'json',
            success:function(result){
                console.log(" messaggio Inviato!");
                $("#testoDaInviare").val("");
                $("#testoDaInviare").attr('placeholder',' Messaggio inviato!');	
            },
            error: function(error) {
            console.log('Si è verificato un errore');
            console.error(error);
            $("#testoDaInviare").val("");
            $("#testoDaInviare").attr('placeholder','  Errore, riprova');
          }
        });
    }

    function InviaNuovoCanale(){
        let nomeCanale = $("#nomeNuovoCanale").val();
        console.log("Il nuovo canale e': "+nomeCanale);
        if(nomeCanale.length>20){
            $("#nomeNuovoCanale").val("");
            $("#nomeNuovoCanale").attr('placeholder','Nome canale troppo lungo! max 20 caratteri');
        }
        else{
            inviaCanaleAlServer(nomeCanale);
            $("#nomeNuovoCanale").val("");
            $("#nomeNuovoCanale").attr('placeholder',' Canale creato!');
        }
    }

    function inviaCanaleAlServer(nomeCanale){
        let s=localStorage.getItem("StorageSid");

        console.log("nome nuovo canale: "+nomeCanale);

        $.ajax({
            method:'post',
            url:"https://ewserver.di.unimi.it/mobicomp/accordo/addChannel.php",
            data:JSON.stringify({sid:s,ctitle:nomeCanale}),
            dataType: 'json',
            success:function(result){
                console.log(" canale creato");	
            },
            error: function(error) {
            console.log('Si è verificato un errore');
            console.error(error);
          }
        });
    }

    function scaricaImmaginePost(pidPost){
        let s=localStorage.getItem("StorageSid");

        console.log("scarico immagine col pid: "+pidPost);

        $.ajax({
            method:'post',
            url:"https://ewserver.di.unimi.it/mobicomp/accordo/getPostImage.php",
            data:JSON.stringify({sid:s,pid:pidPost}),
            dataType: 'json',
            success:function(result){
                console.log(" Immagine ricevuta");	
               let  content=aggiustaImmagine(result.content);
                $("#imageBase64SchermoIntero").attr("src", "data:image/png;base64,"+content);
            },
            error: function(error) {
            console.log('Si è verificato un errore');
            console.error(error);
          }
        });
    }

    function sleep(s){
        var now = new Date().getTime();
        while(new Date().getTime() < now + (s*1000)){ /* non faccio niente */ } 
      }


    function loadMap(lon,lat){
        console.log("Carico la mappa!");
        mapboxgl.accessToken = 'pk.eyJ1IjoidGV0b2N1b3p6bzk4IiwiYSI6ImNraWRidzVlejA4MHEycnJ3MGY4cXl6Z2IifQ.Z-OIZvSkKUYjWTEiwhjR1g';
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [lon, lat], // starting position  [lng, lat]
            zoom: 9 // starting zoom
            });

           /* var el =document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage =‘imageURL’;
            el.style.width ='50px';
            el.style.height ='50px';*/

         //gestore venti di tocco
            /*  el.addEventListener('click', function() {
                window.alert(marker.properties.message);
                }); */

            new mapboxgl.Marker().setLngLat([lon, lat]).addTo(map);
    }

    function aggiustaImmagine(content){
        let array=content.split("\"");
       // console.log("immagine senza slah: "+typeof(array));
      let c="";
        for(let a of array){
            c=c+a;
        }
      //  console.log("immagine senza slah: "+c+" "+typeof(c));
      return c;
    }


    //posizione 
    var options = { enableHighAccuracy: true };
    
 //navigator.geolocation.watchPosition(success, fail)
 //richiama la funzione “success” ogni volta che la posizione cambia
  
 function ottieniPosizione(){
    if (navigator.geolocation) {
        console.log("geolocation e' supportato");
        //eseguendo la riga successiva richiede i permessi
        navigator.geolocation.getCurrentPosition(success, fail);
        }
        else{
            console.log('Geolocation is not supported');
        }
        
   }
        function success(position) {
            let latitudine=position.coords.latitude;
            let longitudine=position.coords.longitude;
        console.log("La posizione corrente e': " + position.coords.latitude + ";"+position.coords.longitude);
        inviaPosizioneAlServer(latitudine,longitudine);
        }
        function fail(error) {
        console.log("C'e' stato un errore");
        console.error(error);
        }

        function inviaPosizioneAlServer(latitudine,longitudine){
            let indiceCanale=localStorage.getItem("indiceCanale");
            let nomecanale=model.channels[indiceCanale].ctitle;
            let s=localStorage.getItem("StorageSid");

        console.log(" invio: "+latitudine+" e "+longitudine+" sul canale: "+nomecanale);

        $.ajax({
            method:'post',
            url:"https://ewserver.di.unimi.it/mobicomp/accordo/addPost.php",
            data:JSON.stringify({sid:s,ctitle:nomecanale,type:"l",lat:latitudine,lon:longitudine}),
            dataType: 'json',
            success:function(result){
                console.log(" messaggio Inviato!");
                $("#rispostaInvioPos").html("Posizione inviata!");
               // $("#rispostaInvioPos").attr('placeholder',' Posizione inviata!');	
            },
            error: function(error) {
            console.log('Si è verificato un errore');
            console.error(error);
            $("#rispostaInvioPos").html("Errore, riprova");
           // $("#rispostaInvioPos").attr('placeholder','  Errore, riprova');
          }
        });
        }


        //Parte di codice presa direttamente dalla documentazione: guardate come si comporta il browser e come il simulatore...

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        //Usate FILE_URI al posto di FILE_URL per evitare molti problemi di gestione della memoria.
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

//profilo
function openFilePicker() {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        // Do something
        console.log("Immagine caricata: "+imageUri);
        $("#InviaImmagineProfiloBottone").show();
        if (imageUri.substr(0, 5) == 'file:') {
            //in android imageURI contiene il path
            $("#immaggineDaGalleria").attr("src", imageUri);
        }else {
            //su browser restituisce l'immagine in base64
            $("#immaggineDaGalleria").attr("src", "data:image/jpeg;base64, " + imageUri);
        }
        // impostImmagineProfilo(imageUri);
        localStorage.setItem("imageUriProfilo", imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

//canale
function openFilePicker2() {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        // Do something
        console.log("Immagine caricata: "+imageUri);
        $("#InviaImmagineBottone").show();
        if (imageUri.substr(0, 5) == 'file:') {
            //in android imageURI contiene il path
            $("#immaggineDaGalleria2").attr("src", imageUri);
        }else {
            //su browser restituisce l'immagine in base64
            $("#immaggineDaGalleria2").attr("src", "data:image/jpeg;base64, " + imageUri);
        }
        localStorage.setItem("imageUri", imageUri);
       
      // $("#InviaImmagineBottone").click(inviaImmagineAlServer(imageUri));

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function inviaImmagineAlServer(){
    let imageUri=localStorage.getItem("imageUri");
    let indiceCanale=localStorage.getItem("indiceCanale");
        let nomecanale=model.channels[indiceCanale].ctitle;
        let s=localStorage.getItem("StorageSid");

        console.log(" invio: "+imageUri+" sul canale: "+nomecanale);

        $.ajax({
            method:'post',
            url:"https://ewserver.di.unimi.it/mobicomp/accordo/addPost.php",
            data:JSON.stringify({sid:s,ctitle:nomecanale,type:"i",content:imageUri}),
            dataType: 'json',
            success:function(result){
                console.log(" immagine Inviata!");
                $("#risultatoInvioImmagine").html("Immagine inviata!");
               // $("#risultatoInvioImmagine").attr('placeholder',' Immagine inviata!');	
            },
            error: function(error) {
            console.log('Si è verificato un errore');
            console.error(error);
            $("#risultatoInvioImmagine").html("Errore, riprova");
           // $("risultatoInvioImmagine#").attr('placeholder','  Errore, riprova');
          }
        });
}

function inviaImmagineProfilo(){
    let imageUri=localStorage.getItem("imageUriProfilo");
        let s=localStorage.getItem("StorageSid");

        console.log(" invio: "+imageUri);

        $.ajax({
            method:'post',
            url:"https://ewserver.di.unimi.it/mobicomp/accordo/setProfile.php",
            data:JSON.stringify({sid:s,picture:imageUri}),
            dataType: 'json',
            success:function(result){
                console.log(" immagine profilo Inviata!");
                $("#risultatoInvioImmagineProfilo").html("Immagine inviata!");
               // $("#risultatoInvioImmagine").attr('placeholder',' Immagine inviata!');	
            },
            error: function(error) {
            console.log('Si è verificato un errore');
            console.error(error);
            $("#risultatoInvioImmagineProfilo").html("Errore, riprova");
           // $("risultatoInvioImmagine#").attr('placeholder','  Errore, riprova');
          }
        });
}


//codice db
/*
function onDeviceReady() {
console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
document.getElementById('deviceready').classList.add('ready');
db = window.sqlitePlugin.openDatabase({
name: 'my.db',
location: 'default',
});

let queries = [
'CREATE TABLE IF NOT EXISTS DemoTable (name, score)',
[ 'INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101] ],
[ 'INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202] ],
];
db.sqlBatch(queries, insertionSuccess, insertionError);


//da qualche parte nel codice
let query = 'SELECT count(*) AS mycount FROM DemoTable';
db.executeSql(query, [], selectSuccess, selectError);
function selectSuccess(rs) {
console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
}
function selectError(error) {
console.log('SELECT SQL statement ERROR: ' + error.message);
}
*/


    
    