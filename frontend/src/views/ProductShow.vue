<template>
    <div id="show">
        <v-card tile flat class="mb-4">
            <v-carousel :height="300" hide-delimiter-background 
                :touchless="true"
                :show-arrows="isHidden">
                <v-carousel-item v-for="(image, i) in product.images" :key="i">
                    <v-img :src="image.url" height="300" contain></v-img>
                </v-carousel-item>
            </v-carousel>
            <v-container class="pt-0">
                <v-card-title class="headline font-weight-medium py-2 px-0">{{ product.name }}</v-card-title>

                <div class="d-flex justify-space-between mb-2">
                    <div class="display-1">¥ {{ product.price }}</div>
                    <div>
                        <a :href="tweetURL"
                            class="twitter-share-button">
                            <v-icon color="primary" :size="40">
                                mdi-twitter-box
                            </v-icon>
                        </a>
                        <v-btn outlined rounded @click="like" class="ml-3">
                            <v-icon left :color="favoriteColor">favorite</v-icon> いいね
                        </v-btn>
                        <span class="ml-3">{{ product.likes_count }}</span>
                    </div>
                </div>

                <v-btn color="error" block samll 
                    @click="$router.push(`/payment/${product.id}`)"
                    v-if="!seller && open">
                    購入手続きへ進む
                </v-btn>
                <v-btn color="error" block samll v-if="seller && open"
                    @click="$router.push(`/sell/${$route.params.id}/edit`)" >
                    商品の編集
                </v-btn>
                <v-btn color="error" block samll v-if="(seller || buyer) && trading"
                    @click="$router.push(`/product/${$route.params.id}/trade`)">
                    取引画面
                </v-btn>
                <v-btn color="error" block samll v-if="soldOut" disabled>売り切れ</v-btn>

            </v-container>

            <v-sheet tile color="grey lighten-3" height="30" class="d-flex align-center">
                <v-container>
                    <p class="font-weight-bold py-0 ma-0">商品の情報</p>
                </v-container>
            </v-sheet>
            <v-simple-table>
                <tbody>
                    <tr>
                        <td>商品状態</td>
                        <td>{{ product.state }}</td>
                    </tr>
                    <tr>
                        <td>カテゴリー</td>
                        <td><v-breadcrumbs  class="px-0" :items="categories" divider=">"></v-breadcrumbs></td>
                    </tr>
                </tbody>
            </v-simple-table>

            <v-sheet tile color="grey lighten-3" height="30" class="d-flex align-center">
                <v-container>
                    <p class="font-weight-bold py-0 ma-0">商品の説明</p>
                </v-container>
            </v-sheet>
            <v-sheet>
                <div class="pa-3">{{ product.description }}</div>
            </v-sheet>

            <v-sheet tile color="grey lighten-3" height="30" class="d-flex align-center">
                <v-container>
                    <p class="font-weight-bold py-0 ma-0">商品者</p>
                </v-container>
            </v-sheet>
            <v-list class="pa-0" flat>
                    <v-list-item @click="$router.push(`/u/${product.seller_id}`)">
                        <v-list-item-avatar>
                            <v-img :src="product.seller.avatar.url"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title v-text="product.seller.name"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
            </v-list>
        </v-card>
        <v-card tile>
            <v-container>
                <v-sheet tile flat>
                    
                </v-sheet>
                <v-card tile flat v-for="comment in comments" :key="comment.id">
                    <v-row>
                        <v-col :cols="2">
                            <v-avatar :size="40" class="mt-4">
                                <img :src="comment.user.avatar.url" alt="avatar">
                            </v-avatar>
                        </v-col>
                        <v-col :cols="10" class="pl-0">
                            <p class="mb-1">{{ comment.user.name }}</p>
                            <v-sheet class="grey lighten-3 pa-2 comment">
                                {{ comment.content }}
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card>
                <v-textarea v-model="content" outlined placeholder="分からないことなど質問しよう！"></v-textarea>
                <v-btn color="error" block samll @click="comment" :disabled="!open">コメントする</v-btn>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import request from '../utils/api.js'

export default {
    name: 'productShow',
    data(){
        return {
            isHidden: true,
            product: {
                seller: {
                    name: '',
                    avatar: { url: '' }
                },
                category:{
                    name:'',
                    path: []
                }
            },
            liked: false,
            comments: [],
            //commentの内容
            content: '',
            //breadcrumbsリスト用の配列
            category: []
        }
    },
    computed: {
        //ログイン中のユーザーの出品商品かどうか
        seller(){
            return this.$store.state.user.user.id === this.product.seller_id
        },
        //ログイン中のユーザーの購入商品かどうか
        buyer(){
            return this.$store.state.user.user.id == this.product.buyer_id
        },
        open(){
            return this.product.status == "open"
        },
        //取引中かどうか
        trading(){
            return this.product.status == "trade"
        },
        //取引終了している商品かどうか
        soldOut(){
            return this.product.status == "close"
        },
        categories(){
            const categories = []
            this.product.category.path.forEach(c => {
                categories.push({ text: c.name })
            })
            return categories
        },
        favoriteColor(){
            return this.liked ? 'red' : 'grey'
        },
        tweetURL(){
            const url = `https://unima.netlify.com/product/${this.$route.params.id}`
            const encodedUrl = encodeURIComponent(url)
            return `https://twitter.com/intent/tweet?text=${this.product.name}(¥${this.product.price})を『Unima』で販売中！%0a&url=${url}`
        }
    },
    created(){
        //商品情報を取得
        request.get(`/api/v1/products/${this.$route.params.id}`, {auth: true})
            .then( response => {
                console.log(response)
                const data = response.data
                if(data.product.images.length === 1){
                    this.isHidden = false
                }
                this.product = data.product
                this.liked = data.like
                this.comments = data.comments
            })
            .catch( error => {
                this.$router.push('/')
                console.log('error')
            })
    },
    methods: {
        like(){
            if(this.liked){
                request.delete(`/api/v1/products/${this.product.id}/likes`, { auth: true })
                .then( response => {
                    console.log(response.data)
                    this.product.likes_count = response.data.likes_count
                    this.liked = false
                })
                .catch(error => {
                    console.log('error')
                })
            }else{
                request.post(`/api/v1/products/${this.product.id}/likes`, { auth: true })
                .then(response => {
                    console.log(response.data)
                    this.product.likes_count = response.data.likes_count
                    this.liked = true
                })
                .catch(error => {
                    console.log('error')
                })
            }
        },
        comment(){
            request.post(`/api/v1/products/${this.product.id}/comments`, { auth: true, params: { content: this.content} })
                .then( response => {
                    this.content = ''
                    this.comments.push(response.data.comments)
                    if(this.$store.state.user.user.id === this.product.seller_id) return
                    const recipientId = this.product.seller_id
                    const productId = this.product.id
                    this.$store.commit('sendNotification', { recipientId, productId, action: 'comment' })
                })
                .catch(error => {
                    console.log('error')
                })
        },
        deleteComment(id, index){
            request.delete(`/api/v1/products/${this.product.id}/comments/${id}`, { auth: true })
                .then( response => {
                    this.comments.splice(index, 1)
                })
                .catch(error => {
                    console.log('error')
                })
        },
    }
}
</script>

<style>
.product-toolbar{
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
}

.comment{
    border-radius: 10px;
}

.comment:after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 3px; 
    left: -19px;
    border: 8px solid transparent;
    border-right: 18px solid #edf1ee;
    -webkit-transform: rotate(35deg);
    transform: rotate(35deg);
}

.twitter-share-button{
    text-decoration: none;
}
</style>

