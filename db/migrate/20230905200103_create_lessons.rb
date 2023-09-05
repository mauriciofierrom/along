class CreateLessons < ActiveRecord::Migration[7.0]
  def change
    create_table :lessons do |t|
      t.string :name
      t.string :video_url
      t.references :instrument, null: false, foreign_key: true
      t.integer :order

      t.timestamps
    end

    add_index :lessons, :name, unique: true
    add_index :lessons, :video_url, unique: true
    add_index :lessons, :order, unique: true
  end
end
