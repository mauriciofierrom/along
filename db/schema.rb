# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_09_12_011459) do
  create_table "instruments", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_instruments_on_name", unique: true
  end

  create_table "lessons", force: :cascade do |t|
    t.string "name"
    t.string "video_url"
    t.integer "instrument_id", null: false
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instrument_id"], name: "index_lessons_on_instrument_id"
    t.index ["name"], name: "index_lessons_on_name", unique: true
    t.index ["order"], name: "index_lessons_on_order", unique: true
    t.index ["video_url"], name: "index_lessons_on_video_url", unique: true
  end

  create_table "sections", force: :cascade do |t|
    t.string "name", limit: 25
    t.integer "start_time_hour", default: 0, null: false
    t.integer "start_time_minute", null: false
    t.integer "start_time_second", null: false
    t.integer "end_time_hour", default: 0, null: false
    t.integer "end_time_minute", null: false
    t.integer "end_time_second", null: false
    t.decimal "playback_speed", precision: 2, scale: 1, default: "1.0"
    t.boolean "finished", default: false, null: false
    t.boolean "current", default: false, null: false
    t.boolean "loop", default: true, null: false
    t.integer "lesson_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lesson_id"], name: "index_sections_on_lesson_id"
    t.index ["name"], name: "index_sections_on_name", unique: true
  end

  add_foreign_key "lessons", "instruments"
  add_foreign_key "sections", "lessons"
end
