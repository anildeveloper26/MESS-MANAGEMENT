const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
require("./db/conn");
const Register = require("./models/registers");
const { log } = require('console');

const port = process.env.PORT || 3000 ;

const static_path = path.join(__dirname,'../public');
const templates_path = path.join(__dirname,'../templates/views')
const partials_path = path.join(__dirname,'../templates/partials')

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set('view engine', 'hbs')
app.set('views',templates_path)
hbs.registerPartials(partials_path)

app.get('/', (req,res)=>{
    res.render('index')

});
app.get('/register', (req,res) => {
    res.render('register')
});
app.get('/login', (req,res) => {
    res.render('login')
});
app.get('/thankyou', (req,res) => {
    res.render('thankyou')
});
 
app.get('/feedback',(req,res)=>{
    res.render('feedback');
})
app.get('/login',(req,res)=>{
    res.render('login');
})


app.use(express.static(path.join(__dirname, 'public')));






app.post('/register', async(req,res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const studentdetails = new Register({
                email:req.body.email,
                password:req.body.password,

            })
            const registered = await studentdetails.save();
            res.render(
                'login'
            )
        }
    }
    catch(error){
        res.status(400).send(error);
    }
});


app.post('/login',async (req,res)=>{

    try{
        const check = await Register.findOne({email:req.body.email})
        if(check.password === req.body.password){
            res.render('feedback')
        }
        else{
            res.send("wrong password")
        }
    }
    catch{
        res.send("wrong details")
    }
})


app.listen(port,()=>{
    console.log('server is running at port no '+port);
});