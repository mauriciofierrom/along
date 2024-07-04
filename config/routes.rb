Rails.application.routes.draw do
  devise_for :users
  resources :lessons do
    resources :sections, except: [:index]
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  authenticated :user do
    root "lessons#index", as: :authenticated_root
  end

  mount Flipper::UI.app(Flipper) => '/flipper'

  # Defines the root path route ("/")
  root "home#index"
end
