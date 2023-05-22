const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
const cors = require('cors');
const bodyparser=require('body-parser')


const app = express();

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
app.get("/user", (req, res) => {
 
  res.sendFile(__dirname + "/user.html");
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
app.post('/login',(req,res)=>{
  const id= req.body.id
  const pw=req.body.pw
  
 
  connection.query('SELECT * from customer where id=?',[id], (error, data) => {
    if (error) throw error;
    if(id == data[0].id && pw==data[0].passward){
     app.route('/customer').get((req,res)=>{
      res.send(data[0].name)
     })
     res.redirect('/user')
     
    }
    //res.send(rows);
  })
  app.post('/update',(req,res)=>{
    const skin1 =req.body.skin_type1
     const skin2 =req.body.skin_type2
     const skin3 =req.body.skin_type3
      connection.query('update mypage set id=?, type1=?, type2=?, type3=?',[id,skin1,skin2,skin3], (error, data) =>{
        if (error) throw error;
        res.send(`<script type="text/javascript">alert("수정되었습니다,."); 
        document.location.href="/mypage";</script>`);
        connection.query('SELECT * from mypage where id=?',[id], (error, data) =>{
         const arr=[data[0].id,data[0].type1,data[0].type2,data[0].type3]
         if (error) throw error;
         app.route('/change').get((req,res)=>{
           res.send(arr)
          })
        })
       })
      console.log(id,skin1)
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
app.post('/logout',(req,res)=>{
  res.redirect('/')
})


app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});