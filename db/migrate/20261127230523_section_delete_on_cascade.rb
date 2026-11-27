class SectionDeleteOnCascade < ActiveRecord::Migration[8.1]
  def change
    remove_foreign_key :sections, :lessons
    add_foreign_key :sections, :lessons, on_delete: :cascade
  end
end
