<template>
  <div class="main">
    <div class="item">
      借阅人:
      <Input disabled  v-model="userData.name" placeholder="输入书名..." style="width: 300px" />
    </div>
    <div class="item">
      学 号:
      <Input disabled type="number" v-model="userData.schoolNumber" placeholder="输入学号..." style="width: 300px" />
    </div>
    <div class="item">
      联系方式:
      <Input  type="number" v-model="userData.phoneNumber" placeholder="输入联系方式..." style="width: 300px" />
    </div>
    <div class="item">
      专 业:
      <Select v-model="userData.major" style="width:300px">
        <Option v-for="(item,index) in allMajor" :value="item" :key="index">{{ item }}</Option>
      </Select>
    </div>
    <div class="item">
      借阅书名:
      <Select v-model="userData.bookName" filterable style="width:300px">
        <Option v-for="(item,index) in bookNameList" :value="item" :key="index">{{ item }}</Option>
      </Select>

    </div>

    <div class="item">
      借阅时间:
      <DatePicker
        v-model="userData.date"
        type="date"
        placeholder="Select date"
        style="width: 300px"
        @on-change="getDate"
        :options="dateOptions"
      ></DatePicker>
    </div>
    <div class="item">
      <Button :style="{marginRight:'20px'}" @click="closeWin">取消</Button>
      <Button type="primary" @click="editData">确定</Button>
    </div>
  </div>
</template>

<script>
import { getBook,editUserData } from "@/api/index";

export default {
  props: {
    userData: Object
  },
  data() {
    return {
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      allMajor: [
        "信息技术学院",
        "数学科学学院",
        "物理学院",
        "音乐学院",
        "外国语学院",
        "体育学院",
        "文学院",
        "商学院",
        "生命科学学院",
        "历史文化学院",
        "新闻与传播学院"
      ],
      bookNameList: [],
      currentDate: "",
      dateFlag: true
    };
  },
  created() {
    this.currentDate = this.userData.date;
  },
  watch: {
    userData(val) {
      this.dateFlag = true;
      this.currentDate = val.date;
    }
  },
  mounted() {
    getBook().then(res => {
      res.map(item => this.bookNameList.push(item.name));
      // console.log(this.bookNameList);
    });
  },
  methods: {
    getDate(i) {
      this.dateFlag = false;
      this.userData.date = i;
    },
    editData() {
      if (this.dateFlag) {
        //没有修改日期
        this.userData.date = this.currentDate;
      }
      if(this.userData.schoolNumber.length!=9){
        this.$Message.error("学号格式应为9位数字!");
        return;
      }
      if(this.userData.phoneNumber.length!=11){
        this.$Message.error("联系方式应为11位数字!");
        return;

      }
      editUserData(this.userData).then(res=>{
       if (res.code == 1) {
          this.$Message.success(res.msg);
        } else {
          this.$Message.error(res.msg);
        }
       this.$emit("toParent");
      })
    },
    closeWin() {
       this.$emit("closeWin");
    }
  }
};
</script>

<style scoped>
.main {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.main .item {
  margin-bottom: 20px;
}
</style>