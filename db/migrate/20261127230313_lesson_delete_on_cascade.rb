class LessonDeleteOnCascade < ActiveRecord::Migration[8.1]
  def change
    remove_foreign_key :lessons, :users
    add_foreign_key :lessons, :users, on_delete: :cascade
  end
end
