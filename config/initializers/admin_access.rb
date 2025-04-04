# frozen_string_literal: true

class CanAccessFlipperUI
  class << self
    def matches?(request)
      current_user = request.env["warden"].user
      current_user.present? && current_user.email == Rails.application.credentials.admin_email!
    end
  end
end
