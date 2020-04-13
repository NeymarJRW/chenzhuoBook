<template>
  <div>
    <div class="main">
      <div class="item">
        书名:
        <Input v-model="bookDatas.name" placeholder="Enter something..." style="width: 300px" />
      </div>
      <div class="item">
        类别:
        <Select v-model="bookDatas.type" style="width:300px">
          <Option v-for="(item,index) in typeList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>
      <div class="item">
        语言:
        <Select v-model="bookDatas.language" style="width:300px">
          <Option v-for="(item,index) in languageList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>
      <div class="item">
        价格:
        <InputNumber
          :max="1000"
          :min="1"
          v-model="bookDatas.price"
          placeholder="输入价格..."
          style="width: 300px"
        ></InputNumber>
      </div>
      <div class="item">
        数量:
        <InputNumber
          :max="1000"
          :min="1"
          v-model="bookDatas.number"
          placeholder="输入数量..."
          style="width: 300px"
        ></InputNumber>
      </div>
      <div class="item">
        状态:
        <Select v-model="bookDatas.status" style="width:300px">
          <Option v-for="(item,index) in statusList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>
      <div class="item">
        <Button :style="{marginRight:'20px'}" @click="closeWin">取消</Button>
        <Button type="primary" @click="editData">确定</Button>
      </div>
    </div>
  </div>

  <!-- <div></div> -->
</template>

<script>
import { editBook } from "@/api/index";
export default {
  // name:bookDetail
  props: {
    bookDatas: Object,
    typeList: Array,
    languageList: Array,
    statusList: Array
  },
  data() {
    return {

    };
  },

  methods: {
    closeWin() {
      this.$emit("closeMod");
    },
    editData() {
      for (var o in this.bookDatas) {
        if (o != "price" && o != "number") {
          if (this.bookDatas[o].length == 0) {
            return;
          }
        }
      }
      editBook(this.bookDatas).then(res => {
        if (res.code == 1) {
          this.$Message.success(res.msg);
        } else {
          this.$Message.error(res.msg);
        }
        this.$emit("toParent");
      });
    }
  },
  mounted() {

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