<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <td>{{item.create_at | dateTransfer}}</td>
          <td>{{item.user.email || "email@gmail.com"}}</td>
          <td>
            <p
              v-for="(product) in item.products"
              :key="product.id"
            >{{ product.product.title}} 數量 : {{ product.qty}} {{ product.product.unit}}</p>
          </td>
          <td>{{ item.total | currency}}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else class="text-danger">尚未付款</span>
          </td>
        </tr>
      </tbody>
    </table>
    <Page @pages="getPage" :page-data="pagination"></Page>
  </div>
</template>

<script>
import Page from "../page";

export default {
  components: {
    Page
  },
  data() {
    return {
      orders: [],
      order: {},
      pagination: {},
      isLoading: false
    };
  },
  methods: {
    getPage(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
        console.log(vm.orders);
        vm.isLoading = false;
      });
    },
  },
  created() {
    this.getPage();
  }
};
</script>