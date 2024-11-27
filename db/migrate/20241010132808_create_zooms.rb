class CreateZooms < ActiveRecord::Migration[7.0]
  def change
    create_table :zooms do |t|
      t.float :start
      t.float :end
      t.integer :level
      t.references :section, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps
    end

    add_index :zooms, [:level, :section_id], unique: true
  end
end
