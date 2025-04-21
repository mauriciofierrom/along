# frozen_string_literal: true

require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  include ApplicationHelper

  test ".error_style is 'invalid' when the field is present in the error hash" do
    errors = { some: "error" }
    assert_equal error_style(:some, errors), "invalid"
  end

  test ".error_style is empty when the error hash is nil" do
    assert_equal error_style(:some, nil), ""
  end

  test ".error_style is empty when the field is not present in the error hash" do
    errors = { other: "error" }
    assert_equal error_style(:some, errors), ""
  end
end
