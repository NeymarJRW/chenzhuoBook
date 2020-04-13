<template>
  <div class="login">
    <div class="main">
      <h2>图书后台管理</h2>
      <div class="inp">
        姓名: 
         <Input v-model="loginData.name" placeholder="请输入姓名..." style="width: 250px;marginLeft:10px" @keyup.enter.native="logins"/>
      </div>
      <div class="inp">


        密码: 
        <Input v-model="loginData.password" type="password" placeholder="请输入密码..." style="width: 250px;marginLeft:10px"  @keyup.enter.native="logins"/>
        <span data-name="Password"></span>
      </div>
      <!-- <input class="btn" type="button" value="登录" @keyup.enter="logins" /> -->
      <div class="inp">
      <Button  type="primary" style="width:100px" @click="logins">登录</Button>

      </div>
    </div>
  </div>
</template>

<script>
// import $ from "jquery";
import { loginRole } from "@/api/index";
export default {
  data() {
    return {
      loginData: {
        name: "",
        password: ""
      }
    };
  },
  mounted() {
    // $(".inp input").on("focus", function() {
    //   $(this).addClass("focus");
    // });
    // $(".inp input").on("blur", function() {
    //   if ($(this).val() == "") {
    //     $(this).removeClass("focus");
    //   }
    // });
  },
  methods: {
    logins() {
      for (var k in this.loginData) {
        if (this.loginData[k].length == 0) {
          this.$Message.error("信息填写不完整!");
          return;
        }
      }
      loginRole(this.loginData).then(res=>{
        if(res.code==1){

          this.$Message.success(res.msg);

          setTimeout(() => {
            sessionStorage.setItem("userName",this.loginData.name);
            sessionStorage.setItem("login", 1);
            this.loginData.name="";
            this.loginData.password="";
            this.$router.push({ path: "/menu/bookinfo" });
          }, 500);
        }else{
          this.$Message.error(res.msg);
        }

      })


    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #5b6270, #d3d3d3, #5b6270);
}
.main {
  width: 350px;
  height: 300px;
  background: #f8f8ff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 2px 2px 5px #333333;
  transition: all 0.3s;
}
.main h2{
  text-align: center;
  margin: 10px 0 30px 0;
  font-size: 25px;
}
.main .inp{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

</style>
