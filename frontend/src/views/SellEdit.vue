<template>
    <div id="sell">
        <h1>商品の編集</h1>
        <v-container>
            <v-alert
                v-model="alert"
                outlined
                type="error"
                dismissible>
                画像がありません.
            </v-alert>
            <ValidationObserver v-slot="{ invalid }">
                <v-form>
                    <v-row>
                        <v-col :cols="3" v-for="(n,i) in 4" :key="i" class="pb-0">
                            <v-sheet :width="eachSize" :height="eachSize"
                                @click="openDialog(i)">
                                    <v-icon class="camera-icon" v-show="i === photoIndex">mdi-camera</v-icon>
                                <v-img 
                                    aspect-ratio="1"
                                    v-show="previewImages[i].url"
                                    contain
                                    :src="previewImages[i].url">
                                </v-img>
                            </v-sheet>
                            <div class="text-center" v-show="previewImages[i].url">
                                <v-btn text x-small icon color="success"
                                    class="mr-3"
                                    @click="dialogs[i].dialog = true">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn 
                                    text x-small icon color="error"
                                    @click="removeImage(i)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>

                    <v-dialog v-for="(image, i) in images"
                        v-model="dialogs[i].dialog" :key="i"
                        persistent>
                        <v-card>
                            <div class="d-flex justify-center">
                                <v-card-title>商品画像を追加</v-card-title>
                            </div>
                            <div class="d-flex justify-center" ref="modalView">
                                <croppa v-model="images[i]"
                                    :width="modalImageSize" :height="modalImageSize"
                                    :placeholder="`画像${i+1}`"
                                    :initial-image="previewImages[i].url"
                                    initial-size="contain"
                                    :show-remove-button="false">
                                </croppa>
                            </div>
                            <v-card-actions class="d-flex justify-center">
                                <v-btn text @click="cancelImage(i)">キャンセル</v-btn>
                                <v-btn text @click="addImage(i)" v-show="!previewImages[i].url">
                                    <span>追加</span>
                                </v-btn>
                                <v-btn text @click="editImage(i)" v-show="previewImages[i].url">
                                    <span>完了</span>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <ValidationProvider rules="required|max:40" v-slot="{ errors, valid }">
                        <v-text-field v-model="product.name" label="商品名"
                            placeholder="商品名" required counter="40"
                            :error-messages="errors" :success="valid">
                        </v-text-field>
                    </ValidationProvider>
                    <ValidationProvider rules="required|max:1000" v-slot="{ errors, valid }">
                        <v-textarea label="商品の説明" v-model="product.description"
                            :error-messages="errors" :success="valid"
                            required counter="1000">
                        </v-textarea>
                    </ValidationProvider>
                    <ValidationProvider rules="required|price" v-slot="{ errors, valid }">
                        <v-text-field v-model="product.price" label="商品の価格(~300,000)"
                            placeholder="価格" required prefix="¥" type="number"
                            :error-messages="errors" :success="valid">
                        </v-text-field>
                    </ValidationProvider>
                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                        <v-select :items="categoris" v-model="product.category.name"
                            label="カテゴリー" required
                            :error-messages="errors" :success="valid">
                        </v-select>
                    </ValidationProvider>
                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                        <v-select :items="states" v-model="product.state"
                            label="商品の状態" required
                            :error-messages="errors" :success="valid">
                        </v-select>
                    </ValidationProvider>

                    <v-btn medium outlined @click="update" 
                        :disabled="invalid || loading" color="primary">
                        編集する
                    </v-btn>
                    <v-btn medium outlined @click="destroy"
                        :disabled="loading" color="primary" class="ml-2">
                        削除する
                    </v-btn>
                </v-form>
            </ValidationObserver>
        </v-container>
    </div>
</template>

