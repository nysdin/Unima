class AddCancelCountToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :cancel_count, :integer, default: 5
    #Ex:- add_column("admin_users", "username", :string, :limit =>25, :after => "email")
  end
end
