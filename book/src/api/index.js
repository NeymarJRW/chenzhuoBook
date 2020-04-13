import qs from 'qs'
import axios from 'axios'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//  axios.defaults.headers.common["token"] = "tokentokentokentokentoken";


// var uri = 'http://49.232.38.102:3000/'
var uri = 'http://localhost:3000/'


const Http = (params, data) => {
  let option = {
    method: params.method || 'get',
    url: params.url,
    baseURL: uri,
    params: data,
    data: qs.stringify(data),
    // withCredentials: true
  }
  if (params.method === 'post') {
    delete option.params
  } else {
    delete option.data
    // delete option.baseURL
  }
  return new Promise((resolve, reject) => {
    axios(option)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })

}
//---------------------------图书信息----------------------------
//图书信息
export const getBook = data => {
  return Http({
    url: 'books/getbook'
  })
}

//编辑图书
export const editBook = data => {
  return Http({
    method: 'post',
    url: 'books/editbook'
  }, data)
}

//删除图书
export const delBook = data => {
  return Http({
    method: 'post',
    url: 'books/deletebook'
  }, data)
}
//添加图书
export const addBook = data => {
  return Http({
    method: 'post',
    url: 'books/addbook'
  }, data)
}


//---------------------------借阅信息----------------------------
//全部借阅信息
export const getUser = data => {
  return Http({
    url: 'users/getuser'
  })
}
//修改借阅信息
export const editUserData = data => {
  return Http({
    method: 'post',
    url: 'users/edituser'
  }, data)
}
//添加借阅信息
export const addUserData = data => {
  return Http({
    method: 'post',
    url: 'users/adduser'
  }, data)
}
//删除借阅信息
export const delUserData = data => {
  return Http({
    method: 'post',
    url: 'users/deluser'
  }, data)
}

//---------------------------管理员信息----------------------------
//全部借阅信息
export const getRole = data => {
  return Http({
    url: 'role/getrole'
  })
}

//登录判断
export const loginRole = data => {
  return Http({
    method: 'post',
    url: 'role/login'
  }, data)
}
//修改密码
export const changePass = data => {
  return Http({
    method: 'post',
    url: 'role/pass'
  }, data)
}