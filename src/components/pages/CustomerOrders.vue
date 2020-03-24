<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-3 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm" >
          <div style="height: 400px; background-size: cover; background-position: center"
            :style="{backgroundImage: `url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <h6 class="text-dark">{{item.description}}</h6>
            <!-- <p class="card-text">{{item.content}}</p> -->
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <div class="h5" v-if="!item.origin_price">{{ item.price | currency }}</div>
              <del class="h6" v-if="item.origin_price">>原價 {{ item.origin_price | currency }} 元</del>
              <div class="h5" v-if="item.origin_price">現在只要 {{ item.price | currency }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addtoCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- modal -->

    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <h5 class="text-dark">{{product.description}}</h5>
              <!-- <pre class="blockquote-footer text-left">{{ product.content }}</pre> -->
              <footer class="blockquote-footer text-left">
                <pre>{{ product.content }}</pre>
              </footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.origin_price">{{ product.price | currency }} 元</div>
              <del class="h6" v-if="product.origin_price">原價 {{ product.origin_price | currency }} 元</del>
              <div class="h4" v-if="product.origin_price">現在只要 {{ product.price | currency }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * (product.price || product.origin_price) }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addtoCart(product.id, product.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === product.id"></i>
              <!-- v-if="product.id === status.loadingItem" -->
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <Page :page-data="pagination" @pages="getProducts"></Page>

    <hr />
    <h3 class="text-center">購物清單</h3>
    <div class="my-5 row justify-content-center">
      <div class="my-5 row justify-content-center">
        <table class="table mt-3">
          <thead>
            <tr>
              <th></th>
              <th class="align-middle text-left">品名</th>
              <th class="align-middle text-center">單價</th>
              <th>數量</th>
              <th class="align-middle text-center">價格</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in carts.carts" :key="item.id">
              <td>
                <div>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="deleteCart(item.id)"
                  >
                    <i class="far fa-trash-alt"></i>
                  </button>
                </div>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>

              <td class="align-middle text-right" >{{ item.product.price | currency}}</td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.total | currency }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right">總計</td>
              <td class="text-right">{{ carts.total | currency }}</td>
            </tr>
            <tr v-if="carts.final_total !== carts.total">
              <td colspan="4" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ carts.final_total | currency }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
          </div>
        </div>
      </div>
    </div>

    <div class="my-5 row justify-content-center">
        <form class="col-md-5" @submit.prevent="createOrder">
          <div class="form-group">
            <label for="useremail">Email</label>
            <input
              type="email"
              class="form-control"
              :class="{'is-invalid' : errors.has('email')}"
              name="email"
              id="useremail"
              v-model="form.user.email"
              v-validate="'required|email'"
              placeholder="請輸入 Email"  
            />
            <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
          </div>

          <div class="form-group">
            <label for="username">收件人姓名</label>
            <input
              type="text"
              class="form-control"
              :class="{'is-invalid' : errors.has('name')}"
              name="name"
              id="username"
              v-model="form.user.name"
              v-validate="'required'"
              placeholder="輸入姓名"
            />
            <span class="text-danger" v-if="errors.has('name')">姓名欄位不得為空</span>
          </div>

          <div class="form-group">
            <label for="usertel">收件人電話</label>
            <input
              type="tel"
              class="form-control"
              :class="{'is-invalid' : errors.has('tel')}"
              id="usertel"
              name="tel"
              v-model="form.user.tel"
              v-validate="'required'"
              placeholder="請輸入電話"
            />
            <span class="text-danger" v-if="errors.has('tel')">電話欄位不得留空</span>
          </div>

          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <input
              type="text"
              class="form-control"
              :class="{'is-invalid' : errors.has('address')}"
              name="address"
              id="useraddress"
              v-model="form.user.address"
              v-validate="'required'"
              placeholder="請輸入地址"
            />
            <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
          </div>

          <div class="form-group">
            <label for="comment">留言</label>
            <textarea
              name
              id="comment"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </div>
  </div>
</template>


<script>
import $ from "jquery";
import Page from '../page'

export default {
  components:{
    Page
  },
  data() {
    return {
      // products: [],
      product: {},
      // pagination:{},
      status: {
        loadingItem: ""
      },
      form:{
        user:{
          name:'',
          email:'',
          tel:'',
          address:'',
        },
        message:''
      },
      carts: [],
      // isLoading: false,
      coupon_code: "",
    };
  },
  methods: {
    getProducts( page=1) {
      this.$store.dispatch('getProducts', page);
    },
    getProduct(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      const vm = this;
      vm.status.loadingItem = id;
      this.$http.get(api).then(response => {
        // console.log(response);
        vm.product = response.data.product;
        vm.product.num = 1;
        $("#productModal").modal("show");
        vm.status.loadingItem = "";
      });
    },
    addtoCart(id, qty = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty
      };
      this.$http.post(api, { data: cart }).then(response => {
        // console.log(response);
        vm.status.loadingItem = "";
        vm.getCart();
        $("#productModal").modal("hide");
      });
    },
    getCart() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.$store.dispatch('updateLoading' ,true);
      this.$http.get(api).then(response => {
        // console.log(response);
        vm.carts = response.data.data;
        vm.$store.dispatch('updateLoading' ,false);
      });
    },
    deleteCart(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      const vm = this;
      vm.$store.dispatch('updateLoading' ,true);
      this.$http.delete(api).then(() => {
        vm.getCart();
        vm.$store.dispatch('updateLoading' ,false);
      });
    },
    addCouponCode() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const vm = this;
      const coupon = {
        code: vm.coupon_code
      };
      vm.$store.dispatch('updateLoading' ,true);
      this.$http.post(api, { data: coupon }).then(response => {
        // console.log(response);
        vm.getCart();
        vm.$store.dispatch('updateLoading' ,false);
      });
    },
    createOrder(){
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const vm = this;
      const order = vm.form;
      vm.$store.dispatch('updateLoading' ,true);
      this.$validator.validate().then((result) => {
        if(result){
          this.$http.post(url, { data: order }).then(response => {
            console.log('訂單已建立', response);
            if(response.data.success){
              vm.$router.push(`/Dashboard/customer_checkout/${response.data.orderId}`)
            }
            vm.$store.dispatch('updateLoading' ,false);
          });
        } else {
          console.log('欄位不完整')
          vm.$store.dispatch('updateLoading' ,false);
        }
      });     
    }
  },
  computed: {
    isLoading(){
      return this.$store.state.isLoading;
    },
    products(){
      return this.$store.state.products;
    },
    pagination(){
      return this.$store.state.pagination;
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>