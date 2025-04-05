class RemoveSectionOrderIndex < ActiveRecord::Migration[7.0]
  def change
    remove_index :sections, [:lesson_id, :order]
  end
end
