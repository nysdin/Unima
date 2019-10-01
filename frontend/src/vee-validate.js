import { extend } from 'vee-validate'
import { required, email, min, max } from "vee-validate/dist/rules"

extend("required", {
    ...required,
    message: "必須項目です."
})

extend("email", {
    ...email,
    message: "有効なメールアドレスではございません."
})

extend("price", {
    validate: value => (Number(value) > 0 && Number(value) < 300000),
    message: "不正な価格です."
})

extend("max", {
    ...max,
    message: "{length}文字以内で入力してください.L0"
})

extend("min", {
    ...min,
    message: "{_field_}は{length}文字以上で入力してください."
})

extend("password", {
    validate: (value, { other }) => value === other,
    message: "パスワードと一致していいません.",
    params: [{ name: 'other', isTarget: true }]
})

extend("katakana", {
    validate: value => value.match(/^[ァ-ヶー　]*$/),
    message: "カタカナでない文字が含まれています."
})

extend("postalCode", {
    validate: value => value.match(/^\d{7}$/),
    message: "不正な入力です."
})

extend("number3", {
    validate: value => value.match(/^\d{3}$/),
    message: "3桁で入力してください."
})

extend("number4", {
    validate: value => value.match(/^\d{4}$/),
    message: "4桁で入力してください."
})

extend("number7", {
    validate: value => value.match(/^\d{7}$/),
    message: "7桁で入力してください."
})