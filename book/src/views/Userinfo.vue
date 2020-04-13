<template>
  <div class="main">
    <div class="toplist">
      <Dropdown :style="{margin: '0 10px 10px 0px'}" @on-click="selectMajor">
        <Button type="primary">
          {{majorName ? majorName : "选择专业" }}
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list" v-for="(item,index) in majorList" :key="index">
          <DropdownItem :name="item">{{item}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown :style="{margin: '0 10px 10px 0px'}" @on-click="selectStatus">
        <Button type="primary">
          {{statusName ? statusName : "选择状态" }}
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list" v-model="statusName">
          <DropdownItem name="已逾期">已逾期</DropdownItem>
          <DropdownItem name="未逾期">未逾期</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button :style="{marginLeft:'5px'}" type="primary" @click="userAddFlag=true">添加信息</Button>
      <Button :style="{marginLeft:'15px'}" type="primary" @click="selectAll">全部信息</Button>
      <Input
        v-model="username"
        :style="{width: 'auto',marginLeft: '15px'}"
        search
        enter-button
        placeholder="搜索借阅人..."
        @on-search="searchUserName"
      />
    </div>
    <Table border :columns="column" :data="userdata"></Table>
    <div class="page">
      <Page
        class="page"
        :total="total"
        show-total
        :current.sync="currentPage"
        :page-size="pageSize"
        @on-change="changePage"
      />
    </div>
    <Modal v-model="userEditFlag" width="500">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>修改借阅信息</span>
      </p>
      <div>
        <UserEdit
          @toParent="initial"
          @closeWin="closewin"
          :userData="editUserDataAsync"
          v-if="JSON.stringify(editUserDataAsync) !== '{}'"
        ></UserEdit>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="userAddFlag" width="500">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>添加借阅信息</span>
      </p>
      <div>
        <UserAdd @toParent="initial" @closeWin="closewin"></UserAdd>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { getUser, delUserData } from "@/api/index";
import UserEdit from "@/components/userinfo/useredit";
import UserAdd from "@/components/userinfo/useradd";
export default {
  components: {
    UserEdit,
    UserAdd
  },
  data() {
    return {
      userEditFlag: false,
      userAddFlag: false,
      username: "",
      editUserDataAsync: {},

      alluserdata: [],
      userdata: [],
      column: [
        {
          title: "借阅人",
          key: "name",
          align: "center"
        },
        {
          title: "学号",
          key: "schoolNumber",
          align: "center"
        },
        {
          title: "联系方式",
          key: "phoneNumber",
          align: "center"
        },
        {
          title: "专业",
          key: "major",
          align: "center"
        },
        {
          title: "借阅书籍",
          key: "bookName",
          align: "center",
          render: (h, params) => {
            return h("p", `<< ${params.row.bookName} >>`);
          }
        },
        {
          title: "借阅日期",
          key: "date",
          align: "center"
          // render: (h, params) => {
          //   console.log( new Date(params.row.date)/1000  )
          //   return h("p", `<< ${params.row.date} >>`);
          // }
        },
        {
          title: "还书日期",
          key: "date",
          align: "center",
          render: (h, params) => {
            //格式化日期
            function formatDate(date) {
              var date = new Date(date * 1000);
              var YY = date.getFullYear() + "-";
              var MM =
                (date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1)
                  : date.getMonth() + 1) + "-";
              var DD =
                date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

              return YY + MM + DD;
            }

            var borrowDate = Math.round(new Date(params.row.date) / 1000); //结束日期
            var backDate = borrowDate + 86400 * 15; //根据借书日期计算出归还日期
            var currentDate = new Date() / 1000; //当前日期
  
            // var countDay=
            // console.log(formatDate(backDate));
            return h("p", `${formatDate(backDate)}`);
          }
        },
        {
          title: "还书期限",
          key: "date",
          align: "center",
          render: (h, params) => {
            var borrowDate = Math.round(new Date(params.row.date) / 1000); //结束日期
            var backDate = borrowDate + 86400 * 15; //根据借书日期计算出归还日期
            var currentDate = new Date() / 1000; //当前日期
            var countDay =
              backDate - currentDate > 0
                ? Math.round((backDate - currentDate) / 86400) + "天"
                : "逾期";
            var fontColor = backDate - currentDate > 0 ? "green" : "red";
            return h("p", { style: { color: fontColor } }, ` ${countDay}`);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editUserDataAsync = JSON.parse(
                        JSON.stringify(params.row)
                      );
                      this.userEditFlag = true;
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: "<p>确定该借阅人已归还书籍了吗?</p>",
                        onOk: () => {
                          delUserData({ name: params.row.name }).then(res => {
                            if (res.code == 1) {
                              this.$Message.success(res.msg);
                              this.selectAll();
                            } else {
                              this.$Message.error(res.msg);
                            }
                          });
                        },
                        onCancel: () => {
                          // this.$Message.info("Clicked cancel");
                        }
                      });
                    }
                  }
                },
                "归还"
              )
            ]);
          }
        }
      ],
      //分页
      currentPage: 1,
      total: 0,
      pageSize: 8,

      //搜索借阅人
      majorName: "",
      majorList: [],

      //选择状态
      statusName: "",
      statusList: [],

      //书籍目录
      bookNameList: []
    };
  },

  mounted() {
    this.initial();
  },
  methods: {
    closewin() {
      this.userEditFlag = false;
      this.userAddFlag = false;
    },
    initial() {
      this.userEditFlag = false;
      this.userAddFlag = false;
      this.username = "";
      this.majorName = "";
      this.statusName = "";
      this.currentPage = 1;
      getUser().then(res => {
        var _this = this;
        function getStatusDate(i) {
          var borrowDate = Math.round(new Date(i.date) / 1000); //结束日期
          var backDate = borrowDate + 86400 * 15; //根据借书日期计算出归还日期
          var currentDate = new Date() / 1000; //当前日期
          if (backDate - currentDate > 0) {
            //未逾期
            _this.statusList.push(i.date);
          }
        }

        // console.log(res);
        res.map(item => {
          getStatusDate(item);
          if (this.majorList.indexOf(item.major) == -1) {
            this.majorList.push(item.major);
          }
        });
        console.log(this.statusList);
        this.getUserInfo(res);
      });
    },
    getUserInfo(data) {
      this.alluserdata = data;
      this.total = data.length;
      this.changePage(1);
    },
    changePage(index) {
      var start = (index - 1) * this.pageSize;
      var end = start + this.pageSize;
      this.userdata = this.alluserdata.slice(start, end);
    },
    selectStatus(n) {
      this.userEditFlag = false;
      this.userAddFlag = false;
      this.username = "";
      this.majorName = "";
      this.statusName = n;
      console.log(this.statusList);
      getUser().then(res => {
        if (n == "未逾期") {
          this.getUserInfo(
            res.filter(item => this.statusList.indexOf(item.date) > -1)
          );
        } else {
          this.getUserInfo(
            res.filter(item => this.statusList.indexOf(item.date) == -1)
          );
        }
      });
    },
    selectMajor(name) {
      this.userEditFlag = false;
      this.userAddFlag = false;
      this.username = "";
      this.majorName = "";
      // console.log(name);
      this.majorName = name;
      getUser().then(res => {
        this.getUserInfo(res.filter(item => item.major == name));
      });
    },
    selectAll() {
      this.initial();
    },
    searchUserName() {
      if (this.username) {
        getUser().then(res => {
          let arr = res.filter(item => item.name.indexOf(this.username) > -1);
          if (arr.length <= 0) {
            this.$Message.error("没有找到相关借阅人!");
          } else {
            this.majorName = null;
            this.getUserInfo(arr);
          }
        });
      } else {
        this.$Message.error("内容为空!");
      }
    }
  }
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.page {
  text-align: center;
  margin: 10px 0;
}
.toplist {
  display: flex;
}
</style>