
const imglink=[
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/2707527842238214492.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/5997961015899981333.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/1291634454642887268.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/406045732778084191.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/6107563981408374423.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/1468249365262134863.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/5359945679013443695.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/1164404406030173346.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/5135699834869950920.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/2350373517421172364.jpg',
    'https://image.oliveyoung.co.kr/uploads/images/display/90000010001/1/8557066715352624867.jpg']
    const sliderDiv = document.querySelector('.slider');
    const slidercont= document.querySelector('.slider-cont')
    const leftBtn=document.querySelector('.leftbtn')
    const rightBtn=document.querySelector('.rightbtn')
    const pagenum=document.querySelector('.pagenum')
    
    var count=0;
    pagenum.innerHTML=`${count+1}/11`
    leftBtn.addEventListener('click',()=>{
        slidercont.scrollLeft+=window.innerWidth
        count++
        if(count==11){
            slidercont.scrollLeft=0
            count=0
        }
        pagenum.innerHTML=`${count+1}/11`
        
        
    })
    function moveToNextSlide() {
        slidercont.scrollLeft += window.innerWidth;
        count++;
        if (count === 11) {
          slidercont.scrollLeft = 0;
          count = 0;
        }
        pagenum.innerHTML = `${count + 1}/11`;
      }
      rightBtn.addEventListener('click',()=>{
        slidercont.scrollLeft-=window.innerWidth
        count--
        if(count<0){
            slidercont.scrollLeft=window.innerWidth*10
            count=10
        }
        pagenum.innerHTML=`${count+1}/11`
        
    })
    rightBtn.addEventListener('mouseover',()=>{
        rightBtn.style.scale="1.2"
    })
    rightBtn.addEventListener('mouseout',()=>{
        rightBtn.style.scale="1"
    })
    leftBtn.addEventListener('mouseover',()=>{
        leftBtn.style.scale="1.2"
    })
    leftBtn.addEventListener('mouseout',()=>{
        leftBtn.style.scale="1"
    })
    let slideInterval;
    function startSlideAuto() {
      
        slideInterval = setInterval( moveToNextSlide, 5000); // 5초마다 슬라이더 이동
      }
    startSlideAuto()
imglink.forEach((link) => {
  const imageElement = document.createElement('div');
  imageElement.style.backgroundImage = `url(${link})`;
  sliderDiv.appendChild(imageElement);
});
const liHover=document.querySelectorAll(".li-hover");
const liCont=document.querySelector(".li-hover-container")
for(let i=0; i<liHover.length; i++){
    liHover[i].addEventListener("mouseover",()=>{
        let index = i;
        liCont.style.visibility="visible"
        console.log("보낼 인덱스:", index);
        fetch("/sendIndex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index: index }), // index 번호를 JSON 형식으로 전송
    })
      .then((response) => response.json())
      .then((data) => {
        // 서버로부터의 응답 처리
        console.log("서버 응답:", data);
        createProductElement(data); // 제품 요소 생성 및 스타일 적용 함수 호출
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  });

  liHover[i].addEventListener("mouseleave", () => {
    liCont.innerHTML = ""; // 기존에 있던 제품 요소들 초기화
    liCont.style.visibility="hidden"
  });
  function createProductElement(productData) {
  const productDiv = document.createElement("div");
  productDiv.classList.add("product");

  // Company 스타일을 적용하는 클래스 추가
  const companySpan = document.createElement("div");
  companySpan.textContent = `${productData.company}`;
  companySpan.classList.add("company-style"); // .company-style 클래스 추가
  productDiv.appendChild(companySpan);

  // Product 스타일을 적용하는 클래스 추가
  const productSpan = document.createElement("div");
  productSpan.textContent = ` ${productData.product}`;
  productSpan.classList.add("product-style"); // .product-style 클래스 추가
  productDiv.appendChild(productSpan);

  // Price 스타일을 적용하는 클래스 추가
  const priceSpan = document.createElement("div");
  priceSpan.textContent = ` ${productData.price}`;
  priceSpan.classList.add("price-style"); // .price-style 클래스 추가
  productDiv.appendChild(priceSpan);

  // Saled Price 스타일을 적용하는 클래스 추가
  const saledPriceSpan = document.createElement("div");
  saledPriceSpan.textContent = ` ${productData.saledprice}`;
  saledPriceSpan.classList.add("saledprice-style"); // .saledprice-style 클래스 추가
  productDiv.appendChild(saledPriceSpan);

  // 이미지 스타일을 적용하는 클래스 추가
  const img = document.createElement("img");
  img.src = productData.image_url;
  img.classList.add("img-style"); // .img-style 클래스 추가
  productDiv.appendChild(img);

  // 제품 컨테이너에 추가하기
  liCont.innerHTML = ""; // 기존에 있던 제품 요소들 초기화
  liCont.appendChild(productDiv);
}
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const simillarCont=document.querySelector(".simillar-container");
const simillarCont2=document.querySelector(".simillar-container2")
const rnd=getRandomNumber(1, 30);
console.log("보낼 랜덤숫자:", rnd);
// Make a POST request to "/similar" endpoint
fetch("/simillar", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ rnd: rnd }), // Assuming rnd is defined somewhere before this code
})
  .then((response) => response.json())
  .then((data) => {
    // Server response handling
    console.log("서버 응답:", data);
    displaySimilarProducts(data); // Function to display similar products
  })
  .catch((error) => {
    console.error("에러 발생:", error);
  });

