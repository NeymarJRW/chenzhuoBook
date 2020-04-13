<template>
  <div>
    <div class="main">
      <!-- {{bookDatas}} -->
      <div class="item">
        书名:
        <Input v-model="addDataObj.name" placeholder="输入书名..." style="width: 300px" />
      </div>
      <div class="item">
        类别:
        <Select v-model="addDataObj.type" style="width:300px">
          <Option v-for="(item,index) in typeList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>
      <div class="item">
        语言:
        <Select v-model="addDataObj.language" style="width:300px">
          <Option v-for="(item,index) in languageList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>
      <div class="item">
        价格:
        <!-- <Input v-model="price" placeholder="输入价格..." style="width: 300px" /> -->
        <InputNumber
          :max="1000"
          :min="1"
          v-model="addDataObj.price"
          placeholder="输入价格..."
          style="width: 300px"
        ></InputNumber>
      </div>
      <div class="item">
        数量:
        <InputNumber
          :max="1000"
          :min="1"
          v-model="addDataObj.number"
          placeholder="输入数量..."
          style="width: 300px"
        ></InputNumber>
      </div>
      <div class="item">
        状态:
        <Select v-model="addDataObj.status" style="width:300px">
          <Option v-for="(item,index) in statusList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>
      <div class="item">
        <Button :style="{marginRight:'20px'}" @click="closeWin">取消</Button>
        <Button type="primary" @click="addData">确定</Button>
      </div>
    </div>
  </div>

  <!-- <div></div> -->
</template>

<script>
import { addBook } from "@/api/index";
export default {
  // name:bookDetail
  props: {
    // bookDatas: Object,
    typeList: Array,
    languageList: Array,
    statusList: Array
  },
  data() {
    return {
      addDataObj: {
        name: "",
        type: "",
        language: "",
        price: 0,
        number: 0,
        status: ""
      }
    };
  },
  watch: {
    bookDatas(val) {
      // this.name = val.name;
      // this.type = val.type;
      // this.language = val.language;
      // this.price = val.price;
      // this.number = val.number;
      // this.status = val.status;
    }
  },
  methods: {
    closeWin() {
      this.$emit("closeMod");
    },
    addData() {
      for (var o in this.addDataObj) {
        if (o != "price" && 0 != "number") {
          if (this.addDataObj[o].length == 0) {
        this.$Message.error("信息填写不完整!");

            return;
          }
        }
      }
      if (this.addDataObj.price > 0 && this.addDataObj.number > 0) {
        addBook(this.addDataObj).then(res => {
          if (res.code == 1) {
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
          this.$emit("toParent");
        });
      } else {
        this.$Message.error("书本价格或数量应大于0");
      }
      // if(this.name && this.type && this.language && this.price && this.number && this.status){

      // });
      // }else{
      // }
    }
  },
  mounted() {}
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