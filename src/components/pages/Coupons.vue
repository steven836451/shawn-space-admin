<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="couponModal(true)">建立新的優惠券</button>
    </div>

    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ item.due_date | dateTransfer}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td>
            <div>
              <button class="btn btn-outline-primary btn-sm" @click="couponModal(false, item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="delCouponModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Page :page-data="pagination" @pages="getCoupons"></Page>

    <!-- couponModal -->

    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="col-sm-12">
              <div class="form-group">
                <label for="title">標題</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="coupon.title"
                  placeholder="請輸入標題"
                />
              </div>
              <div class="form-group">
                <label for="title">優惠碼</label>
                <input
                  type="text"
                  class="form-control"
                  id="code"
                  v-model="coupon.code"
                  onkeyup="value=value.replace(/[\W]/g,'') "
                  placeholder="請輸入優惠碼"
                />
              </div>
              <div class="form-group">
                <label for="title">到期日</label>
                <input
                  type="date"
                  class="form-control"
                  id="due_date"
                  v-model="coupon.due_date"
                  placeholder="請輸入到期日"
                />
              </div>
              <div class="form-group">
                <label for="title">折扣百分比</label>
                <input
                  type="number"
                  class="form-control"
                  id="percent"
                  v-model="coupon.percent"
                  onkeyup="value=value.replace(/[^\d]/g,'') " 
                  min="0" max="100"
                  value="100"
                  placeholder="請輸入折扣百分比"
                />
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="coupon.is_enabled"
                    :true-value="1"
                    :false-value="0"
                    id="is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled">是否啟用</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="addCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>
<!-- removeModal -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ coupon.title }}</strong> 優惠券(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="removeCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from "jquery";
import Page from '../page';

export default {
  components:{
    Page,
  },
  data() {
    return {
      coupons: [],
      coupon: {},
      pagination:{},
      isNew: false,
      isLoading: false,
    };
  },
  methods: {
    getCoupons(page =1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        vm.pagination = response.data.pagination;
        vm.coupons = response.data.coupons;
        vm.isLoading = false;
      });
    },
    couponModal(isNew, item) {
        if(isNew){
            this.coupon = {};
            this.isNew = true;
        } else {
            this.coupon = item;
            this.isNew = false;
        }
      $("#couponModal").modal("show");
    },
    delCouponModal(item){
        this.coupon = Object.assign({}, item);
        $("#delCouponModal").modal("show");
    },
    addCoupon() {
      this.coupon.due_date = Math.floor(new Date(this.coupon.due_date) / 1000);
      // console.log(this.coupon.due_date);
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      let httpMethods = "post";
      const vm = this;
      if(!vm.isNew){
          api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.coupon.id}`;
          httpMethods = "put";
      }
      vm.isLoading = true;
      this.$http[httpMethods](api, { data: vm.coupon }).then(response => {
        // console.log(response.data.message);
        $("#couponModal").modal("hide");
        vm.getCoupons();
        vm.isLoading = false;
      });
    },
    removeCoupon(){
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${this.coupon.id}`;
        const vm = this;
        vm.isLoading = true;
        this.$http.delete(api).then((response) => {
            // console.log(response.data);
            $("#delCouponModal").modal("hide");
            this.getCoupons();
            vm.isLoading = false;
        });
    },
  },
  created() {
    this.getCoupons();
  }
};
</script>