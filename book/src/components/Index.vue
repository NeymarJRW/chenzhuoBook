
<template>
  <div class="layout">
    <Layout style="height:100%">
      <Sider
        class="right"
        ref="side1"
        hide-trigger
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
      >
        <p class="title">
          <Icon type="ios-bookmarks" />
          <span>图书后台管理</span>
        </p>
        <!-- active-name="bookinfo" -->
        <Menu
          active-name="bookinfo"
          theme="dark"
          width="200"
          :class="menuitemClasses"
          @on-select="topage"
        >
          <MenuItem v-for="(item,index) in menuList" :name="item.name" :key="index">
            <Icon :type="item.type"></Icon>
            <span>{{item.title}}</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            :style="{margin: '0 20px'}"
            type="md-menu"
            size="24"
          ></Icon>
          <div class="user float">
            <Avatar
              src="https://i.loli.net/2017/08/21/599a521472424.jpg"
              icon="ios-person"
              size="large"
            />
            <Dropdown class="userinfo float" @on-click="userselect">
              <a href="javascript:void(0)" class="username">
                {{getUsername }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="1">修改密码</DropdownItem>
                <DropdownItem divided name="2">退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Header>
        <Content :style="{margin: '15px', background: '#fff', minHeight: '260px',overflow:'auto'}">
          <router-view />
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="changePassFlag" title="修改密码">
      <p slot="header" style="text-align:center">
        <span>修改密码</span>
      </p>
      <div class="passView">
        <div class="item" :style="{marginTop:'10px'}">
          旧密码 :
          <Input
            v-model="changePassData.old"
            placeholder="输入旧密码..."
            style="width: 300px;marginLeft:10px"
          />
        </div>
        <div class="item">
          新密码 :
          <Input
            v-model="changePassData.new"
            placeholder="输入新密码..."
            style="width: 300px;marginLeft:10px"
          />
        </div>
        <div class="item">
          <Button @click="changePassFlag=false" :style="{marginRight:'15px'}">取消</Button>

          <Button type="primary" @click="changePassFun">确定</Button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import $ from "jquery";
import { changePass } from "@/api/index";
export default {
  name: "Index",
  data() {
    return {
      changePassData: {
        name: sessionStorage.getItem("userName")
          ? sessionStorage.getItem("userName")
          : "Admin",
        old: "",
        new: ""
      },
      changePassFlag: false,
      isCollapsed: false,
      menuList: [
        {
          name: "bookinfo",
          type: "ios-book",
          title: "书籍信息"
        },
        {
          name: "userinfo",
          type: "md-reorder",
          title: "借阅信息"
        },
        {
          name: "roleinfo",
          type: "ios-contacts",
          title: "管理员信息"
        }
      ]
    };
  },
  computed: {
    getUsername() {
      return sessionStorage.getItem("userName")
        ? sessionStorage.getItem("userName")
        : "Admin";
    },
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  watch: {
    isCollapsed(val) {
      if (val) {
        $(".title span").html("");
      } else {
        setTimeout(() => {
          $(".title span").html("图书后台管理");
        }, 100);
      }
    }
  },
  mounted() {},
  methods: {
    changePassFun() {
      for (var k in this.changePassData) {
        if (this.changePassData[k].length == 0) {
          this.$Message.error("信息填写不完整!");
          return;
        }
      }
      console.log(this.changePassData);
      if(this.changePassData.new!=this.changePassData.old){
      changePass(this.changePassData).then(res => {
        if (res.code == 1) {
          this.$Message.success(res.msg);
          sessionStorage.setItem("login", 0);
          setTimeout(() => {
            this.$router.push({ name: "login" });
          }, 500);
        } else {
          this.$Message.error(res.msg);
        }
      });
      }else{
          this.$Message.error("新密码不能与旧密码相同!");

      }

    },
    topage(name) {
      this.$router.push({ name: name });
    },
    userselect(name) {
      switch (name) {
        case "1":
          console.log("修改密码");
          this.changePassFlag = true;
          break;
        case "2":
          console.log("退出登录");
          this.$Modal.confirm({
            title: "提示",
            content: "<p>确定要退出登录吗?</p>",
            onOk: () => {
              sessionStorage.setItem("login", 0);
              this.$Message.success("退出登录成功!");
              setTimeout(() => {
                this.$router.push({ name: "login" });
              }, 500);
            },
            onCancel: () => {
              this.$Message.info("Clicked cancel");
            }
          });
      }
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    }
  }
};
</script>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.right {
  font-size: 15px;
}
.title {
  font-size: 25px;
  color: #fff;
  text-align: center;
  margin: 5px 0;
}
.title span {
  font-size: 20px;
  vertical-align: text-top;
  font-weight: bold;
}
.float {
  float: right;
}
.user .userinfo {
  margin: 0 20px;
}
.user .userinfo .username {
  color: #333;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
  /* font-size: 20px; */
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 22px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 18px;
}
.passView {
  text-align: center;
}
.passView .item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
</style>