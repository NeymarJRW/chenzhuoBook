var mysql = require('mysql');
var mydb = require('./config')
var connection = mysql.createConnection(mydb);
connection.connect(function (err) {
  if (err) {
    console.log('数据库连接失败')
  }else{
    console.log('数据库连接成功')

  }
});

var sqlfun = function (sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

var db = {
  // 查 'SELECT * FROM t_user WHERE username = "whg"'
  select: sqlfun,
  // 增 'INSERT INTO t_user(username, pass) VALUES(?, ?)',['whg', '123'],
  insert: sqlfun,
  // 删 'DELETE FROM t_user  WHERE id = 1'
  delete: sqlfun,
  // 改 UPDATE t_user SET pass = "321" WHERE username = "whg"'
  update: sqlfun
}
module.exports = db;