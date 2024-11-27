export function debounce(callback, delay) {
  let timeout
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(this, arguments), delay)
  }
}

export function debug(msg, ...options) {
  if(debugCondition()) {
    console.log(`${extractPrefix()}: ${msg || ""}`, ...options)
  }
}

/*
 * Enum for run environments for the application
 *
 * @readonly
 * @enum {string}
 */
export const Env = {
  Prod: "production",
  Dev: "development",
  Test: "test",
  Cypress: "CYPRESS"
}

/*
 * Enum for general element actions
 *
 * @readonly
 * @enum {string}
 */
export const ElementAction = {
  Hide: "hidden",
  Disable: "disabled",
}

/*
 * Make an element visible
 *
 * @param {Element} element
 */
export function show(element) {
  element.classList.remove(ElementAction.Hide)
}

/*
 * Make an element not visible
 *
 * @param {Element} element
 */
export function hide(element) {
  element.classList.add(ElementAction.Hide)
}

/*
 * Enable an element
 *
 * @param {Element} element
 */
export function enable(element) {
  element.classList.remove(ElementAction.Disable)
}

/*
 * Disable an element
 *
 * @param {Element} element
 */
export function disable(element) {
  element.classList.add(ElementAction.Disable)
}

// FIXME: Parsing depends on the agent (browser)
function extractPrefix() {
  const stackTrace = Error().stack
  // INFO: This is obviously taking into account the two calls of extractPrefix
  // and debug itself, so the next is our target, index 2.
  const mostRecent = stackTrace.split("\n")[2]
  const [fnName, rawPath] = mostRecent.split("@")
  const fileName = rawPath.match(/\/([a-zA-Z_]+)(?=-[a-f0-9]+\.js)/)[1]

  return `${snakeToPascalCase(fileName)}.${fnName}`
}

function snakeToPascalCase(str) {
  return str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function debugCondition() {
  return window.rails_env !== undefined &&
    window.rails_env !== null &&
    window.rails_env === "development" &&
    !(window.is_cypress === "true")
}