function displaySimilarProducts(productData) {
  // Create a container for each product
  const createProductElement = (product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("similar-product");

    // Add product name
    const productNameSpan = document.createElement("div");
    productNameSpan.textContent = ` ${product.productname}`;
    productNameSpan.classList.add("productname-style");
    productDiv.appendChild(productNameSpan);

    // Add price
    const priceSpan = document.createElement("div");
    priceSpan.textContent = ` ${product.price}`;
    priceSpan.classList.add("simillarprice-style");
    productDiv.appendChild(priceSpan);

    // Add sale price
    const saledPriceSpan = document.createElement("div");
    saledPriceSpan.textContent = ` ${product.saleprice}`;
    saledPriceSpan.classList.add("saleprice-style");
    productDiv.appendChild(saledPriceSpan);

    // Add image
    const img = document.createElement("img");
    img.src = product.image_url;
    img.classList.add("simillarimg-style");
    productDiv.appendChild(img);

    const saleSpan = document.createElement("div");
    saleSpan.textContent = ` ${product.sale}`;
    saleSpan.classList.add("sale-style");
    productDiv.appendChild(saleSpan);

    const giftSpan = document.createElement("div");
    giftSpan.textContent = ` ${product.gift}`;
    giftSpan.classList.add("gift-style");
    productDiv.appendChild(giftSpan);

    const todaySpan = document.createElement("div");
    todaySpan.textContent = ` ${product.today}`;
    todaySpan.classList.add("today-style");
    productDiv.appendChild(todaySpan);

    return productDiv;
  };

  // Clear the previous product elements
  simillarCont.innerHTML = "";
  simillarCont2.innerHTML = "";

  // Check if the first product data is available and create its container
  if (productData.rnd) {
    const productDiv1 = createProductElement(productData.rnd);
    simillarCont.appendChild(productDiv1);
  }

  // Check if the second product data is available and create its container
  if (productData.rnd2) {
    const productDiv2 = createProductElement(productData.rnd2);
    simillarCont2.appendChild(productDiv2);
  }

}
// Function to generate HTML for a single item
// Function to generate HTML for a single item
function generateItemHTML(item) {
  return `
  <div class="popular-item">
  <img class="popular-img" src="${item.image_url}" alt="">
  <div class="popular-company">${item.company}</div>
  <div class="popular-product-name">${item.product}</div>
  <div class="popular-price-container">
    <div class="popular-price">${item.price}</div>
    <div class="popular-saledprice">${item.saledprice}</div>
  </div>
  <div class="popular-event"> 
    <div class="popular-sale">${item.sale}</div>
    <div class="popular-gift">${item.gift}</div>
    <div class="popular-today">${item.today}</div>
  </div>
</div>`;
}

axios.get(`http://localhost:3000/popular1`).then((res) => {
  const container1 = document.querySelectorAll('.popular-product-container1');
  const container2 = document.querySelectorAll('.popular-product-container2');

  for (let i = 0; i < res.data.length; i += 4) {
    const item1 = res.data[i];
    const item2 = i + 1 < res.data.length ? res.data[i + 1] : null;
    const item3 = i + 2 < res.data.length ? res.data[i + 2] : null;
    const item4 = i + 3 < res.data.length ? res.data[i + 3] : null;

    const container1Index = Math.floor(i / 4);
    const container2Index = Math.floor(i / 4);

    if (item1) {
      container1[container1Index].innerHTML += generateItemHTML(item1);
    }

    if (item2) {
      container1[container1Index].innerHTML += generateItemHTML(item2);
    }

    if (item3) {
      container2[container2Index].innerHTML += generateItemHTML(item3);
    }

    if (item4) {
      container2[container2Index].innerHTML += generateItemHTML(item4);
    }
  }
});


