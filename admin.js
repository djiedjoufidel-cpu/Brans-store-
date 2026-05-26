const db = firebase.firestore();

const storage = firebase.storage();

// AUTH
firebase.auth().onAuthStateChanged(user=>{

if(!user){

window.location.href =
"login.html";

return;

}

loadDashboard();

});

// LOAD DASHBOARD
function loadDashboard(){

loadProducts();

loadOrders();

loadAnalytics();

}

// PRODUCTS
function loadProducts(){

db.collection("products")
.onSnapshot(snapshot=>{

document.getElementById(
"totalProducts"
).innerText =
snapshot.size;

const container =
document.getElementById(
"adminProducts"
);

container.innerHTML = "";

snapshot.forEach(doc=>{

const p = doc.data();

container.innerHTML += `

<div class="product-card">

<img src="${p.image}" />

<div class="product-info">

<h3>${p.name}</h3>

<p>${p.price} FCFA</p>

<p>📦 ${p.stock}</p>

<p>🏷️ ${p.category || "Autre"}</p>

${
p.promo
? `<span class="promo">PROMO</span>`
: ""
}

<button
onclick="deleteProduct('${doc.id}')"
>
Supprimer
</button>

</div>

</div>

`;

});

});

}

// ORDERS
function loadOrders(){

db.collection("orders")
.onSnapshot(snapshot=>{

document.getElementById(
"totalOrders"
).innerText =
snapshot.size;

const container =
document.getElementById(
"ordersList"
);

container.innerHTML = "";

let revenue = 0;

snapshot.forEach(doc=>{

const o = doc.data();

revenue += o.total || 0;

container.innerHTML += `

<div class="order-card">

<h3>
🧾 Commande
</h3>

<p>
💰 ${o.total} FCFA
</p>

<p>
📅 ${o.date}
</p>

<button
onclick='viewItems(${JSON.stringify(o.items)})'
>
Voir produits
</button>

</div>

`;

});

document.getElementById(
"totalRevenue"
).innerText =
revenue + " FCFA";

showNotification(
"Nouvelle mise à jour commandes"
);

});

}

// ANALYTICS
function loadAnalytics(){

db.collection("orders")
.get()
.then(snapshot=>{

let labels = [];
let totals = [];

snapshot.forEach(doc=>{

const o = doc.data();

labels.push(o.date);

totals.push(o.total);

});

const ctx =
document.getElementById(
"salesChart"
);

new Chart(ctx, {

type: "line",

data: {

labels,

datasets: [{

label: "Revenus",

data: totals,

borderWidth: 3

}]

}

});

});

}

// NOTIFICATION
function showNotification(text){

if(Notification.permission
=== "granted"){

new Notification(text);

}

}

// ASK NOTIFICATION
Notification.requestPermission();

// ADD PRODUCT
async function addProduct(){

const name =
document.getElementById("name")
.value;

const price =
document.getElementById("price")
.value;

const stock =
document.getElementById("stock")
.value;

const category =
document.getElementById("category")
.value;

const promo =
document.getElementById("promo")
.checked;

const imageFile =
document.getElementById("image")
.files[0];

if(!imageFile){

alert("Choisir image");

return;

}

const storageRef =
storage.ref(
"products/" +
Date.now() +
imageFile.name
);

await storageRef.put(imageFile);

const imageUrl =
await storageRef.getDownloadURL();

db.collection("products")
.add({

name,
price: Number(price),
stock: Number(stock),
category,
promo,
image: imageUrl,
whatsapp: "237651715307",
createdAt: Date.now()

});

alert("Produit ajouté");

}

// DELETE
function deleteProduct(id){

db.collection("products")
.doc(id)
.delete();

}

// VIEW ORDER ITEMS
function viewItems(items){

let text = "";

items.forEach(i=>{

text +=
`${i.name} x${i.qty}\n`;

});

alert(text);

}