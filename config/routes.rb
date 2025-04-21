# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  resources :lessons do
    member do
      post :edit_name_inline
      patch :update_inline
    end
    resources :sections, except: [:index]
  end

  post "section/zoom_in", to: "sections#zoom_in"
  post "section/zoom_out", to: "sections#zoom_out"
  post "section/swap_order", to: "sections#swap_order"

  authenticated :user do
    root "lessons#index", as: :authenticated_root
  end

  constraints CanAccessFlipperUI do
    mount Flipper::UI.app(Flipper) => "/flipper"
  end

  # Defines the root path route ("/")
  root "home#index"

  # Cypress login
  unless Rails.env.production?
    scope path: "/__cypress__", controller: "cypress" do
      post "forceLogin", action: "force_login"
    end
  end
end
