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
      const arr=[data[0].name, data[0].membership]
      res.send(arr)
     })
     res.redirect('/user')
    }
    //res.send(rows);
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
  if(id){
    connection.query('SELECT * from customer where id=?',[id], (error, data) => {
      if (error) throw error;
      if(data.length<=0){
        connection.query('insert into customer values (?,?,?,?,?,?,?)',[id, pw, name, email, birth, address, phone],(error,data)=>{
          if (error) throw error;
          res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
          document.location.href="/";</script>`)
        })
      }
    })
  }
  
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});