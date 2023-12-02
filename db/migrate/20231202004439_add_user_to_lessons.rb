class AddUserToLessons < ActiveRecord::Migration[7.0]
  def change
    add_reference :lessons, :user, foreign_key: true

    # Lesson names are now only unique by user
    remove_index :lessons, :name
    add_index :lessons, [:name, :user_id], unique: true

    # Video URLs are now only unique by user
    remove_index :lessons, :video_url
    add_index :lessons, [:video_url, :user_id], unique: true

    # Order are now only unique by user
    remove_index :lessons, :order
    add_index :lessons, [:order, :user_id], unique: true
  end
end
