const db = firebase.firestore();

let products = [];
let cart = [];
let discount = 0;
let wishlist = [];

// LOAD PRODUCTS
function loadProducts(){

db.collection("products")
.onSnapshot(snapshot=>{

products = [];

snapshot.forEach(doc=>{

products.push({
id: doc.id,
...doc.data()
});

});

renderProducts(products);

});

}

function renderProducts(products){

const productsContainer =
document.getElementById("products");

productsContainer.innerHTML = "";

products.forEach(p=>{

productsContainer.innerHTML += `
<div class="product-card">

<img src="${p.image}" class="product-image">

<h3>${p.name}</h3>

<p>${p.price} FCFA</p>

<p>Stock : ${p.stock}</p>

<button onclick="addToCart('${p.id}')">
🛒 Ajouter
</button>

<button onclick="addWishlist('${p.name}')">
❤️ Favoris
</button>

<div class="reviews">

⭐⭐⭐⭐☆

<p>Très bon produit</p>

</div>

</div>
`;

});

}

loadProducts();

// RENDER
function renderProducts(data){

const container =
document.getElementById("products");

container.innerHTML = "";

data.forEach(p=>{

container.innerHTML += `

<div class="product-card">

<img src="${p.image}" />

<div class="product-info">

<h3>${p.name}</h3>

<p class="price">
${p.price} FCFA
</p>

<p>
📦 Stock : ${p.stock}
</p>

${
p.promo
? `<span class="promo">PROMO</span>`
: ""
}

<input
type="number"
id="q-${p.id}"
value="1"
min="1"
/>

<button
onclick="addToCart(
'${p.id}',
'${p.name}',
${p.price},
'${p.whatsapp}'
)"
>
Ajouter au panier
</button>

</div>

</div>

`;

});

}

// SEARCH
function searchProducts(){

const value =
document.getElementById("search")
.value
.toLowerCase();

const filtered =
products.filter(p=>
p.name.toLowerCase().includes(value)
);

renderProducts(filtered);

}

// ADD TO CART
function addToCart(
id,
name,
price,
whatsapp
){

const qty =
Number(
document.getElementById(
"q-"+id
).value
);

cart.push({
id,
name,
price,
qty,
whatsapp
});

renderCart();

}

// RENDER CART
function renderCart(){

const container =
document.getElementById("cart");

container.innerHTML = "";

let total = 0;

cart.forEach((item,index)=>{

total += item.price * item.qty;

container.innerHTML += `

<div class="cart-item">

<div>

<strong>
${item.name}
</strong>

<p>
${item.qty} x ${item.price} FCFA
</p>

</div>

<button
onclick="removeCart(${index})"
>
❌
</button>

</div>

`;

});

total =
total - (total * discount / 100);

document.getElementById("total")
.innerText =
"Total : " + total + " FCFA";

}

// REMOVE
function removeCart(index){

cart.splice(index,1);

renderCart();

}

// COUPON
function applyCoupon(){

const code =
document.getElementById("coupon")
.value;

if(code === "BRANS10"){

discount = 10;

alert("Coupon appliqué");

}else{

alert("Coupon invalide");

}

renderCart();

}

// WHATSAPP
async function sendWhatsApp(){

if(cart.length === 0){

alert("Panier vide");

return;

}

const number =
cart[0].whatsapp;

let total = 0;

let msg =
"🛍️ BRANS-STORE\n\n";

cart.forEach(item=>{

total += item.price * item.qty;

msg +=
`• ${item.name}\n`;

msg +=
`Quantité : ${item.qty}\n`;

msg +=
`Prix : ${item.price} FCFA\n\n`;

});

// SAVE ORDER
await db.collection("orders")
.add({

items: cart,

total,

date:
new Date()
.toLocaleString()

});

// PDF
generatePDF(total);

// ADMIN WHATSAPP
const adminMsg =
`Nouvelle commande BRANS-STORE\nTotal : ${total} FCFA`;

const adminUrl =
`https://wa.me/${number}?text=${encodeURIComponent(adminMsg)}`;

window.open(adminUrl,"_blank");

// CLIENT WHATSAPP
const clientUrl =
`https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

setTimeout(()=>{

window.open(clientUrl,"_blank");

},1000);

cart = [];

renderCart();

function generatePDF(total){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(22);

doc.text(
"BRANS-STORE FACTURE",
20,
20
);

let y = 40;

cart.forEach(item=>{

doc.text(
`${item.name} x${item.qty}`,
20,
y
);

doc.text(
`${item.price} FCFA`,
140,
y
);

y += 10;

});

doc.setFontSize(18);

doc.text(
`TOTAL : ${total} FCFA`,
20,
y + 20
);

doc.save("facture-brans-store.pdf");

}