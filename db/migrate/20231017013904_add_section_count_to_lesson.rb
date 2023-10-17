class AddSectionCountToLesson < ActiveRecord::Migration[7.0]
  def change
    add_column :lessons, :sections_count, :integer
  end
end
