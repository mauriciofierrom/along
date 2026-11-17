import { mock } from "bun:test"

globalThis.window.rails_env = "test"

const instance = { show: mock(), hide: mock() }
window.driverHints = { hints: mock(() => instance) }
