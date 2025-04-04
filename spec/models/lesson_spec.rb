# frozen_string_literal: true

require "rails_helper"

describe Lesson do
  describe "associations" do
    it { is_expected.to(belong_to(:instrument)) }
    it { is_expected.to(have_many(:sections)) }
  end
end