<script>
import Vue from 'vue'
import request from '../utils/api.js'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
    name: 'sell',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data(){
        return{
            loading: false,
            alert: false,
            photoIndex: 0,
            size: window.innerWidth,
            dialogs: [
                { dialog: false },
                { dialog: false },
                { dialog: false },
                { dialog: false },
            ],
            product: {
                category: {
                    name: ''
                }
            },
            category: '',
            images: [{}, {}, {}, {}],
            previewImages: [
                { url: '', index: null },
                { url: '', index: null },
                { url: '', index: null },
                { url: '', index: null },
            ],
            removeId: [],
            categoris: [ '一般', '文系', '理系'],
            states: ['新品、未使用', '目立った傷や汚れなし', 'やや傷れや汚れあり', '全体的に状態が悪い']
        }
    },
    computed: {
        eachSize(){
            return (this.size - 100 ) / 4
        },
        modalImageSize(){
            return (window.innerWidth - 48) * 0.8
        }
    },
    methods: {
        async update(){
            if(!this.previewImages[0].url){
                console.log('image empty')
                this.alert = true
                return
            }
            this.loading = true
            const params = new FormData()
            const product = this.product
            params.append('name', product.name)
            params.append('description', product.description)
            params.append('price', product.price)
            params.append('state', product.state)
            params.append('category', product.category)
            for(let image of this.images){
                if(Object.keys(image).length){
                    const blob = await image.promisedBlob()
                    console.log(blob)
                    const file = image.getChosenFile()
                    if(file)　params.append('images[]', blob, file.name)
                }
            }
            this.removeId.forEach( value => {
                params.append('remove_ids[]', value)
            })
            request.patch(`/api/v1/products/${this.$route.params.id}`, {
                params: params,
                auth: true,
            })
                .then( response => {
                    this.loading = false
                    this.$router.push({ path: `/product/${response.data.id}` })
                })
                .catch( error => {
                    this.loading = false
                    console.log('error')
                })
        },
        destroy(){
            this.loading = true
            request.delete(`/api/v1/products/${this.$route.params.id}`, { params: this.product, auth: true })
                .then( () => {
                    this.loading = false
                    this.$router.push({ path: '/' })
                })
                .catch( () => {
                    this.loading = false
                    console.log('error')
                })
        },
        handleResize(){
            this.size = window.innerWidth
        },
        editImage(index){
            this.dialogs[index].dialog = false
            const image = this.images[index]
            const url = image.generateDataUrl()
            const preview = this.previewImages[index]
            preview.url = url
            if(preview.index >= 0) {
                this.removeId.push(preview.index)
                preview.index = null
                
            }
            console.log(this.images)
        },
        addImage(index){
            this.dialogs[index].dialog = false
            const image = this.images[index]
            if(image.hasImage()){
                const url = image.generateDataUrl()
                this.previewImages[index].url = url
                this.photoIndex++
            }
        },
        removeImage(index){
            const image = this.images[index]
            const preview = this.previewImages[index]
            if(Object.keys(image).length) image.remove()
            if(preview.index >= 0) this.removeId.push(preview.index)
            preview.url = ''
            preview.index = null
            this.photoIndex--
        },
        cancelImage(index){
            this.dialogs[index].dialog = false
        },
        openDialog(index){
            if(index === this.photoIndex){
                this.dialogs[index].dialog = true
            }
        }
    },
    created(){
        this.$store.commit('auth/apiRequest')
        request.get(`/api/v1/products/${this.$route.params.id}`, {})
            .then( response => {
                if(this.$store.state.user.user.id === response.data.product.seller_id){
                    console.log(response)
                    const product = response.data.product
                    this.product = product
                    product.images.forEach( (image, index) => {
                        this.previewImages[index].url = image.url
                        this.previewImages[index].index = index
                        this.photoIndex++
                    })
                    this.$store.commit('auth/apiCompleted')
                }else{
                    this.$router.push('/')
                    this.$store.commit('auth/apiCompleted')
                }
            })
    },
    mounted(){
        window.addEventListener('resize', this.handleResize)
    },
    beforeDestory(){
        window.removeEventListener('resize', this.handleResize)
    }
}
</script>

<style>
.camera-icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    -webkit-transform: translateY(-50%) translateX(-50%);
}
</style>
