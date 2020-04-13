const express = require('express');
const user = express.Router();
const db = require("../../mysql/index")

//获取全部借阅信息
user.get('/getuser', function (req, res) {
  var sql = 'SELECT * FROM user';
  db.select(sql).then(data => {
    res.send(JSON.stringify(data))
  })
})
//修改信息
user.post('/edituser', function (req, res) {
  var d = req.body;
  var sql = `UPDATE user set  schoolNumber='${d.schoolNumber}', phoneNumber='${d.phoneNumber}',major='${d.major}',bookName='${d.bookName}',date='${d.date}' where name = '${d.name}'`;
  db.update(sql).then(data => {
    console.log(data)
    if (data.affectedRows > 0) {
      res.send({
        code: 1,
        msg: "修改成功"
      })
    } else {
      res.send({
        code: 0,
        msg: "修改失败"
      })

    }
  })
})

//添加信息
user.post('/adduser', function (req, res) {
  var findSql = `SELECT * FROM user where name='${req.body.name}' or schoolNumber='${req.body.schoolNumber}'`;
  // console.log(req.body)
  db.select(findSql).then(data => {
    console.log(data)
    if (data.length > 0) {
      //存在
      res.send({
        code: 0,
        msg: "借阅人或学号已存在!"
      })
    } else {
      addFun()
    }
  })

  function addFun() {
    var d = req.body;
    var sql = `INSERT INTO user (name,schoolNumber,phoneNumber,major,bookName,date) 
    VALUES
      ('${req.body.name}', '${req.body.schoolNumber}', '${req.body.phoneNumber}', '${req.body.major}', '${req.body.bookName}', '${req.body.date}')
      `;
    db.update(sql).then(data => {
      console.log(data)
      if (data.affectedRows > 0) {
        res.send({
          code: 1,
          msg: "添加成功"
        })
      } else {
        res.send({
          code: 0,
          msg: "添加失败"
        })

      }
    })
  }

})
//归还书籍(删除)
user.post('/deluser',function(req,res){
    console.log(req.body)
    var sql = `DELETE from user where name='${req.body.name}'`;
    db.delete(sql).then(data => {
      console.log(data)
      if (data.affectedRows > 0) {
        res.send({
          code: 1,
          msg: "删除成功!"
        })
      } else {
        res.send({
          code: 0,
          msg: "删除失败!"
        })

      }
    })
})
module.exports = user;