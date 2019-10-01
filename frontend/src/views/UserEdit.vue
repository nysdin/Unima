<template>
    <div id="user-edit">
        <h1>プロフィール変更</h1>
        <v-container>
            <v-form>
                <v-row>
                    <v-col :cols="4" class="d-flex align-center justify-center">
                        <v-dialog v-model="dialog">
                            <template v-slot:activator="{ on }">
                                <div class="d-flex justify-center flex-column">
                                    <v-avatar size="62">
                                        <img :src="preview">
                                    </v-avatar>
                                    <a class="block mt-2" @click="doModal">編集する</a>
                                </div>
                            </template>
                            <v-card>
                                <div class="d-flex justify-center pa-6" ref="modalView">
                                    <croppa v-model="avatar" :width="modalImageSize" :height="modalImageSize"
                                    ></croppa>
                                </div>
                                <v-card-actions class="d-flex justify-center">
                                    <v-btn text @click="cancelAvatar">キャンセル</v-btn>
                                    <v-btn text @click="changeAvatar">変更</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                    <v-col :cols="8">
                        <v-text-field v-model="name" label="アカウント名" placeholder="名前" required></v-text-field>
                        <v-text-field v-model="email" label="メールアドレス" placeholder="text@example.com" required></v-text-field>
                    </v-col>
                </v-row>

                <div class="d-flex justify-center">
                    <v-btn medium outlined @click="editUser">変更する</v-btn>
                </div>
            </v-form>
        </v-container>

    </div>
</template>

<script>

export default {
    name: 'userEdit',
    data(){
        return {
            name: '',
            email: '',
            dialog: false,
            avatar: {},
            previewAvatar: '',
        }
    },
    computed: {
        modalImageSize(){
            return (window.innerWidth - 48) * 0.8
        },
        preview(){
            if(this.previewAvatar){
                return this.previewAvatar
            }else{
                return this.$store.state.user.user.avatar.url
            }
        }
    },
    methods: {
        editUser(){
            if(this.previewAvatar){
                const filename = this.avatar.getChosenFile().name
                this.$store.dispatch('user/editUser', { name: this.name, email: this.email, avatar: this.avatar, filename })
                    .then( () => this.$router.push('/mypage'))
                    .catch( () => console.log('failed'))
            }else{
                this.$store.dispatch('user/editUser', { name: this.name, email: this.email })
                    .then( () => this.$router.push('/mypage'))
                    .catch( () => console.log('failed'))
            }
        },
        selectedFile(e){
            e.preventDefault()
            this.uploadFile = e.target.files[0]
        },
        changeAvatar(){
            this.dialog = false
            let url = this.avatar.generateDataUrl()
            this.previewAvatar = url
        },
        cancelAvatar(){
            this.dialog = false
        },
        doModal(){
            this.dialog = true
        }
    },
    created(){
        this.name = this.$store.state.user.user.name 
        this.email = this.$store.state.user.user.email
    }
}
</script>
