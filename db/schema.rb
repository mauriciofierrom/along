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

ActiveRecord::Schema[7.0].define(version: 2025_04_05_074310) do
  create_table "flipper_features", force: :cascade do |t|
    t.string "key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_flipper_features_on_key", unique: true
  end

  create_table "flipper_gates", force: :cascade do |t|
    t.string "feature_key", null: false
    t.string "key", null: false
    t.text "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feature_key", "key", "value"], name: "index_flipper_gates_on_feature_key_and_key_and_value", unique: true
  end

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
    t.integer "duration_in_seconds", default: 0
    t.integer "sections_count"
    t.integer "user_id"
    t.index ["instrument_id"], name: "index_lessons_on_instrument_id"
    t.index ["name", "user_id"], name: "index_lessons_on_name_and_user_id", unique: true
    t.index ["order", "user_id"], name: "index_lessons_on_order_and_user_id", unique: true
    t.index ["user_id"], name: "index_lessons_on_user_id"
    t.index ["video_url", "user_id"], name: "index_lessons_on_video_url_and_user_id", unique: true
  end

  create_table "sections", force: :cascade do |t|
    t.string "name", limit: 25
    t.decimal "playback_speed", precision: 2, scale: 1, default: "1.0"
    t.boolean "finished", default: false, null: false
    t.boolean "current", default: false, null: false
    t.boolean "loop", default: true, null: false
    t.integer "lesson_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "start_time", precision: 6, scale: 2
    t.decimal "end_time", precision: 6, scale: 2
    t.integer "order"
    t.index ["lesson_id"], name: "index_sections_on_lesson_id"
    t.index ["name", "lesson_id"], name: "index_sections_on_name_and_lesson_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "zooms", force: :cascade do |t|
    t.float "start"
    t.float "end"
    t.integer "level"
    t.integer "section_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["level", "section_id"], name: "index_zooms_on_level_and_section_id", unique: true
    t.index ["section_id"], name: "index_zooms_on_section_id"
  end

  add_foreign_key "lessons", "instruments"
  add_foreign_key "lessons", "users"
  add_foreign_key "sections", "lessons"
  add_foreign_key "zooms", "sections", on_delete: :cascade
end
