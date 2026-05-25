function login(){

const email =
document.getElementById("email")
.value;

const password =
document.getElementById("password")
.value;

firebase.auth()
.signInWithEmailAndPassword(
email,
password
)
.then(()=>{

window.location.href =
"admin.html";

})
.catch(()=>{

alert("Erreur login");

});

}