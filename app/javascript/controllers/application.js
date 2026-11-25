import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Set up Honeybadger error handler
application.handleError = (error, message, detail) => {
  console.warn(message, detail)
  window.Honeybadger?.notify(error)
}

// Configure Stimulus development experience
application.debug = false
window.Stimulus = application

export { application }
