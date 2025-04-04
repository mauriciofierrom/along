# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "along@mauriciofierro.dev"
  layout "mailer"
end
