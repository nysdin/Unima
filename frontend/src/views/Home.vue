<template>
  <div class="home">
    <Display :products="products" />
    <!-- <v-container fluid>
      <v-row dense>
        <v-col :cols="4" v-for="product in products" :key="product.id">
          <v-card outlined class="product" @click="showProduct(product.id)">

            <v-img  aspect-ratio="1"
              :src="product.images[0].url"
            ></v-img>
            
            <v-card-title class="px-1 pt-1 pb-0 font-weight-regular subtitle-2">
              <p class="omission mb-0">{{ product.name }}</p>
            </v-card-title>

            <v-card-text class="px-1 pt-0 pb-1">
              <div class="d-flex justify-space-between">
                <div class="pa-0 font-weight-regular subtitle-1">
                  ¥ {{ product.price }}
                </div>
                <div>
                  <v-icon :size="16" v-if="product.likes_count">favorite</v-icon>
                  <span class="ml-1" v-if="product.likes_count">{{ product.likes_count }}</span>
                </div>
              </div>
            </v-card-text>
            
          </v-card>
        </v-col>
      </v-row>
    </v-container> -->

  </div>
</template>

<script>
// @ is an alias to /src
import request from '../utils/api.js'
import Display from '../components/Display'

export default {
  name: 'home',
  components: {
    Display
  },
  data(){
    return {
      products: []
    }
  },
  computed: {
    items(){
      return this.$store.state.product.products
    },
    loggedIn(){
      return this.$store.state.auth.token
    }
  },
  methods: {
    logout(){
      this.$store.dispatch('auth/logout', { auth: true })
        .then( () => {
          this.$router.push('/login')
        })
    },
    showProduct(id){
      this.$router.push({ path: `/product/${id}`})
    },
  },
  created(){
    this.$store.commit('auth/apiRequest')
    request.get('/api/v1/products', {})
      .then( response => {
        console.log(response)
        this.products = response.data
        this.$store.commit('auth/apiCompleted')
      })
  }
}
</script>

<style>
.product{
  cursor: pointer;
}

.omission{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

</style>

