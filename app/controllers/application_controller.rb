# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include HttpAcceptLanguage::AutoLocale
  before_action :authenticate_user!, unless: :devise_controller?

  def after_sign_in_path_for(users)
    lessons_path
  end
end
