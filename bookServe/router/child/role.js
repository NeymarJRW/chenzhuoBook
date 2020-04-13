const express = require('express');
const role = express.Router();
const db = require("../../mysql/index");


//获取管理员信息
role.get('/getrole', function (req, res) {
  var sql = 'SELECT * FROM role';
  db.select(sql).then(data => {
    // console.log(data)
    res.send(data)
  })
})

//登录匹配
role.post('/login', function (req, res) {
  console.log(req.body)

  var findSql = `SELECT * FROM role where name='${req.body.name}'`;
  // console.log(req.body)
  db.select(findSql).then(data => {
    console.log(data)
    if (data.length > 0) {
      //存在
      console.log(data[0].password)
      if (data[0].password == req.body.password) {
        //登陆成功
        res.send({
          code: 1,
          msg: "登录成功!"
        })
      } else {
        //密码不匹配
        res.send({
          code: 0,
          msg: "密码错误!"
        })
      }

    } else {
      //不存在
      res.send({
        code: 0,
        msg: "管理员姓名错误!"
      })
    }
  })
})

//修改密码
role.post('/pass', function (req, res) {
  console.log(req.body);
  var findSql = `SELECT * FROM role where name='${req.body.name}'`;
  db.select(findSql).then(data => {
    console.log(data)
    if (data.length > 0) {
      //存在
      // if(data)
      console.log(data[0])
      if (data[0].password == req.body.old) {
        //与旧密码匹配
        changePass()
      } else {
        res.send({
          code: 0,
          msg: "旧密码输入错误!"
        })
      }


    } else {
      res.send({
        code: 0,
        msg: "修改失败!"
      })
    }
  })

  function changePass() {
    var sql = `UPDATE role set password='${req.body.new}' where name = '${req.body.name}'`;
        db.update(sql).then(data => {
          console.log(data)
          if (data.affectedRows > 0) {
            res.send({
              code: 1,
              msg: "修改成功,请重新登录"
            })
          } else {
            res.send({
              code: 0,
              msg: "修改失败"
            })

          }
        })

  }

})

module.exports = role;