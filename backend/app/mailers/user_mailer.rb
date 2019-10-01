class UserMailer < ApplicationMailer

    def register
        @user = params[:user]
        mail(to: @user.email, subject: '【Unima】本登録完了のお知らせ')
    end

    def purchase
        @buyer = params[:buyer]
        @seller = params[:seller]
        @product = params[:product]
        mail(to: @buyer.email, subject: '【Unima】商品の購入が完了しました。')
    end

    def sold
        @buyer = params[:buyer]
        @seller = params[:seller]
        @product = params[:product]
        mail(to: @seller.email, subject: '【Unima】商品が購入されました。')
    end
end
