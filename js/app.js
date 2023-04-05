let navbar = document.querySelector("nav .navbar");
let menu = document.querySelector('.menu i');
menu.addEventListener("click", () => {
 navbar.classList.toggle('active');
});

//dropdown account
const dropdownBtn = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
dropdownBtn.addEventListener("click", () => {
  dropdownContent.classList.toggle('show');
  
  window.addEventListener('click', (content) => {
    if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown-content a')) {
      dropdownContent.classList.remove('show');
    }
  } );
} )


// sidebar
let slideIndex = 1;
            showSlide(slideIndex);

        function nextslide(n){
            showSlide(slideIndex += n);
        }

        function dotslide(n){
            showSlide(slideIndex = n);
        }

        function showSlide(n) {
            let i;
            let slides = document.getElementsByClassName("imgslide");
            let dot = document.getElementsByClassName("dot");
            
            if (n > slides.length) {
                slideIndex = 1;
            }
            if (n < 1) {
                slideIndex = slides.length;
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            for (i = 0; i < slides.length; i++) {
                dot[i].className = dot[i].className.replace(" active", "");
            }
            slides[slideIndex - 1].style.display = "block";

            dot[slideIndex - 1].className += " active";
        }
           setInterval(() => {
             showSlide(slideIndex + 1);
           },2000);
           
let cartItems = [];
        
// menampilkan list produk
const createListProduct = (product) => {
  return `
   <div class="produk">
     <div class="card-produk">
       <img src="img/katalog/${product.gambar}">
       <div class="card-body">
         <h5 class="card-title">${product.nama}</h5>
         <button class="show-text tampilText" onclick="toggleHiddenText(this)">Lebih banyak</button>
         <div class="hidden-text">
         <p class="card-text">${product.deskripsi}</p>
         </div>
         <h5 class="card-title">Rp.${product.harga}</h5>
         <a href="#" class="pesan" data-id="${product.id}" data-harga="${product.harga}">Pesan Sekarang</a>
        </div>
       </div>
     </div>
  `;
};

// mengambil data dari JSON
const fetchProduct = (kategori) => {
  fetch('data/produk.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("Gagal mengambil data produk.");
      }
      return response.json();
    })
    .then(responseData => {
      const data = responseData;
      let products;

      if (!kategori || kategori === "Product") {
        products = data.produk;
      } 
      else {
        products = data.produk.filter(product => product.kategori === kategori);
      }
    
      const tempatProduk = products.map(product => createListProduct(product));
      document.getElementById('katalog').innerHTML = tempatProduk.join('');
      
      
      const pesanSekarang = document.querySelectorAll(".pesan");
      pesanSekarang.forEach(pesan => {
        pesan.addEventListener("click", () => {
          const id = pesan.getAttribute('data-id');
    const harga = pesan.getAttribute('data-harga');
    const nama = pesan.parentNode.querySelector('.card-title').textContent;
    
    const item = {
      id: id,
      nama: nama,
      harga: harga,
      jumlah: 1
    };
    
    const itemSudahAda = cartItems.find(item => item.id === id);
    
    if (itemSudahAda) {
      itemSudahAda.jumlah++;
    } else {
      cartItems.push(item);
    }
    
    updateCart();
        });
      });
      
      const updateCart = () =>{
        const cartList = document.querySelector('#cart-items');
        let cartHTML = '';
        let totalHarga = cartItems.reduce((total, item) => total + (item.harga * item.jumlah), 0);
        
        console.log(totalHarga);
        
        cartItems.forEach(item => {
          const subTotal = item.harga * item.jumlah;
          totalHarga += subTotal;
          
          cartHTML += `
          <li>
             <span>${item.nama}</span>
             <span>${item.jumlah} x Rp.${item.harga}</span>
             <span>Rp.${subTotal}</span>
          `;
        });
        
        const checkoutBtn = document.querySelector(".cart-dropdown .btn");
        
        if (cartItems.length > 0) {
          cartList.innerHTML = cartHTML;
          checkoutBtn.style.display = 'block';
        } else {
          cartList.innerHTML = '<li> Keranjang Kosong</li>';
          checkoutBtn.style.display = 'none';
        }
        
        console.log(document.querySelector('.total'));
        
        document.querySelector('.cart .count').textContent = cartItems.length;
  document.querySelector('.cart .total').textContent = `Rp.${totalHarga}`;
      };
      
      
      const cartIcon = document.querySelector('.cart');

cartIcon.addEventListener('click', () => {
  const cartDropdown = document.querySelector('.cart-dropdown');
  cartDropdown.classList.toggle('active');
});


    })
    .catch(error => console.error(error));
};


// menampilkan produk berdasarkan kategori yang dipilih
const spaKategori = () => {
  const kategori = document.querySelector("section#kategori");
  
  const dataKategori = [
    {icon: "allproduct.png", name: "Product", href:"#"},
    {icon: "smartphone.png", name: "Ponsel", href:"#ponsel"},
    {icon: "coat.png", name: "Fashion", href:"#fashion"},
    {icon: "skincare.png", name: "Skincare", href:"#skincare"},
    {icon: "shoes.png", name: "Shoes", href:"#shoes"},
    {icon: "laptop.png", name: "Laptop", href:"#laptop"},
    {icon: "watch.png", name: "Watch", href:"#watch"},
  ];
  
  let products = [];
  let page = 1;
  const perPage = 6;
  
  const render = () => {
    kategori.innerHTML = `<div class="katalog">
    <h1>Kategori Produk</h1>
    </div>
    <div class="card-item">
    ${dataKategori
      .map((kategori) => `
       <div class="kartu">
        <ul>
         <li>
          <img src="img/icons/${kategori.icon}"/>
          </li>
          <li>
          <a href="${kategori.href}" class="kategori-link" onclick="fetchProduct('${kategori.name}')">${kategori.name}</a>
          </li>
        </ul>
      </div>
      `)
      .join("")}
    </div>
    <div id="katalog">
      <div class="produk-container">
        ${products.map((product) => createListProduct(product)).join("")}
      </div>
      <div class="load-more-container">
        <button class="load-more" onclick="loadMore()">Load More</button>
      </div>
    </div>`;
    
    // tampilkan semua produk pada awalnya
  
  };
  
  const loadMore = () => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const nextPage = products.slice(start, end);
    
    if (nextPage.length > 0) {
      const produkContainer = document.querySelector(".produk-container");
      produkContainer.innerHTML += nextPage.map((product) => createListProduct(product)).join("");
      page++;
    }
    
    const loadMoreButton = document.querySelector(".load-more");
    if (page > Math.ceil(products.length / perPage)) {
      loadMoreButton.style.display = "none";
    }
  };
  
  return () => {
    fetch('data/produk.json')
      .then(response => response.json())
      .then(responseData => {
        data = responseData;
        // jika kategori tidak diisi atau "#" maka tampilkan semua produk
        products = data.produk;
        render();
      })
      .catch(error => console.error(error));
  };
};

const spakate = spaKategori();
spakate();
fetchProduct();




// fungsi untuk menampilkan atau menyembunyikan teks tersembunyi
function toggleHiddenText(button) {
  const hiddenText = button.nextElementSibling;
  button.classList.toggle('active');
  if(button.classList.contains('active')) {
    button.textContent = "Lebih Sedikit";
  } else {
    button.textContent = "Lebih Banyak";
  }
  
  hiddenText.classList.toggle('show');
}