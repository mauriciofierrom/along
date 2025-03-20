class ChangeSectionPoints < ActiveRecord::Migration[7.0]
  def change
    remove_columns :sections, :start_time_hour, :start_time_minute, :start_time_second
    remove_columns :sections, :end_time_hour, :end_time_minute, :end_time_second

    add_column :sections, :start_time, :decimal, precision: 6, scale: 2
    add_column :sections, :end_time, :decimal, precision: 6, scale: 2
  end
end
