const express = require('express');
const books = express.Router();
const db = require("../../mysql/index")
//获取全部书籍信息
books.get('/getbook', function (req, res) {
  var sql = 'SELECT * FROM book';
  db.select(sql).then(data => {
    console.log(data)
    res.send(JSON.stringify(data))
  })
})

//编辑图书
books.post('/editbook', function (req, res) {
  // var findSql = `SELECT * FROM book where name='${req.body.name}'`;

  // console.log(req.body)
  // db.select(findSql).then(data => {
  //   console.log(data)
  //   if (data.length > 0) {
  //     //存在
  //     res.send({
  //       code: 0,
  //       msg: "书籍已存在!"
  //     })
  //   } else {
      editFun();
    // }
  // })

  function editFun() {
    var d = req.body;
    var sql = `UPDATE book set name='${d.name}', type='${d.type}', language='${d.language}',price='${d.price}',number='${d.number}',status='${d.status}' where id = '${d.id}'`;
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
  }

})

//删除图书
books.post('/deletebook', function (req, res) {
  console.log(req.body)
  var sql = `DELETE from book where id=${req.body.id}`;
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

//添加新书
books.post('/addbook', function (req, res) {
  var findSql = `SELECT * FROM book where name='${req.body.name}'`;

  console.log(req.body)
  db.select(findSql).then(data => {
    console.log(data)
    if (data.length > 0) {
      //存在
      res.send({
        code: 0,
        msg: "添加书籍已存在!"
      })
    } else {
      addFun();
    }
  })

  function addFun() {
    var sql =
      `INSERT INTO book (name,type,language,price,number,status) 
    VALUES
      ('${req.body.name}','${req.body.type}','${req.body.language}','${req.body.price}','${req.body.number}','${req.body.status}' )
      `;
    db.insert(sql).then(data => {
      if (data.affectedRows > 0) {
        res.send({
          code: 1,
          msg: "添加成功!"
        })
      } else {
        res.send({
          code: 0,
          msg: "添加失败!"
        })

      }
    })
  }


})


module.exports = books;