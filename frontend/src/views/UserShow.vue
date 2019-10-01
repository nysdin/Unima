<template>
    <div id="user-show">
        <v-card flat>
            <v-container class="py-0">
                <v-row>
                    <v-col :cols="4">
                        <div class="d-flex justify-center">
                            <v-avatar :size="80">
                                <img :src="user.avatar.url">
                            </v-avatar>
                        </div>
                        <p class="text-center subtitle-1 headline mb-0 mt-2">{{ user.name }}</p>
                    </v-col>
                    <v-col :cols="8">
                        <div class="d-flex">
                            <template v-if="currentUser">
                                <v-btn outlined small class="mt-4" v-if="currentUser"
                                    color="primary" @click="$router.push('/u/edit')">
                                    プロフィールの編集
                                </v-btn>
                            </template>
                            <template v-else>
                                <v-btn outlined small class="mt-4" v-show="!isFollowing"
                                    color="primary" @click="follow"
                                    :loading="loading" :disabled="loading">
                                    フォローする
                                </v-btn>
                                <v-btn small class="mt-4" v-show="isFollowing"
                                    color="primary" @click="unfollow"
                                    :loading="loading" :disabled="loading">
                                    フォロー中
                                </v-btn>
                            </template>
                            <a :href="tweetURL"
                                class="twitter-share-button mt-3 ml-3">
                                <v-icon color="primary" :size="40">
                                    mdi-twitter-box
                                </v-icon>
                            </a>
                        </div>
                        <template v-if="currentUser">
                            <div class="mt-4">
                                <v-row>
                                    <v-col :cols="3" class="py-0 border-right">
                                        <p class="ma-0 text-center body-2">出品</p>
                                        <p class="ma-0 text-center">{{ this.products.length }}</p>
                                    </v-col>
                                    <v-col :cols="4" class="py-0" @click="displayFollowingUser">
                                        <p class="ma-0 text-center body-2">フォロー</p>
                                        <p class="ma-0 text-center">{{ this.following.length }}</p>
                                    </v-col>
                                </v-row>
                            </div>
                        </template>
                    </v-col>
                </v-row>

                <v-dialog v-model="dialog" scrollable>
                    <v-card>
                        <v-card-title>フォロー中</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-list-item v-for="user in following"
                                :key="user.id" @click="toUserProfile(user.id)">
                                <v-list-item-avatar>
                                    <v-img :src="user.avatar.url"></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title v-text="user.name"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-container>
        </v-card>
        <v-sheet tile color="grey lighten-3" height="30">
            <p class="font-weight-bold py-0 ma-0 text-center" style="line-height: 30px;">出品した商品</p>
        </v-sheet>
        <Display :products="products" />
    </div>
</template>

<script>
import request from '../utils/api.js'
import Display from '../components/Display'

export default {
    name: 'UserShow',
    components: {
        Display
    },
    data(){
        return {
            user: {
                avatar: { url: '' }
            },
            products: [],
            following: [],
            isFollowing: false,
            loading: false,
            dialog: false,
        }
    },
    computed: {
        currentUser(){
            return this.$store.state.user.user.id === this.user.id
        },
        mypageURL(){
            return process.env.VUE_APP_API_ENDOPINT + '/u/' + this.$route.params.id
        },
        tweetURL(){
            const url = `https://unima.netlify.com/u/${this.$route.params.id}`
            const encodedUrl = encodeURIComponent(url)
            return `https://twitter.com/intent/tweet?text=大学内フリマアプリ『Unima』で販売中！%0a&url=${url}`
        },
    },
    methods: {
        follow(){
            this.loading = true
            request.post('/api/v1/relationships', {
                params: {
                    followed_id: this.$route.params.id
                },
                auth: true
            })
                .then(response => {
                    this.isFollowing = true
                    this.loading = false
                    console.log(response)
                })
                .catch(error => {
                    this.loading = false
                    console.log(error)
                })
        },
        unfollow(){
            this.loading = true
            request.delete(`/api/v1/relationships/${this.$route.params.id}`, { auth: true })
                .then(response => {
                    this.isFollowing = false
                    this.loading = false
                    console.log(response)
                })
                .catch(error => {
                    this.loading = false
                    console.log(error)
                })
        },
        toUserProfile(id){
            this.dialog = false
            this.$router.push(`/u/${id}`)
        },
        displayFollowingUser(){
            if(this.following.length){
                this.dialog = true
            }
        }
    },
    mounted(){
        request.get(`/api/v1/users/${this.$route.params.id}`, { auth: true })
            .then(response => {
                const data = response.data
                this.user = data.user
                this.products = data.products
                this.following = data.following
                this.isFollowing = data.followed
                console.log(response)
            })
            .catch( error => {
                console.log(error.response)
            })
    },
    watch: {
        '$route' (to, from){
            const id = to.params.id 
            request.get(`/api/v1/users/${id}`, { auth: true })
                .then(response => {
                    const data = response.data
                    this.user = data.user
                    this.products = data.products
                    this.following = data.following
                    this.isFollowing = data.followed
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
}
</script>

<style>
.twitter-share-button{
    text-decoration: none;
}

.border-right{
    border-right: 1px solid rgba(0, 0, 0, 0.2)
}
</style>
