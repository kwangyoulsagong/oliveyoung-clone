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
const simillarCont=document.querySelector();
const rnd=getRandomNumber(1, 30);
console.log("보낼 랜덤숫자:", rnd);
fetch("/simillar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rnd: rnd }), // index 번호를 JSON 형식으로 전송
    })
      .then((response) => response.json())
      .then((data) => {
        // 서버로부터의 응답 처리
        console.log("서버 응답:", data);
        createSimillarProductElement(data); // 제품 요소 생성 및 스타일 적용 함수 호출
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
      function createSimillarProductElement(productData) {
  const SimillarDiv = document.createElement("div");
  SimillarDiv.classList.add("SimillarProduct");



  // Product 스타일을 적용하는 클래스 추가
  const productnameSpan = document.createElement("div");
  productnameSpan.textContent = ` ${productData.productname}`;
  productnameSpan.classList.add("productname-style"); // .product-style 클래스 추가
  SimillarDiv.appendChild(productSpan);

  // Price 스타일을 적용하는 클래스 추가
  const priceSpan = document.createElement("div");
  priceSpan.textContent = ` ${productData.price}`;
  priceSpan.classList.add("price-style"); // .price-style 클래스 추가
  SimillarDiv.appendChild(priceSpan);

  // Saled Price 스타일을 적용하는 클래스 추가
  const saledPriceSpan = document.createElement("div");
  saledPriceSpan.textContent = ` ${productData.saleprice}`;
  saledPriceSpan.classList.add("saledprice-style"); // .saledprice-style 클래스 추가
  SimillarDiv.appendChild(saledPriceSpan);

  // 이미지 스타일을 적용하는 클래스 추가
  const img = document.createElement("img");
  img.src = productData.image_url;
  img.classList.add("img-style"); // .img-style 클래스 추가
  SimillarDiv.appendChild(img);

  // 제품 컨테이너에 추가하기
  simillarCont.innerHTML = ""; // 기존에 있던 제품 요소들 초기화
  simillarCont.appendChild(SimillarDiv);
}