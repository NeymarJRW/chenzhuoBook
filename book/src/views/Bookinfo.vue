<template>
  <div class="all">
    <!-- <div class="loading" v-if="isLoading">
      <Col class="demo-spin-col" span="8">
        <Spin fix>
          <Icon type="ios-loading" size="40" class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </Col>
    </div>-->
    <div class="main" v-if="!isLoading">
      <div class="toplist">
        <Dropdown :style="{margin: '0 10px 10px 0px'}" @on-click="selectType">
          <Button type="primary">
            {{typeName ? typeName : "选择类别" }}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list" v-for="(item,index) in typeList" :key="index">
            <DropdownItem :name="item">{{item}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown :style="{margin: '0 10px 10px 5px'}" @on-click="selectLanguage">
          <Button type="primary">
            {{languageName ? languageName : "选择语言" }}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list" v-for="(item,index) in languageList" :key="index">
            <DropdownItem :name="item">{{item}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown :style="{margin: '0 10px 10px 5px'}" @on-click="selectStatus">
          <Button type="primary">
            {{statusName ? statusName : "选择状态" }}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list" v-for="(item,index) in statusList" :key="index">
            <DropdownItem :name="item">{{item}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button :style="{marginLeft:'5px'}" type="primary" @click="selectAll">全部信息</Button>
        <Button :style="{marginLeft:'15px'}" type="primary" @click="bookAdd=true">添加新书</Button>
        <Input
          v-model="bookname"
          :style="{width: 'auto',marginLeft: '15px'}"
          search
          enter-button
          placeholder="搜索书名..."
          @on-search="searchName"
        />
      </div>

      <Table border :columns="columns" :data="showdata"></Table>
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
    </div>

    <Modal v-model="bookDetail" width="500">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>修改书籍</span>
      </p>
      <div>
        <BookDetail
          @toParent="selectAll"
          @closeMod="closeMod"
          :bookDatas="boodataAsync"
          :typeList="typeList"
          :languageList="languageList"
          :statusList="statusList"
          v-if="JSON.stringify(boodataAsync) !== '{}'"
        ></BookDetail>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="bookAdd" width="500">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>添加书籍</span>
      </p>
      <div>
        <BookAdd
          @toParent="selectAll"
          @closeMod="closeMod"
          v-if="bookAdd"
          :typeList="typeList"
          :languageList="languageList"
          :statusList="statusList"
        ></BookAdd>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import BookDetail from "@/components/bookinfo/bookdetail";
import BookAdd from "@/components/bookinfo/bookadd";
import { getBook, delBook } from "@/api/index.js";
import axios from "axios";

export default {
  components: {
    BookDetail,
    BookAdd
  },
  data() {
    return {
      isLoading: true,//进度条
      bookDetail: false,//是否显示编辑图书
      bookAdd: false,//是否显示添加图书
      boodataAsync: {}, //书籍详情数据
      columns: [
        {
          title: "ID",
          key: "id",
          align: "center"
        },
        {
          title: "书名",
          key: "name",
          align: "center"
        },
        {
          title: "类别",
          key: "type",
          align: "center"
        },
        {
          title: "语言",
          key: "language",
          align: "center"
        },
        {
          title: "价格(¥)",
          key: "price",
          align: "center"
        },
        {
          title: "库存",
          key: "number",
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          render: (h, params) => {
            if (params.row.status == "已上架") {
              return h("p", { style: { color: "green" } }, params.row.status);
            } else {
              return h("p", { style: { color: "red" } }, params.row.status);
            }
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
                      // console.log(params.row)
                      this.boodataAsync = JSON.parse( JSON.stringify(params.row)) ;//深拷贝,防止数据串联修改
                      this.bookDetail = true;
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示",
                        content: "<p>你确定要删除吗?</p>",
                        onOk: () => {
                          delBook({ id: params.row.id }).then(res => {
                            if (res.code == 1) {
                              this.$Message.success(res.msg);
                              this.selectAll();
                            } else {
                              this.$Message.error(res.msg);
                            }
                          });
                        },
                        onCancel: () => {}
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      bookdata: [], //当前全部数据
      showdata: [], //当前页展示数据
      showAlldata: [], //当前全部展示数据

      //分页
      currentPage: 1,
      total: 0,
      pageSize: 8,

      //筛选
      typeList: [], //类别列表
      typeName: null, //类别显示
      languageList: [], //语言列表
      languageName: null, //语言显示
      statusList: [], //状态列表
      statusName: null, //状态显示
      bookname: null //搜索书名
    };
  },
  mounted() {
    this.getBook();
    window.onresize = () => {
      this.checkHeight();
    };
  },
  methods: {
    closeMod() {
      this.bookDetail = false;
      this.bookAdd = false;
    },
    getBook() {
      this.closeMod();
      getBook().then(res => {
        // console.log(res);
        this.bookdata = res;
        this.Initial();
      });
    },
    checkHeight() {
      var H = document.body.clientHeight;
      H < 700 ? (this.pageSize = 8) : (this.pageSize = 10);
      this.changePage(1);
    },
    Initial() {
      this.checkHeight();
      this.getData(this.bookdata);
      this.isLoading = false;
      this.bookdata.map((item, index) => {
        //类别列表
        if (this.typeList.indexOf(item.type) == -1) {
          this.typeList.push(item.type);
        }
        //语言列表
        if (this.languageList.indexOf(item.language) == -1) {
          this.languageList.push(item.language);
        }
        //状态列表
        if (this.statusList.indexOf(item.status) == -1) {
          this.statusList.push(item.status);
        }
      });
    },
    getData(data) {
      this.showAlldata = data;
      this.total = this.showAlldata.length;
      this.currentPage = 1;
      this.changePage(1);
    },
    changePage(index) {
      var start = (index - 1) * this.pageSize;
      var end = start + this.pageSize;
      this.showdata = this.showAlldata.slice(start, end);
    },
    selectType(name) {
      this.InitialList();
      this.typeName = name;
      this.getData(this.bookdata.filter(item => item.type == name));
    },
    selectLanguage(name) {
      this.InitialList();
      this.languageName = name;
      this.getData(this.bookdata.filter(item => item.language == name));
    },
    selectStatus(name) {
      this.InitialList();
      this.statusName = name;
      this.getData(this.bookdata.filter(item => item.status == name));
    },
    selectAll() {
      this.isLoading = true;
      this.getBook();
      this.InitialList();
    },
    InitialList() {
      //初始化选择列表项信息
      this.typeName = null;
      this.languageName = null;
      this.statusName = null;
      this.bookname = null;
      this.currentPage = 1;
    },
    searchName() {
      if (this.bookname) {
        let arr = this.bookdata.filter(
          item => item.name.indexOf(this.bookname) > -1
        );
        if (arr.length <= 0) {
          this.$Message.error("没有找到相关书籍!");
        } else {
          this.typeName = null;
          this.languageName = null;
          this.statusName = null;
          this.getData(arr);
        }
      } else {
        this.$Message.error("内容为空!");
      }
    }
  }
};
</script>

<style scoped >
.loading {
  padding-top: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo-spin-col {
  font-size: 22px;
  height: 100px;
  position: relative;
}
.demo-spin-icon-load {
  font-size: 30px;
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.main {
  padding: 10px;
  box-sizing: border-box;
}
.toplist {
  display: flex;
}
.page {
  text-align: center;
  margin: 10px 0;
}
</style>