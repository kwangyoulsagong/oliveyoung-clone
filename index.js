const express    = require('express');
const mysql      = require('mysql');
const session = require('express-session');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
var cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyparser=require('body-parser');
const { render } = require('pug');



const app = express();

app.set('view engine', 'ejs');  

app.use(cors());
app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
 
  res.sendFile(__dirname + "/index.html");
});
app.get("/login", (req, res) => {
 
  res.sendFile(__dirname + "/login.html");
});
app.get("/register", (req, res) => {
 
  res.sendFile(__dirname + "/register.html");
});

app.get("/mypage:id", (req, res) => {
 
  res.sendFile(__dirname + "/mypage.html");
});
app.get("/update", (req, res) => {
 
  res.sendFile(__dirname + "/update.html");
});


// configuration =========================
app.set('port', process.env.PORT || 3000);
app.post("/sendIndex", (req, res) => {
  const index = req.body.index;
  console.log("받은 인덱스:", index); // 받은 인덱스가 제대로 출력되는지 확인
  connection.query('select * from MyListTable where id like ?',[index],(error,results)=>{
    console.log(results[0].company)
    if (results.length > 0) {
      // DB에서 가져온 결과가 있으면 해당 값을 클라이언트로 응답합니다.
      const data = results[0];
      res.json({
        company: data.company,
        product: data.product,
        price: data.price,
        saledprice: data.saledprice,
        image_url: data.image_url,
      });
    } else {
      // DB에서 가져온 결과가 없으면 null을 클라이언트로 응답합니다.
      res.json({ receivedIndex: null });
    }
  })

  // 예시로 index를 그대로 클라이언트로 응답합니다.
  
});


