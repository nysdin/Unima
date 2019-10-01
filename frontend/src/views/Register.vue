<template>
    <div id="register-container">
        <!-- Unimaアカウントの情報 -->

        <v-stepper v-model="stepper" vertical>
            <v-stepper-step :complete="stepper > 1" step="1">
                会員情報　<small>アカウントの詳細情報</small>
            </v-stepper-step>

            <v-stepper-content step="1">
                <v-card >
                    <v-form>
                        <ValidationObserver v-slot="{ invalid }">
                            <ValidationProvider name="ニックネーム" rules="required" v-slot="{ errors, valid }">
                                <v-text-field v-model="user.name" label="ニックネーム" 
                                    placeholder="アカウント名" required
                                    :success="valid" :error-messages="errors">
                                </v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="メールアドレス" rules="required|email" v-slot="{ errors, valid }">
                                <v-text-field v-model="user.email" label="メールアドレス" 
                                    placeholder="test@example.com" type="email" required
                                    :success="valid" :error-messages="errors">
                                </v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="パスワード" rules="required|min:6" v-slot="{ errors, valid }">
                                <v-text-field v-model="user.password" label="パスワード" required
                                    :append-icon="show1 ? 'visibility' : 'visibility_off'"
                                    :type="show1 ? 'text' : 'password'" placeholder="6文字以上"
                                    :success="valid" :error-messages="errors"
                                    @click:append="show1 = !show1">
                                </v-text-field>
                            </ValidationProvider>
                            <ValidationProvider name="パスワード(確認)" rules="required|password:パスワード" v-slot="{ errors, valid }">
                                <v-text-field v-model="user.password_confirmation" label="パスワード（確認）"
                                    :append-icon="show2 ? 'visibility' : 'visibility_off'"
                                    :type="show2 ? 'text' : 'password'" placeholder="6文字以上" required
                                    :success="valid" :error-messages="errors"
                                    @click:append="show2 = !show2"></v-text-field>
                            </ValidationProvider>

                            <v-btn medium @click="validateUser" color="primary"
                                :loading="loading" class="mb-2"
                                :disabled="loading || invalid">
                                次へ進む
                            </v-btn>
                        </ValidationObserver>
                    </v-form>
                </v-card>
            </v-stepper-content>

            <!-- Stripeアカウントの情報 -->

            <v-stepper-step :complete="stepper > 2" step="2">
                本人確認情報　<small>決済に関する必要な情報</small>
            </v-stepper-step>

            <v-stepper-content step="2">
                <v-card flat>
                    <v-form>
                        <ValidationObserver v-slot="{ invalid }">
                            <v-row>
                                <v-col :cols="6">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-text-field v-model="individual.last_name_kanji" id="last-name"
                                            label="苗字（漢字）" placeholder="山田" required 
                                            :error-messages="errors" :success="valid"
                                            @input="inputLastKanaName">
                                        </v-text-field>
                                    </ValidationProvider>
                                </v-col>
                                <v-col :cols="6">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-text-field v-model="individual.first_name_kanji" id="first-name"
                                            label="名前（漢字）" placeholder="太朗" required
                                            :error-messages="errors" :success="valid"
                                            @input="inputFirstKanaName">
                                        </v-text-field>
                                    </ValidationProvider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col :cols="6">
                                    <ValidationProvider rules="required|katakana" v-slot="{ errors, valid }">
                                        <v-text-field v-model="individual.last_name_kana" id="last-kana-name"
                                            label="苗字（カナ）" placeholder="ヤマダ" required
                                            :error-messages="errors" :success="valid">
                                        </v-text-field>
                                    </ValidationProvider>
                                </v-col>
                                <v-col :cols="6">
                                    <ValidationProvider rules="required|katakana" v-slot="{ errors, valid }">
                                        <v-text-field v-model="individual.first_name_kana" id="first-kana-name"
                                            label="名前（カナ）" placeholder="タロウ" required
                                            :error-messages="errors" :success="valid">
                                        </v-text-field>
                                    </ValidationProvider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col :cols="6">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-text-field v-model="phone" label="電話番号(ハイフンなし)"
                                            placeholder="09012345678" type="number" required
                                            :error-messages="errors" :success="valid">
                                        </v-text-field>
                                    </ValidationProvider>
                                </v-col>
                                <v-col :cols="6">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-select v-model="individual.gender" label="性別"
                                            :items="[{text: '男', value: 'male'}, {text:'女', value:'female'}]"
                                            :error-messages="errors" :success="valid">
                                        </v-select>
                                    </ValidationProvider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col :cols="4">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-select v-model="individual.dob.year" label="生年"
                                            :items="years"
                                            :error-messages="errors" :success="valid">
                                        </v-select>
                                    </ValidationProvider>
                                </v-col>
                                <v-col :cols="4">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-select v-model="individual.dob.month" label="生月"
                                            :items="months"
                                            :error-messages="errors" :success="valid">
                                        </v-select>
                                    </ValidationProvider>
                                </v-col>
                                <v-col :cols="4">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-select v-model="individual.dob.day" label="生日"
                                            :items="days"
                                            :error-messages="errors" :success="valid">
                                        </v-select>
                                    </ValidationProvider>
                                </v-col>
                            </v-row>

                            <ValidationProvider rules="required|postalCode" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kanji.postal_code" 
                                    label="郵便番号(ハイフンなし)" placeholder="1500001"
                                    :error-messages="errors" :success="valid" required
                                    :loading="getting">
                                </v-text-field>
                            </ValidationProvider>
                            
                            <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kanji.state" 
                                    label="都道府県名" placeholder="東京都" required
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider rules="required|katakana" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kana.state"
                                    label="都道府県名（カナ）" placeholder="トウキョウト" required
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kanji.city"
                                    label="市区町村" placeholder="渋谷区" required
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider rules="required|katakana" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kana.city"
                                    label="市区町村（カナ）" placeholder="シブヤク" required
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kanji.town"
                                    label="町名(丁目まで)" placeholder="神宮前　１丁目" required
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kana.town"
                                    label="町名(カナ）" placeholder="ジングウマエ　1-" required id="kana-town"
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kanji.line1"
                                    label="番地、号" placeholder="5-8" required
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                <v-text-field v-model="individual.address_kana.line1"
                                    label="番地、号（カナ）" placeholder="5-8" required
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <v-text-field v-model="individual.address_kanji.line2"
                                label="建物・部屋番号・その他" placeholder="神宮前タワービルディング 22F" 
                                required>
                            </v-text-field>

                            <v-text-field v-model="individual.address_kana.line2"
                                label="建物・部屋番号・その他（カナ）" placeholder="ジングウマエタワービルディングﾞ22F"
                                required>
                            </v-text-field>

                            <v-btn medium @click="register" color="primary"
                                :loading="loading" :disabled="loading || invalid">
                                次へ進む
                            </v-btn>
                            <p class="caption mb-0 mt-2">
                                ※次へ進むを押したことにより、<a @click="dialog = true">利用規約</a>に同意したものとします.
                            </p>
                        </ValidationObserver>
                    </v-form>
                </v-card>

                <v-dialog v-model="dialog" scrollable>
                    <v-card>
                        <v-card-title>
                            利用規約
                        </v-card-title>
                        <v-card-text>
                            Unimaにおける出品者向けの支払処理サービスは、Stripeが提供し、
                            <a href="https://stripe.com/jp/connect-account/legal" target=”_blank”>Stripe Connectアカウント契約</a>
                            (<a href="https://stripe.com/jp/legal" target=”_blank”>Stripe利用規約</a>を含み、総称して「Stripeサービス契約」といいます。）
                            に従うものとします。[本契約、本条件等]への同意又はUnimaにおいて取引関係者としての取引の継続により、
                            お客様はStripeサービス契約（随時Stripeにより修正されることがあり、その場合には修正されたものを含みます。）
                            に拘束されることに同意するものとします。 Stripeを通じた支払処理サービスをUnimaができるようにするための条件
                            として、お客様は、Unimaに対してお客様及びお客様の事業に関する正確かつ完全な情報を提供することに同意し、
                            Unimaが当該情報及びStripeが提供する支払処理サービスの
                            お客様による使用に関連する取引情報を共有することを認めるものとします。
                        </v-card-text>
                        <v-card-actions class="d-flex justify-center">
                            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-stepper-content>

            <v-stepper-step step="3" :complete="stepper > 3">
                支払い方法<small>クレジットカード情報</small>
            </v-stepper-step>

            <v-stepper-content step="3">
                <v-card>
                    <p class="caption">※こちらの入力をスキップしてアカウント登録後設定することもできます。</p>
                    <form id="payment-form" class="mb-3">
                        <div class="form-row">
                            <label for="card-element">
                            クレジットカード
                            </label>
                            <div id="card-element">
                            <!-- A Stripe Element will be inserted here. -->
                            </div>

                            <!-- Used to display Element errors. -->
                            <div id="card-errors" role="alert"></div>
                        </div>
                    </form>

                    <v-btn small @click="createCregitToken" color="primary"
                        :loading="loading" :disabled="loading">
                        次へ進む
                    </v-btn>
                    <v-btn small @click="stepper += 1" color="primary" class="ml-2" >スキップする</v-btn>
                </v-card>

            </v-stepper-content>

            <v-stepper-step step="4" :complete="stepper > 4">
                銀行口座 <small>売上金の振込先情報</small>
            </v-stepper-step>

            <v-stepper-content step="4">
                <v-card>
                    <p class="caption">※こちらの入力をスキップしてアカウント登録後設定することもできます。</p>
                    <ValidationObserver v-slot="{ invalid }">
                        <v-form>
                            <ValidationProvider rules="required|number4" v-slot="{ errors, valid }">
                                <v-text-field v-model="bank.bank_code" type="number"
                                    label="金融機関コード" placeholder="1110(4ケタ)"
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>
                            <ValidationProvider rules="required|number3" v-slot="{ errors, valid }">
                                <v-text-field v-model="bank.branch_code" type="number"
                                    label="支店コード" placeholder="000(3ケタ)"
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>
                            <ValidationProvider rules="required|number7" v-slot="{ errors, valid }">
                                <v-text-field v-model="bank.account_number" type="number"
                                    label="口座番号" placeholder="0001234"
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>
                            <span class="caption"><a @click="dialog1 = true">※口座番号について</a></span>
                            <v-dialog v-model="dialog1">
                                <v-card>
                                    <v-card-text>
                                        口座番号が7桁未満の場合は先頭に0を付け足して7桁にしてください.<br />
                                        また、8桁の場合は先頭の数字を外して入力してください.
                                    </v-card-text>
                                    <v-card-actions class="d-flex justify-center">
                                        <v-btn color="blue darken-1" text @click="dialog1 = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-row>
                                <v-col :cols="6">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-text-field v-model="bank.last_name"
                                            label="名義人（姓）" placeholder="ヤマダ"
                                            :error-messages="errors" :success="valid">
                                        </v-text-field>
                                    </ValidationProvider>
                                </v-col>
                                <v-col :cols="6">
                                    <ValidationProvider rules="required" v-slot="{ errors, valid }">
                                        <v-text-field v-model="bank.first_name"
                                            label="名義人（名）" placeholder="タロウ"
                                            :error-messages="errors" :success="valid">
                                        </v-text-field>
                                    </ValidationProvider>
                                </v-col>
                            </v-row>
                            
                            <v-btn small @click="createBankAccount" color="primary"
                                :loading="loading" :disabled="loading || invalid">
                                次へ進む
                            </v-btn>
                            <v-btn small @click="stepper += 1" color="primary" class="ml-2" >スキップする</v-btn>
                        </v-form>
                    </ValidationObserver>
                </v-card>

            </v-stepper-content>

            <v-stepper-step step="5">
                完了
            </v-stepper-step>

            <v-stepper-content step="5">
                <v-card flat>
                        <p class="subtitle-1">アカウント登録が完了しました</p>
                        <v-btn medium @click="complete" color="primary"
                            :loading="loading" :disabled="loading">
                            Unimaをはじめる
                        </v-btn>
                </v-card>
            </v-stepper-content>
    </v-stepper>
    </div>
</template>

<script>
import request from '../utils/api.js'
import axios from 'axios'
import axiosJsonpAdapter from 'axios-jsonp'
import * as AutoKana from 'vanilla-autokana'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

let lastKanaName, firstKanaName

const hankana2zenkana = function (str) {
    const kanaMap = {
        'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
        'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
        'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
        'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
        'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
        'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
        'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
        'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
        'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
        'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
        'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
        'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
        'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
        'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
        '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
    }

    const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g')
    return str
            .replace(reg, function (match) {
                return kanaMap[match]
            })
            .replace(/ﾞ/g, '゛')
            .replace(/ﾟ/g, '゜')
}

export default {
    name: 'Register',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
            card: null,
            stepper: 1,
            show1: false,
            show2: false,
            loading: false,
            getting: false,
            dialog: false,
            dialog1: false,
            user: {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            },
            individual: {
                address_kanji: {
                    postal_code: '',
                    state: '',
                    city: '',
                    town: '',
                    line1: '',
                    line2: '',
                },
                address_kana: {
                    postal_code: '',
                    state: '',
                    city: '',
                    town: '',
                    line1: '',
                    line2: '',
                },
                dob: {
                    day: '', month: '', year: '',
                },
                last_name_kanji: '', last_name_kana: '',
                first_name_kanji: '', first_name_kana: '',
                gender: '', phone: '',
            },
            bank: {
                bank_code: '',
                branch_code: '',
                account_number: '',
                first_name: '',
                last_name: '',
            },
            phone: '',
            isCard: false,
            isBank: false,
        }
    },
    computed: {
        years(){
            return [...Array(60)].map((v,i) => i + 1960)
        },
        months(){
            return [...Array(12)].map((v,i) => ++i)
        },
        days(){
            return [...Array(31)].map((v,i) => ++i)
        }
    },
    watch: {
        'individual.address_kanji.postal_code'(val){
            if(val.length === 7){
                this.getting = true
                const zipcode = val.slice(0,3) + '-' + val.slice(3,7)
                axios.get('/api/v1/user/address', {
                    baseURL: process.env.VUE_APP_API_ENDPOINT,
                    params: {
                        zipcode
                    }
                })
                    .then(response => {
                        const data = response.data
                        if(data.results){
                            const result = data.results[0]
                            this.individual.address_kanji.state = result.address1
                            this.individual.address_kanji.city = result.address2
                            this.individual.address_kanji.town = result.address3
                            this.individual.address_kana.state = hankana2zenkana(result.kana1)
                            this.individual.address_kana.city = hankana2zenkana(result.kana2)
                            this.individual.address_kana.town = hankana2zenkana(result.kana3)
                        }
                        this.getting = false
                    })
                    .catch(error => {
                        this.getting = false
                    })
            }
        }
    },
    methods: {
        complete(){
            this.loading = true
            this.$store.dispatch('auth/completeSignUp')
                .then(response => {
                    console.log('complete')
                    this.loading = false
                    this.$router.push('/')
                })
                .catch(error => {
                    //this.renderError('アカウントを登録し直すか、ログインを行ってください.')
                    this.loading = false
                })
        },
        register(){
            this.loading = true
            this.individual.address_kana.postal_code = this.individual.address_kanji.postal_code
            this.individual.phone = '+81' + this.phone
            request.post('/api/v1/auth', { params: { ...this.user, ...this.individual }})
                .then(response => {
                    const headers = response.headers
                    localStorage.setItem('access-token', headers['access-token'])
                    localStorage.setItem('client', headers['client'])
                    localStorage.setItem('uid', headers['uid'])
                    this.stepper += 1
                    this.loading = false
                    console.log('ok')
                })
                .catch(error => {
                    console.log(error.response)
                    const errors = error.response.data.errors
                    consle.log(errors)
                    this.loading = false
                })
        },
        validateUser(){
            this.loading = true
            const {name, email, password, password_confirmation} = this.user
            
            request.post('/api/v1/user/validate', {
                params: { name, email, password, password_confirmation }
            })
            .then(response => {
                this.stepper += 1
                this.loading = false
            })
            .catch(error => {
                const errors = error.response.data.errors
                console.log(error)
                this.loading = false
                console.log(error.response)
            })
        },
        async createCregitToken(){
            this.loading = true
            const {token, error} = await this.$stripe.createToken(this.card)
            if (error) {
                // Inform the customer that there was an error.
                const errorElement = document.getElementById('card-errors')
                errorElement.textContent = error.message
                this.loading = false
            } else {
                // Send the token to your server.
                request.patch('/api/v1/card', {params: { stripe_cregit_token: token.id }, auth: true})
                    .then(response => {
                        console.log(response)
                        this.stepper += 1
                        this.loading = false
                        this.isCard = true
                    })
                    .catch(error => {
                        this.loading = false
                        console.log(error)
                    })
            }
        },
        async createBankAccount(){
            this.loading = true
            const {token, error} = await this.$stripe.createToken('bank_account', {
                country: 'JP',
                currency: 'jpy',
                routing_number: this.bank.bank_code + this.bank.branch_code,
                account_number: this.bank.account_number,
                account_holder_name: this.bank.last_name + ' ' + this.bank.first_name,
                account_holder_type: 'individual',
            })

            if(error){
                console.log(error)
                this.loading = false
            }else{
                request.patch('/api/v1/bank_account', {params: {stripe_bank_token: token.id}, auth: true})
                    .then( response => {
                        this.loading = false
                        this.stepper += 1
                        this.isBank = true
                        console.log('sucess')
                    })
                    .catch( error => {
                        this.loading = false
                        console.log(error)
                    })
            }
        },
        inputLastKanaName(){
            this.individual.last_name_kana = lastKanaName.getFurigana()
        },
        inputFirstKanaName(){
            this.individual.first_name_kana = firstKanaName.getFurigana()
        },
    },
    mounted(){
        const elements = this.$stripe.elements()

        const style = {
            base: {
                fontSize: '16px',
                color: "#32325d",
            },
        }

        this.card = elements.create('card', {style, hidePostalCode: true})
        this.card.mount('#card-element')
        this.card.addEventListener('change', ({error}) => {
            const displayError = document.getElementById('card-errors')
            if (error) {
                displayError.textContent = error.message
            } else {
                displayError.textContent = ''
            }
        })

        lastKanaName = AutoKana.bind('#last-name', '#last-kana-name', { katakana: true })
        firstKanaName = AutoKana.bind('#first-name', '#first-kana-name', { katakana: true })
    }
    
}
</script>

<style>
.StripeElement {
    box-sizing: border-box;

    height: 40px;

    padding: 10px 12px;

    border: 1px solid transparent;
    border-radius: 4px;
    background-color: white;

    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
}

.StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
    border-color: #fa755a;
}

.StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
}

.v-stepper{
    box-shadow: initial!important;
}
</style>
