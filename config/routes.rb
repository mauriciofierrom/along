# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  resources :lessons do
    member do
      post :edit_name_inline
      patch :update_inline
    end
    resources :sections, except: [:index] do
      collection do
        post :swap_order
        post :zoom_in
        post :zoom_out
      end
    end
  end

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
