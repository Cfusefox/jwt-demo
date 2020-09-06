var express = require('express');
var router = express.Router();
const db = require('../database')
const mongoose = require('mongoose')
const JwtUtil = require('../jwt');

router.post('/save', function(req, res, next) {
  const User = mongoose.model('User')
  var user = new User({
    username: 'fox',
    password: 'test'
  })
  user.save((err) => {
    if(err) {
      res.json(err)
    } else {
      res.json("success")
    }
  })
})

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  const User = mongoose.model('User')
  new Promise((resolve, reject) => {
    // 根据用户名查询用户
    User.findOne({"username": username}).exec((err,result) => {
      if(err){
        reject(err);
      }else{
        resolve(result);
      }
    });
  }).then((result) => {
    if(result){
      if(password == result.password){
        // 登陆成功，添加token验证
        let _id = result._id.toString();
        // 将用户id传入并生成token
        let jwt = new JwtUtil(_id);
        let token = jwt.generateToken();
        // 将 token 返回给客户端
        res.send({status:200,msg:'登陆成功',token:token});
      }else{
        res.send({status:400,msg:'账号密码错误'});
      }
    }else{
      res.send({status:404,msg:'账号不存在'})
    }
  }).catch((err) => {
    console.log(err);
    res.send({status:500,msg:'账号密码错误'});
  })
})



module.exports = router;
