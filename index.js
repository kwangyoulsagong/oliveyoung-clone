const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
var cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyparser=require('body-parser');
const { render } = require('pug');



const app = express();
app.set('view engine', 'ejs');  

app.use(cors());

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

app.get("/mypage", (req, res) => {
 
  res.sendFile(__dirname + "/mypage.html");
});
app.get("/update", (req, res) => {
 
  res.sendFile(__dirname + "/update.html");
});


// configuration =========================
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Root');
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
  const searchTerm = '%' + search + '%'; // 검색어 앞뒤에 와일드카드를 추가합니다.

  const query = 'SELECT * FROM cosmetics WHERE productname LIKE ?';
  connection.query(query, [searchTerm], (error, results) => {
    if (error) throw error;

    const resultArray1 = [];
    const resultArray2 = [];
    const resultArray3 = [];
    const resultArray4 = [];
    const resultArray5 = [];

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
    }

    res.render('search', {
      resultArray1,
      resultArray2,
      resultArray3,
      resultArray4,
      resultArray5
    });
  });
});
app.post('/purchase', (req, res) => {
  const productName = req.body.productName; // 제품 이름은 요청의 본문(body)에 포함됩니다.

  // 여기서 구매 처리 로직을 구현합니다.
  // 제품 이름을 활용하여 구매 작업을 수행합니다.

  // 응답으로 마이페이지 또는 구매 완료 페이지 등을 보내줍니다.
  // 이 예시에서는 구매 완료 페이지로 리다이렉션합니다.
  res.send(productName)
})
app.post('/login',(req,res)=>{
  const id= req.body.id
  const pw=req.body.pw

  app.get(`/user:id`, (req, res) => {
 
    res.sendFile(__dirname + "/user.html");
  });
  connection.query('SELECT * from customer where id=?',[id], (error, data) => {
    if (error) throw error;
    if(id == data[0].id && pw==data[0].passward){
     app.route(`/customer`).get((req,res)=>{
      res.send(data[0].name)
     })
     res.redirect(`/user:${id}`)
     
    }
    //res.send(rows);
  })
  connection.query('update mypage set id=?', [id], (error, data) => {})
  
  app.get('/change', (req, res) => {
    connection.query('SELECT * from mypage where id=?', [id], (error, data) => {
        if (error) throw error;
        res.json([data[0].id, data[0].type1, data[0].type2, data[0].type3]);
    });
   
});

app.post('/update', (req, res) => {
  const skin1 = req.body.skin_type1;
  const skin2 = req.body.skin_type2;
  const skin3 = req.body.skin_type3;

  connection.query('UPDATE mypage SET type1=?, type2=?, type3=? WHERE id=?', [skin1, skin2, skin3, id], (error, data) => {
      if (error) throw error;

      connection.query('SELECT * FROM mypage WHERE id=?', [id], (error, data) => {
          if (error) throw error;
          
          res.send(`
              <script type="text/javascript">
                  alert("수정되었습니다.");
                  window.location.href = "/mypage";
              </script>
          `);
      });
  });
});

app.get('/mypage', (req, res) => {
    connection.query('SELECT * from mypage where id=?', [id], (error, data) => {
        if (error) throw error;
        res.json(data[0]);
        
    });
});


 
 

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
app.post('/logout',(req,res)=>{
  res.redirect('/')
})


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
