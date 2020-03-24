import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import $ from "jquery";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
    strict: true,
    state:{
        isLoading: false,
        products:[],
        pagination:{},
    },
    actions:{
        updateLoading(context, status){
            context.commit('LOADING', status);
        },
        getProducts(context,page=1) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
            context.commit('LOADING', true);
            axios.get(api).then(response => {
              context.commit('PRODUCTS', response.data.products);
              context.commit('PAGINATION', response.data.pagination);
              context.commit('LOADING', false);
            });
          },
    },
    mutations:{
        LOADING(state, status){
            state.isLoading = status;
        },
        PRODUCTS(state, status){
            state.products = status;
        },
        PAGINATION(state, status){
            state.pagination = status;
        },
    },

});