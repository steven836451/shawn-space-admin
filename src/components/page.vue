<template>
    <div>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled' : !pageData.has_pre}">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pageData.current_page-1)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="page in pageData.total_pages" :key="page"
                :class="{'active' : pageData.current_page === page}">
                    <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a></li>
                <li class="page-item" :class="{'disabled' : !pageData.has_next}">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pageData.current_page+1)">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    props:['pageData'],
    methods:{
        getProducts(page){
            this.$emit('pages',page);
        }
    }
}
</script>