<template>
    <div id="bank">
        <v-overlay :value="init" :opacity="1" color="#F5F5F5">
            <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        </v-overlay>
        <v-container>
            <v-card flat>
                <v-card-title class="text-center">
                    振込先の銀行口座
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <template v-if="last4">
                        <v-form>
                            <v-text-field v-model="bank_name" label="銀行" readonly></v-text-field>
                            <v-text-field v-model="branch_code" label="支店コード" readonly></v-text-field>
                            <v-text-field v-model="last4" label="口座番号" readonly></v-text-field>
                            <v-row>
                                <v-col :cols="6">
                                    <v-text-field v-model="last_name" label="名義人（姓）" readonly></v-text-field>
                                </v-col>
                                <v-col :cols="6">
                                    <v-text-field v-model="first_name" label="名義人（名）" readonly></v-text-field>
                                </v-col>
                            </v-row>
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
                        
                            <div class="d-flex justify-center">
                                <v-btn medium outlined @click="dialog = true" class="ml-2" color="primary">
                                    変更する
                                </v-btn>
                            </div>
                        </v-form>
                    </template>
                    <template v-else>
                        <div class="d-flex justify-center">
                            <v-btn medium outlined @click="dialog = true" class="ml-2" color="primary">
                                登録する
                            </v-btn>
                        </div>
                    </template>
                </v-card-text>
            </v-card>
            
        </v-container>

        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title>
                    振込先口座の変更
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <ValidationObserver v-slot="{ invalid }">
                            <v-form>
                                <ValidationProvider rules="required|number4" v-slot="{ errors, valid }">
                                    <v-text-field v-model="bank.bank_code" 
                                        label="金融機関コード" placeholder="1110(4ケタ)"
                                        :error-messages="errors" :success="valid">
                                    </v-text-field>
                                </ValidationProvider>
                                <ValidationProvider rules="required|number3" v-slot="{ errors, valid }">
                                    <v-text-field v-model="bank.branch_code"
                                        label="支店コード" placeholder="000(3ケタ)"
                                        :error-messages="errors" :success="valid">
                                    </v-text-field>
                                </ValidationProvider>
                                <ValidationProvider rules="required|number7" v-slot="{ errors, valid }">
                                    <v-text-field v-model="bank.account_number" 
                                        label="口座番号" placeholder="0001234(7ケタ)"
                                        :error-messages="errors" :success="valid">
                                    </v-text-field>
                                </ValidationProvider>
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
                            
                                <div class="d-flex justify-center">
                                    <v-btn medium outlined @click="registerBankAccount"
                                        :loading=loading :disabled="loading || invalid">
                                        変更する
                                    </v-btn>
                                    <v-btn medium outlined @click="dialog = false" class="ml-2">キャンセル</v-btn>
                                </div>
                            </v-form>
                        </ValidationObserver>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import request from '../utils/api.js'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
    name: 'BankAccount',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data(){
        return {
            init: true,
            loading: false,
            dialog: false,
            dialog1: false,
            bank_name: '',
            bank_code: '',
            branch_code: '',
            last4: '',
            first_name: '',
            last_name: '',
            bank: {
                bank_code: '',
                branch_code: '',
                account_number: '',
                first_name: '',
                last_name: '',
            }
        }
    },
    methods: {
        async registerBankAccount(){
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
                this.loading = false
                console.log(error)
            }else{
                request.patch('/api/v1/bank_account', {params: {stripe_bank_token: token.id}, auth: true})
                    .then( response => {
                        this.loading = false
                        this.displayBankAccount(response)
                        this.dialog = false
                        console.log('sucess')
                    })
                    .catch( error => {
                        this.loading = false
                        console.log(error)
                    })
            }
        },
        displayBankAccount(data){
            console.log(data)
            const name_length = data.full_name.length
            const full_name = data.full_name
            let space = 0
            for(let i = 0; i < name_length; i++){
                if(full_name[i] === ' '){
                    space = i
                    break
                }
            }
            this.last_name = full_name.slice(0, space)
            this.first_name = full_name.slice(space + 1)
            this.bank_name = data.bank_name
            this.last4 = '***' + data.last4
            this.bank_code = data.routing_number.slice(0,4)
            this.branch_code = data.routing_number.slice(4)
        }
    },
    mounted(){
        request.get('/api/v1/bank_account/', { auth: true })
            .then(response => {
                const data = response.data
                if(data.last4){
                    this.displayBankAccount(data)
                }
                this.init = false
            })
            .catch(error => {
                console.log(error)
                this.init = false
            })
    }
}
</script>

<style>

</style>
