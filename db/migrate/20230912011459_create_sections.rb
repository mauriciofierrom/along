class CreateSections < ActiveRecord::Migration[7.0]
  def change
    create_table :sections do |t|
      t.string :name, limit: 25
      t.integer :start_time_hour, default: 0, null: false
      t.integer :start_time_minute, null: false
      t.integer :start_time_second, null: false
      t.integer :end_time_hour, default: 0, null: false
      t.integer :end_time_minute, null: false
      t.integer :end_time_second, null: false
      t.decimal :playback_speed, precision: 2, scale: 1, default: 1
      t.boolean :finished, default: false, null: false
      t.boolean :current, default: false, null: false
      t.boolean :loop, default: true, null: false
      t.references :lesson, null: false, foreign_key: true

      t.timestamps
    end

    add_index :sections, :name, unique: true
  end
end
