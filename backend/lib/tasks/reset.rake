namespace :user do
    desc "毎月0時にcancel_countを5にリセットする"

    task reset_cancel_count: :environment do
        User.update_all(cancel_count: 5)
    end
end
