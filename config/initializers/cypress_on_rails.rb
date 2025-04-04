# frozen_string_literal: true

if defined?(CypressOnRails)
  CypressOnRails.configure do |c|
    c.api_prefix = ""
    c.install_folder = File.expand_path("#{__dir__}/../../e2e")
    # WARNING!! CypressOnRails can execute arbitrary ruby code
    # please use with extra caution if enabling on hosted servers or starting your local server on 0.0.0.0
    c.use_middleware = !Rails.env.production?
    #  c.use_vcr_middleware = !Rails.env.production?
    c.logger = Rails.logger
  end

  # # if you compile your asssets on CI
  # if ENV['CYPRESS'].present? && ENV['CI'].present?
  #  Rails.application.configure do
  #    config.assets.compile = false
  #    config.assets.unknown_asset_fallback = false
  #  end
  # end
end
