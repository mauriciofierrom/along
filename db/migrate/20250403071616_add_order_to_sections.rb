class AddOrderToSections < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :order, :integer
    add_index :sections, [:lesson_id, :order], unique: true
  end
end
