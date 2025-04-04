# frozen_string_literal: true

class CypressController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user!, only: [:force_login]

  def force_login
    user = if params[:email].present?
      User.find_by!(email: params.require(:email))
    else
      User.first!
    end
    sign_in(user)
    redirect_to(URI.parse(params.require(:redirect_to)).path)
  end
end