app.get('/users', (req, res) => {
  connection.query('SELECT * from customer', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

app.post('/search', (req, res) => {
  const search = req.body.search;
  const searchTerm = '%' + search + '%'; 

  const query = 'SELECT * FROM cosmetics WHERE productname LIKE ? OR company LIKE ? OR type LIKE ?';
  connection.query(query, [searchTerm, searchTerm, searchTerm], (error, results) => {
    if (error) throw error;

    const resultArray1 = [];
    const resultArray2 = [];
    const resultArray3 = [];
    const resultArray4 = [];
    const resultArray5 = [];
    const resultArray6=[];


    for (let i = 0; i < results.length; i++) {
      const arr1 = results[i].company;
      resultArray1.push(arr1);

      const arr2 = results[i].type;
      resultArray2.push(arr2);

      const arr3 = results[i].productname;
      resultArray3.push(arr3);

      const arr4 = results[i].price;
      resultArray4.push(arr4);

      const arr5 = results[i].saleprice;
      resultArray5.push(arr5);
      const arr6=results[i].image_url;
      resultArray6.push(arr6)

    }

    res.render('search', {
      resultArray1,
      resultArray2,
      resultArray3,
      resultArray4,
      resultArray5,
      resultArray6
    });
  });
});


app.post('/login',(req,res)=>{
  const id= req.body.id
  const pw=req.body.pw

  connection.query('SELECT * from customer where id=?',[id], (error, data) => {
    if (error) throw error;
    if(data.length>0 && pw==data[0].passward){
      req.session.userId = id; 
      app.get(`/user:id`, (req, res) => {
        const userId = req.session.userId; 
    
        if (userId ) {
          res.sendFile(__dirname + "/user.html");
        } else {
          res.redirect('/login');
        }
      })

     app.route(`/customer`).get((req,res)=>{
      const id = req.session.userId;
      connection.query('SELECT * from customer where id=?',[id], (error, data)=>{
        const arr=[data[0].name, data[0].id]
      res.send(arr)
      })
      
      
     })
     connection.query('SELECT COUNT(*) AS count FROM mypage WHERE id = ?', [id], (err, result) => {
      if (err) throw err;

      if (result[0].count === 0) {
          connection.query('INSERT INTO mypage (id) VALUES (?)', [id], (err, result) => {
              if (err) throw err;
              
          });
      } else {
          
      }
      app.get('/change', (req, res) => {
        const id = req.session.userId;
        connection.query('SELECT * from mypage where id=?', [id], (error, data) => {
            if (error) throw error;
            res.json([data[0].id, data[0].type1, data[0].type2, data[0].type3]);
        });
       
    });
    
    app.post('/update', (req, res) => {
      const skin1 = req.body.skin_type1;
      const skin2 = req.body.skin_type2;
      const skin3 = req.body.skin_type3;
      const id = req.session.userId;
      connection.query('UPDATE mypage SET type1=?, type2=?, type3=? WHERE id=?', [skin1, skin2, skin3, id], (error, data) => {
          if (error) throw error;
    
          connection.query('SELECT * FROM mypage WHERE id=?', [id], (error, data) => {
              if (error) throw error;
              
              res.send(`
                  <script type="text/javascript">
                      alert("수정되었습니다.");
                      window.location.href = "/mypage:${id}";
                  </script>
              `);
          });
      });
    });
    
    app.get('/mypage', (req, res) => {
      const id = req.session.userId;
        connection.query('SELECT * from mypage where id=?', [id], (error, data) => {
            if (error) throw error;
            res.json(data[0]);
            
        });
    });
    app.post('/delete', (req, res) => {
      const id = req.session.userId;
      connection.query('DELETE FROM mycart WHERE id=?', [id], (error, data) => {
        connection.query('DELETE FROM mypage WHERE id=?', [id], (error, data) =>{
          connection.query('DELETE FROM customer WHERE id=?', [id], (error, data) =>{})
        })
        if (error) throw error;
    
        res.send(`
          <script type="text/javascript">
              alert("회원 정보가 삭제되었습니다.");
              window.location.href = "/"; // 이동할 URL을 지정해주세요.
          </script>
        `);
      });
    });
    app.post('/logout', (req, res) => {
      req.session.destroy(); // 세션 제거
      res.redirect('/');
    });
    app.post('/searchlogin', (req, res) => {
      const search = req.body.search;
      const searchTerm = '%' + search + '%'; // 검색어 앞뒤에 와일드카드를 추가합니다.
    
      const query = 'SELECT * FROM cosmetics WHERE productname LIKE ? OR company LIKE ? OR type LIKE ?';
      connection.query(query, [searchTerm,searchTerm,searchTerm], (error, results) => {
        if (error) throw error;
    
        const resultArray1 = [];
        const resultArray2 = [];
        const resultArray3 = [];
        const resultArray4 = [];
        const resultArray5 = [];
        const resultArray6=[];
    
    
        for (let i = 0; i < results.length; i++) {
          const arr1 = results[i].company;
          resultArray1.push(arr1);
    
          const arr2 = results[i].type;
          resultArray2.push(arr2);
    
          const arr3 = results[i].productname;
          resultArray3.push(arr3);
    
          const arr4 = results[i].price;
          resultArray4.push(arr4);
    
          const arr5 = results[i].saleprice;
          resultArray5.push(arr5);
          const arr6=results[i].image_url;
          resultArray6.push(arr6)
    
        }
    
        res.render('searchlogin', {
          resultArray1,
          resultArray2,
          resultArray3,
          resultArray4,
          resultArray5,
          resultArray6
        });
      });
    });
    
      app.post('/purchase', (req, res) => {
        const selectedProduct = req.body.search1; 
      
        const query = 'SELECT * FROM cosmetics WHERE productname = ?';
        connection.query(query, [selectedProduct], (error, results) => {
          if (error) throw error;
      
          const productid = results[0].productid;
          const company = results[0].company;
          const productname = results[0].productname;
          const price = results[0].price;
      
          const randomInt = Math.floor(Math.random() * 200000) + 100000;
          const id = req.session.userId;
          connection.query(
            'INSERT INTO mycart VALUES (?, ?, ?, ?, ?, ?, "5월31일 도착")',
            [randomInt, productid, id, company, productname, price],
            (error, data) => {
              if (error) throw error;
        
              connection.query(
                'SELECT * FROM mycart WHERE id = ?',
                [id],
                (error, data) => {
                  if (error) throw error;
        
                  const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>구매목록/올리브영</title>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                          background-color: #f2f2f2;
                          margin: 0;
                          padding: 0;
                        }
        
                        .container {
                          max-width: 600px;
                          margin: 0 auto;
                          padding: 20px;
                          background-color: #fff;
                          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
        
                        h1 {
                          text-align: center;
                          color: #45a049;
                          margin-bottom: 20px;
                        }
        
                        table {
                          width: 100%;
                          border-collapse: collapse;
                        }
        
                        th, td {
                          padding: 5px;
                          text-align: center;
                          font-size: 0.5rem;
                          border-bottom: 1px solid #ccc;
                        }
        
                        .cart-item button {
                          padding: 6px 12px;
                          background-color: #dc3545;
                          color: #fff;
                          border: none;
                          border-radius: 4px;
                          cursor: pointer;
                        }
        
                        .cart-item button:hover {
                          background-color: #c82333;
                        }
        
                        .arrival-date {
                          margin-top: 20px;
                          font-style: italic;
                          color: #888;
                        }
        
                        .success-message {
                          margin-top: 20px;
                          text-align: center;
                          color: green;
                        }
        
                        .back-button {
                          margin-top: 20px;
                          text-align: center;
                        }
        
                        .back-button a {
                          display: inline-block;
                          padding: 10px 20px;
                          background-color: #45a049;
                          color: #fff;
                          text-decoration: none;
                          border-radius: 4px;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>구매목록 및 구매</h1>
        
                        <div class="product-details">
                          <h2>현재 구매한 상품</h2>
                          <table>
                            <tr>
                            <th>주문번호</th>
                            <th>고객 아이디</th>
                            <th>상품번호</th>
                            <th>제품회사</th>
                            <th>상품명</th>
                            <th>가격</th>
                            </tr>
                            <tr>
                              <td>${randomInt}</td>
                              <td>${id}</td>
                              <td>${productid}</td>
                              <td>${company}</td>
                              <td>${productname}</td>
                              <td>${price}</td>
                            </tr>
                          </table>
                        </div>
        
                        <div class="cart-items">
                          <h2>구매 목록</h2>
                          <table>
                            <tr>
                              <th>주문번호</th>
                              <th>고객 아이디</th>
                              <th>상품번호</th>
                              <th>제품회사</th>
                              <th>상품명</th>
                              <th>가격</th>
                              <th>상태</th>
                            </tr>
                            ${data
                              .map(
                                item => `
                                  <tr class="cart-item">
                                    <td>${item.orderid}</td>
                                    <td>${item.id}</td>
                                    <td>${item.productid}</td>
                                    <td>${item.company}</td>
                                    <td>${item.productname}</td>
                                    <td>${item.price}</td>
                                    <td>
                                      <form action="/cancel" method="post">
                                        <input type="hidden" name="orderid" value="${item.orderid}">
                                        <input type="hidden" name="id" value="${item.id}">
                                        <input type="hidden" name="productid" value="${item.productid}">
                                        <button type="submit">취소</button>
                                      </form>
                                    </td>
                                  </tr>
                                `
                              )
                              .join('')}
                          </table>
                        </div>
        
                        <p class="arrival-date">예상 도착 날짜: 5월 31일 도착</p>
        
                        <p class="success-message">구매 성공! 곧 리디렉션됩니다.</p>
        
                        <div class="back-button">
                          <a href="/user:${id}">뒤로가기</a>
                        </div>
                      </div>
                    </body>
                    </html>
                  `;
        
                  res.send(html);
                }
              );
            }
          );
        });
        
        app.post('/cancel', (req, res) => {
          const { orderid, id, productid } = req.body;
        
          connection.query(
            'DELETE FROM mycart WHERE orderid = ? AND id = ? AND productid = ?',
            [orderid, id, productid],
            (error, result) => {
              if (error) throw error;
              res.redirect(`/user:${id}`);
            }
          );
        });
            }
          );
  
      
  });
 
  
  
  
  

     res.redirect(`/user:${id}`)
     
    }
    
    else{
      res.send(`
      <script type="text/javascript">
          alert("아이디 또는 비밀번호 다시 입력해주세요.");
          window.location.href = "/login";
      </script>
  `);
    }
    //res.send(rows);
  })
  
  
  
 
 

})
app.post('/register',(req,res)=>{
  const id=req.body.id
  const pw=req.body.pw
  const name =req.body.name
  const email=req.body.email
  const birth=req.body.birth
  const address=req.body.address
  const phone=req.body.phone
  if(id&&pw&&name&&email&&birth&&address&&phone){
    connection.query('SELECT * from customer where id=?',[id], (error, data) => {
      if (error) throw error;
      if(data.length<=0){
        connection.query('insert into customer values (?,?,?,?,?,?,?)',[id, pw, name, email, birth, address, phone],(error,data)=>{
          if (error) throw error;
          res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
          document.location.href="/";</script>`)
        })
      }
      else{
        res.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/register";</script>`);  
      }
    })
  }
  else{
    res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
    document.location.href="/register";</script>`);
  }
  
})



app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
