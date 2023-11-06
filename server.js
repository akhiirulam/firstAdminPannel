const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const router = require('./router')
const path = require('path');
const app=express();
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const publicPath = path.join(__dirname, 'public');

const port=process.env.PORT || 3000;
app.use('/',router);
app.use(express.static(publicPath)) 

app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render('login',{title:"Login Page"})
})

app.listen(port,()=>{console.log('Listening to the server on http://localhost:3000')})
