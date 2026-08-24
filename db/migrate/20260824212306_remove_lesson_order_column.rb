class RemoveLessonOrderColumn < ActiveRecord::Migration[8.1]
  def change
    remove_index :lessons, [:order, :user_id]
    remove_column :lessons, :order, :integer
  end
end
