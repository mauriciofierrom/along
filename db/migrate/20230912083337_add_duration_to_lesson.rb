class AddDurationToLesson < ActiveRecord::Migration[7.0]
  def change
    add_column :lessons, :duration_in_seconds, :integer, default: 0
  end
end
