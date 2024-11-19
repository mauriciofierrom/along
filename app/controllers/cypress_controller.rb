class CypressController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user!, only: [:force_login]

  def force_login
    if params[:email].present?
      user = User.find_by!(email: params.require(:email))
    else
      user = User.first!
    end
    sign_in(user)
    redirect_to URI.parse(params.require(:redirect_to)).path
  end
end
