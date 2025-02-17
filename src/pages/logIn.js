import { headerContainer } from "./header.js";
import { footerContainer } from "./footer.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";

export const login = () => {

    history.pushState(null, 'login', '/login');

    let divLogin = document.createElement("div");
    divLogin.setAttribute("class", "divLogin");

    //DIV PARA HEADER Y MAIN
    let divHeader_main = document.createElement("div");
    divHeader_main.setAttribute("class", "divHeader_main");
    divLogin.appendChild(divHeader_main);

    //Trayendo header
    divHeader_main.appendChild(headerContainer());

    //Creación de main
    let divMain = document.createElement("main");
    divHeader_main.appendChild(divMain);

    //FORM
    let formLogIn = document.createElement("form");
    formLogIn.setAttribute("class", "register");
    divMain.appendChild(formLogIn);

    //input email
    let eMail = document.createElement("input");
    eMail.setAttribute("type", "email");
    eMail.setAttribute("placeholder", "ejemplo@correo.com");
    eMail.setAttribute("id", "eMail");
    eMail.setAttribute("class", "input");
    eMail.setAttribute("required", "");
    formLogIn.appendChild(eMail);
    //mesaje error email
    let emailError = document.createElement("span");
    emailError.setAttribute("class", "errorcorreo");
    formLogIn.appendChild(emailError);

    //input password
    let passwordIn = document.createElement("input");
    passwordIn.setAttribute("type", "password");
    passwordIn.setAttribute("placeholder", "contraseña");
    passwordIn.setAttribute("id", "passwordIn");
    passwordIn.setAttribute("class", "input");
    passwordIn.setAttribute("required", "");
    formLogIn.appendChild(passwordIn);
    //mensaje error password
    let passwordError = document.createElement("span");
    passwordError.setAttribute("class", "errorcontrasena");
    formLogIn.appendChild(passwordError);

    const openEye = document.createElement('img');
    openEye.setAttribute("class", "openEye");
    openEye.setAttribute("src", "SCL019-social-network/src/images/openeye.png");
    formLogIn.appendChild(openEye);
    
    const showPassword = (e) => {
        e.preventDefault();
        const p1 = document.getElementById('passwordIn');
        if (p1.type === 'password') {
          p1.type = 'text';
        } else {
          p1.type = 'password';
        }
      };
    
    openEye.addEventListener('click', showPassword);




    //botón iniciar sesión
    let buttonSend = document.createElement("input");
    buttonSend.setAttribute("type", "submit");
    buttonSend.setAttribute("value", "Iniciar Sesión");
    buttonSend.setAttribute("class", "buttonsubmit");
    formLogIn.appendChild(buttonSend);

    //SECCIÓN GOOGLE
    let sectionEnterWithGoogle = document.createElement("div");
    sectionEnterWithGoogle.setAttribute("class", "optionEnterWithGoogle");
    divMain.appendChild(sectionEnterWithGoogle);

    let optionGoogle = document.createElement("p");
    optionGoogle.setAttribute("class", "orGoogle");
    optionGoogle.textContent = "o"
    sectionEnterWithGoogle.appendChild(optionGoogle);

    //botón google
    let buttonGoogle = document.createElement("button");
    buttonGoogle.setAttribute("class", "buttonGoogle");
    buttonGoogle.setAttribute("id", "buttonGoogle");
    //logo google
    let logoGoogle = document.createElement("img");
    logoGoogle.setAttribute("class", "logoGoogle");
    logoGoogle.setAttribute("src", "SCL019-social-network/src/images/logogoogle.png");
    logoGoogle.setAttribute("alt", "logo Google");
    buttonGoogle.appendChild(logoGoogle);
    //texto botón 
    let labelBtnGoogle = document.createElement("p");
    labelBtnGoogle.textContent = "Continuar con Google";
    buttonGoogle.appendChild(labelBtnGoogle);

    sectionEnterWithGoogle.appendChild(buttonGoogle);

    //SECCIÓN NO USER
    let divUnregistered = document.createElement("div");
    divUnregistered.setAttribute("class", "unregisteredText_Link");
    divMain.appendChild(divUnregistered);

    let unregisteredUser = document.createElement("p");
    unregisteredUser.textContent = "¿No tienes una cuenta? ";
    divUnregistered.appendChild(unregisteredUser);

    //link register
    let linkRegister = document.createElement("a");
    linkRegister.setAttribute("class", "logIn_linkRegister");
    linkRegister.setAttribute("href", "#register"); 
    linkRegister.textContent = "Regístrate";
    divUnregistered.appendChild(linkRegister);

    //FOOTER
    divLogin.appendChild(footerContainer());

    //Función iniciar sesión
    formLogIn.addEventListener("submit", (send) => {
        send.preventDefault();
        let valueEmail = eMail.value;
        let valuePassword = passwordIn.value;

        const auth = getAuth();
        signInWithEmailAndPassword(auth, valueEmail, valuePassword)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                sessionStorage.setItem('userId', user.uid); //se añaden elementos a nuestro objeto sessionStorage
                if (user.emailVerified) {
                    window.location.hash = '#home';
                } else {
                    window.location.hash = '#login';
                    alert('usuario no verificado');
                }
            })

            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);

                let emailMessage = document.querySelector(".errorcorreo");
                let passwordMessage = document.querySelector(".errorcontrasena");

                if (errorCode == 'auth/user-not-found') {
                    emailMessage.innerHTML = "<p>Ingresa un correo electrónico</p>";
                }

                if (errorCode == 'auth/wrong-password') {
                    passwordMessage.innerHTML = "<p>Contraseña incorrecta</p>";
                }
            });
    })

    //Autentificación con google
    buttonGoogle.addEventListener("click", (loginGoogle) => {
        loginGoogle.preventDefault();
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log("inicio sesion google")
                console.log(token);
                // The signed-in user info.
                const user = result.user;
                sessionStorage.setItem('userId', user.uid);
                console.log(user);
                window.location.hash = "#home";
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                console.log("errores google")
                console.log(errorCode)
                const errorMessage = error.message;
                console.log(errorMessage)
                // The email of the user's account used.
                const email = error.email;
                console.log(email)
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(credential)
            });


    })
    return divLogin;
}