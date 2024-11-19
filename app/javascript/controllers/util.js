export function debounce(callback, delay) {
  let timeout
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(this, arguments), delay)
  }
}

export function debug(msg, ...options) {
  if(window.rails_env !== undefined && window.rails_env !== null && window.rails_env === "development") {
    console.log(msg, ...options)
  }
}

export const Env = {
  Prod: "production",
  Dev: "development",
  Test: "test",
  Cypress: "CYPRESS"
}
