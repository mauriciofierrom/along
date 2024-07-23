class FixSectionNameUniquenessIndex < ActiveRecord::Migration[7.0]
  def change
    remove_index :sections, :name
    add_index :sections, [:name, :lesson_id], unique: true
  end
end
