<template>
  <div class="main">
    <Table border :columns="column" :data="roleData"></Table>
  </div>
</template>

<script>
import { getRole } from "@/api/index";
export default {
  data() {
    return {
      roleData: [],
      column: [
        {
          title: "管理员姓名",
          key: "name",
          align: "center"
        },
        {
          title: "性别",
          key: "sex",
          align: "center",
          render: (h, params) => {
            if (params.row.sex == 1) {
              return h("p", `男`);
            } else {
              return h("p", `女`);
            }
          }
        },
        {
          title: "职务",
          key: "work",
          align: "center"
        },
        {
          title: "联系方式",
          key: "phoneNumber",
          align: "center"
        },
        {
          title: "管理员编号",
          key: "roleNumber",
          align: "center"
        }
      ]
    };
  },
  mounted() {
    getRole().then(res => {
      console.log(res);
      this.roleData = res;
    });
  }
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style>