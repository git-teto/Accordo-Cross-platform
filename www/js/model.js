class Canale{
    constructor(ctitle,mine){
        this._ctitle=ctitle;
        this._mine=mine;
    };
    get ctitle(){
        return this._ctitle;
    }
    get mine(){
        return this._mine;
    }

    set ctitle(value){
        if(typeof value==='string' && value.length<21){
            this._ctitle=value;
            console.log("titole e': "+this._ctitle);
        }
        else{
            console.log("Errore Non hai messo una stringa! ")
        }
    }
    set mine(value){
        if(typeof value==='string'){
            this._ctitle=value;
            console.log("mine e': "+this._ctitle);
        }
        else{
            console.log("Errore Non hai messo una stringa! ")
        }
    }
    print(){
        console.log("canale: "+this._ctitle+" e' mio: "+this._mine);
    }
}

class Post{
    constructor(uid,name,pversion,pid,type,lat,long,content){
        this._uid=uid;
        this._name=name;
        this._pversion=pversion;
        this._pid=pid;
        this._type=type;
        this._lat=lat;
        this._long=long;
        this._content=content;
    };
    get uid(){
        return this._uid; 
    }
    get name(){
        return this._name;
     }
    get pversion(){
        return this._pversion;
    }
    get pid(){
        return this._pid;
     }
    get type(){
        return this._type;
    }
    get lat(){
        return this._lat;
    }
    get long(){
        return this._long;
    }
    get content(){
        return this._content;
    }

    set uid(value){
         this._uid=value; 
    }
    set name(value){
        this._name=value;
     }
    set pversion(value){
         this._pversion=value;
    }
    set pid(value){
        this._pid=value;
     }
    set type(value){
         this._type=value;
    }
    set lat(value){
         this._lat=value;
    }
    set long(value){
         this._long=value;
    }
    set content(value){
         this._content=value;
    }
}

class User{
    constructor(uid,name,picture,pversion){
        this._uid=uid;
        this._name=name;
        this._picture=picture;
        this._pversion=pversion;
    };
    get uid(){
        return this._uid;
    }
    get name(){
        return this._name;
    }
    get picture(){
        return this._picture;
    }
    get pversion(){
        return this._pversion;
    }

    set uid(value){
         this._uid=value;
    }
    set name(value){
        if(typeof value==='string'&&value.length<21){
            this._name=value;
            console.log("nome e': "+this._name);
        }
        else{
            console.log("Errore Non hai messo una stringa! o il noome è lungo ")
        }
    }
    set picture(value){
        if(typeof value==='string'){
            this._picture=value;
            console.log("nome e': "+this._name);
        }
        else{
            console.log("Errore Non hai messo una stringa! ")
        }
    }
    set pversion(value){
         this._pversion=value;
    }
}

class Model{
    constructor (){
        this._channels=[];
        this._posts=[];
        this._user;
        this._usersUid=[]; //contiene uid dei profili che hanno mandato dei post in una chat specifica
        this._userPictures=[];
    }

    addChannel(channel){
        this._channels.push(channel);
    }
    clearChannels(){
        this._channels=[];
    }

    addPost(post){
        this._posts.push(post);
    }
    clearPosts(){
        this._posts=[];
    }

    addUserUid(uid){
        this._usersUid.push(uid);
    }
    clearUserPost(){
        this._usersUid=[];
    }
    addUserPicture(userPicture){
        this._userPictures.push(userPicture)
    }

    get channels(){
        return this._channels;
    }
    set channels(value){
        this._channels=value;
    }

    get posts(){
        return this._posts;
    }
    set posts(value){
        this._posts=value;
    }

    get user(){
        return this._user;
    }
    set user(value){
        this._user=value;
    }

    get usersUid(){
        return this._usersUid;
    }
    set usersUid(value){
        this._usersUid=value;
    }

    get userPictures(){
        return this._userPictures;
    }
    set userPictures(value){
        this._userPictures=value;
    }

    searchCanale(nome){
        for(let i=0;i<this._channels.length;i++){
            if(this._channels[i].ctitle === nome){
                return this._channels[i];
            }
        }
        return undefined;
    }

    //ricerca per inizio del nome
    searchStartingWith(prefix) {
        let result = [];
        for(let i = 0; i<this._channels.length; i++){
            let canale = this._channels[i];
            if(canale.ctitle.toLowerCase().startsWith(prefix.toLowerCase())){
                result.push(canale);
            }
        }
        return result;
    }

    searchUtentebyUID(uid){
        for(let i=0;i<this._usersUid.length;i++){
            if(this._usersUid[i] === uid){
                return this._usersUid[i];
            }
        }
        return undefined;
    }

    isUtenteInModel(uid){
        for(let i=0;i<this._usersUid.length;i++){
            if(this._usersUid[i] === uid){
              // console.log("metodo model: "+this._usersUid[i]+" === "+uid);
                return true;
            }
        }
        return false;
    }

    isUserPictureInModel(uid){
        for(let i=0;i<this._userPictures.length;i++){
            if(this._userPictures[i].uid === uid){
            //   console.log("metodo model paragona user picture: "+this._userPictures[i].uid+" === "+uid);
                return true;
            }
        }
        return false;
    }

    uploadUserPicture(userPicture){
        for(let i=0;i<this._userPictures.length;i++){
            if(this._userPictures[i].uid === userPicture.uid && this._userPictures[i].pversion < userPicture.pversion){
             //  console.log("metodo model paragona user picture: "+this._userPictures[i].uid+" === "+userPicture.uid+" && "+this._userPictures[i].pversion+" < "+userPicture.pversion);
               // return true;
               this._userPictures[i].picture=userPicture.picture;
            }
        }
      //  console.log("metodo model paragona user picture: "+this._userPictures[i].uid+" === "+userPicture.uid+" && "+this._userPictures[i].pversion+" < "+userPicture.pversion);
      //  console.log("metodo uploaduserpicture non ha dato risultati");
    }

    searchUtentePicturebyUID(uid){
        for(let i=0;i<this._userPictures.length;i++){
            if(this._userPictures[i].uid === uid){
                return this._userPictures[i].picture;
            }
        }
        return undefined;
    }

    searchPostbyPID(pid){
       let pidTrovato;
        for(let i=0;i<this._posts.length;i++){
           pidTrovato=Number(this._posts[i].pid);
            console.log("pid salavto: "+typeof(Number(this._posts[i].pid))+" === "+typeof(pid));
            if(pidTrovato === pid){
               console.log(Number(this._posts[i].pid)+"  === "+pid);
                return this._posts[i];
            }
        }
        return undefined;
    }
}

/*let canale1=new Canale("canale1","t");
let canale2= new Canale("canale2","f");
let model= new Model();

model.addChannel(canale1);
model.addChannel(canale2);

let u=model.serachCanale("canale2");
console.log(u);

u=model.serachCanale("Canale2");
console.log(u);*/






