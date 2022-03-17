import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { headerContainer } from "./header.js";
import { getFirestore, collection, addDoc, Timestamp, doc, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDBC5o7sgTl7cbHM5DF4pjLP5Wx2H-S8RA",
  authDomain: "social-network-cjv.firebaseapp.com",
  projectId: "social-network-cjv",
  storageBucket: "social-network-cjv.appspot.com",
  messagingSenderId: "55216807698",
  appId: "1:55216807698:web:9cef62683040f7b8afddcb"
};

initializeApp(firebaseConfig);

const db = getFirestore();
console.log(db);
const auth = getAuth();

 /* ******** VISTA HOME ******* */

export const home = () => {

  history.pushState(null, 'home', '#home');
  
  let divHome = document.createElement("div");
  divHome.setAttribute("id", "home");


   // ****** BOTON LOG OUT **********
  let buttonLogOut = document.createElement("button");
  buttonLogOut.setAttribute("class", "buttonLogOut");
  buttonLogOut.setAttribute("id", "buttonLogOut");
  buttonLogOut.textContent = "salir";
  divHome.appendChild(buttonLogOut);



  // ************ WALL ****************

  let divWall = document.createElement("div"); 
  divWall.setAttribute("class","wall");
  divHome.appendChild(divWall);

  let formHome = document.createElement("form");
  formHome.setAttribute("class", "post");
  divWall.appendChild(formHome);

  let userIcon = document.createElement("img");
  userIcon.setAttribute("class", "userIcon");
  userIcon.setAttribute("src", "./images/own-user-icon.svg");
  userIcon.setAttribute("alt", "icono de usuario");
  userIcon.setAttribute("width", "25px");
  formHome.appendChild(userIcon);

  let postArea = document.createElement("textarea");
  postArea.setAttribute("class", "areapost");
  postArea.setAttribute("placeholder", "¿Cómo están tus plantas hoy?");
  formHome.appendChild(postArea);

  let buttonSubmit = document.createElement("button");
  buttonSubmit.textContent="Publicar";
  buttonSubmit.setAttribute("class", "buttonSubmit");
  divWall.appendChild(buttonSubmit);

  let postContainer = document.createElement("div");
  postContainer.setAttribute("id", "postContainer");
  postContainer.setAttribute("class", "postContainer");
  divWall.appendChild(postContainer);


    // FUNCION PARA CREAR POST CON NOMBRE DE USUARIO 
  const createPost = async ( db, text ) => {
    
  let userName;
  if (auth.currentUser.displayName == null) {
     let separateEmail = auth.currentUser.email.split('@');
      userName = separateEmail[0];
  } else {
     userName = auth.currentUser.displayName;
  }  
  const docRef = await addDoc(collection(db, "post"), {
    uid: auth.currentUser.uid,
    name: userName,
    text,
    datepost: Timestamp.fromDate(new Date()),
    });
    console.log("Document written with ID: ", docRef.id)
  };
 

  // FUNCION PARA MOSTRAR POST CON NOMBRE DE USUARIO
  const showPost =  async (db, documento ) => {
    const postAll = query(collection(db, "post"), orderBy("datepost", "desc"));
    const querySnapshot = await getDocs(postAll);
    const sectionPost = document.getElementById('postContainer');
    sectionPost.innerHTML = '';
    querySnapshot.forEach((documento) => {
      console.log(documento.id, '=>', documento.data().name);

    //creamos los componentes que contendrán cada nueva publicación
      const divPost = document.createElement('div');
      divPost.classList.add('divPost');
      let userIcon = document.createElement("img");
      userIcon.setAttribute("class", "iconPost");
      userIcon.setAttribute("src", "./images/own-user-icon.svg");
      userIcon.setAttribute("alt", "icono de usuario");
      userIcon.setAttribute("width", "25px");
      divPost.appendChild(userIcon);

      const pUser = document.createElement("p");
      pUser.setAttribute("class", "pUser");
      const pPost = document.createElement("p");
      pPost.setAttribute("class", "pPost");

      pUser.innerHTML = documento.data().name;
      pPost.innerHTML = documento.data().text;
      
      divPost.appendChild(pUser);
      divPost.appendChild(pPost);
      sectionPost.appendChild(divPost);
      divWall.appendChild(sectionPost);

    })
  }


  //funciones de llamada a los botones 
  buttonSubmit.addEventListener("click", (post) => {
    post.preventDefault();
    let valuePost = postArea.value;
    createPost(db, valuePost);
    showPost(db, valuePost);
    formHome.reset();

  })

  buttonLogOut.addEventListener("click", () => {
    const auth = getAuth();

    signOut(auth) 
     .then(() => {
      console.log("el usuario salió");
      sessionStorage.clear();
      window.location.hash = "#login";
      })
     .catch((error) => {
      console.log(error.message);
      });

})



// ********* MENU ********

let divMenu = document.createElement("div");
  divMenu.setAttribute("class", "menu");
  divHome.appendChild(divMenu);

  let homeIcon = document.createElement("img");
  homeIcon.setAttribute("class", "menuIcon");
  homeIcon.setAttribute("src", "./images/home-icon.svg");
  homeIcon.setAttribute("alt", "icono home");
  divMenu.appendChild(homeIcon);

  let exchangeIcon = document.createElement("img");
  exchangeIcon.setAttribute("class", "menuIcon");
  exchangeIcon.setAttribute("src", "./images/plant-exchange-icon.svg");
  exchangeIcon.setAttribute("alt", "icono intercambio de plantas");
  divMenu.appendChild(exchangeIcon);

  let searchIcon = document.createElement("img");
  searchIcon.setAttribute("class", "menuIcon");
  searchIcon.setAttribute("src", "./images/search-icon.svg");
  searchIcon.setAttribute("alt", "icono home");
  divMenu.appendChild(searchIcon);
  
  let perfilIcon = document.createElement("img");
  perfilIcon.setAttribute("class", "menuIcon");
  perfilIcon.setAttribute("src", "./images/user-icon.svg");
  perfilIcon.setAttribute("alt", "icono perfil");
  divMenu.appendChild(perfilIcon);

return divHome;

}