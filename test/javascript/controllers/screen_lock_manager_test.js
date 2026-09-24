import {
  mock,
  jest,
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
} from "bun:test"

import ScreenLockManager from "controllers/screen_lock_manager"

let lock

describe("ScreenLockManager", () => {
  let manager
  let request
  let addListener
  let removeListener

  beforeEach(() => {
    lock = {
      released: false,
      release: mock(() => {
        lock.released = true
        return Promise.resolve()
      }),
      addEventListener: jest.fn(),
    }
    jest.clearAllMocks()
    request = mock(() => Promise.resolve(lock))
    navigator.wakeLock = { request }
    addListener = jest.spyOn(document, "addEventListener")
    removeListener = jest.spyOn(document, "removeEventListener")
    manager = new ScreenLockManager()
  })

  afterEach(async () => {
    await manager.releaseScreenLock()
    jest.restoreAllMocks()
    delete navigator.wakeLock
  })

  describe("acquireScreenLock", () => {
    it("should add a visibilitychange listener", async () => {
      await manager.acquireScreenLock()
      expect(addListener).toHaveBeenCalledWith(
        "visibilitychange",
        expect.any(Function),
      )
    })

    it("should request the screen lock", async () => {
      await manager.acquireScreenLock()

      expect(request).toHaveBeenCalledTimes(1)
      expect(request).toHaveBeenCalledWith("screen")
    })

    it("should add release listener to the screen lock", async () => {
      await manager.acquireScreenLock()

      expect(lock.addEventListener).toHaveBeenCalledTimes(1)
      expect(lock.addEventListener).toHaveBeenCalledWith(
        "release",
        expect.any(Function),
        { once: true },
      )
    })

    describe("when the lock is already acquired", () => {
      it("does nothing", async () => {
        await manager.acquireScreenLock()
        expect(request).toHaveBeenCalledTimes(1)
        await manager.acquireScreenLock()
        expect(request).toHaveBeenCalledTimes(1)
      })
    })

    describe("when starting acquisition", () => {
      describe("and release is happening", () => {
        describe("and the release is pending", () => {
          it("waits for the release to finish", async () => {
            let resolveRelease
            const pending = new Promise((resolve) => {
              resolveRelease = resolve
            })

            // Acquire the screen lock
            await manager.acquireScreenLock()
            expect(request).toHaveBeenCalledTimes(1)

            lock.release.mockReturnValueOnce(pending)

            // Release it and hold it on the release request
            manager.releaseScreenLock()

            // Request the thing again
            const reRequest = manager.acquireScreenLock()
            expect(request).toHaveBeenCalledTimes(1)
            resolveRelease()
            await Promise.resolve()
            expect(request).toHaveBeenCalledTimes(1)
            expect(lock.release).toHaveBeenCalledTimes(1)
            await reRequest
            expect(request).toHaveBeenCalledTimes(2)
            expect(lock.addEventListener).toHaveBeenCalledTimes(2)
            expect(lock.addEventListener).toHaveBeenCalledWith(
              "release",
              expect.any(Function),
              { once: true },
            )
          })
        })
      })
      describe("and the acquisiton has been aborted", () => {
        it("resolves without doing any other work", async () => {
          let resolveRequest
          const pending = new Promise((resolve) => {
            resolveRequest = resolve
          })

          // Make request return a pending promise
          request.mockReturnValueOnce(pending)

          // Acquire the screen lock
          const acquisition = manager.acquireScreenLock()
          expect(request).toHaveBeenCalledTimes(1)

          // Start release until waiting for the request to resolve
          const release = manager.releaseScreenLock()

          // Resolve it
          resolveRequest(lock)
          await expect(acquisition).resolves.toBeUndefined()

          // Wait for release to resolve
          await release

          expect(lock.release).toHaveBeenCalledTimes(1)
          expect(lock.addEventListener).not.toHaveBeenCalled()

          // Confirm request was only run once, since the thing was aborted
          // before it could do post-lock acquisition work
          expect(request).toHaveBeenCalledTimes(1)
        })
      })

      describe("and there's a request ongoing", () => {
        it("returns letting the previous attempt resolve", async () => {
          let resolveRequest
          const pending = new Promise((resolve) => {
            resolveRequest = resolve
          })

          // Make request return a pending promise
          request.mockReturnValueOnce(pending)

          const acquisition = manager.acquireScreenLock()
          expect(request).toHaveBeenCalledTimes(1)
          await manager.acquireScreenLock()
          resolveRequest(lock)
          await acquisition
          expect(request).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe("releaseScreenLock", () => {
    it("should remove the visibilitychange listener", async () => {
      await manager.acquireScreenLock()
      const handler = addListener.mock.calls.find(
        ([event]) => event === "visibilitychange",
      )[1]
      await manager.releaseScreenLock()

      expect(removeListener).toHaveBeenCalledWith("visibilitychange", handler)
    })

    describe("when there's been no attempt to acquire the lock", () => {
      it("should do nothing", async () => {
        await expect(manager.releaseScreenLock()).resolves.toBeUndefined()
        expect(lock.release).not.toHaveBeenCalled()
      })
    })

    describe("when the lock hasn't been acquired", () => {
      it("should await for it to resolve and release it", async () => {
        let resolveRequest
        const pending = new Promise((resolve) => {
          resolveRequest = resolve
        })
        request.mockReturnValueOnce(pending)
        const acquisition = manager.acquireScreenLock()
        manager.releaseScreenLock()

        expect(lock.release).not.toHaveBeenCalled()

        resolveRequest(lock)
        await acquisition

        expect(lock.release).toHaveBeenCalledTimes(1)
        expect(lock.released).toBe(true)
      })
    })

    describe("when the lock has been acquired", () => {
      it("should release it", async () => {
        await manager.acquireScreenLock()

        expect(lock.release).not.toHaveBeenCalled()

        manager.releaseScreenLock()
        await Promise.resolve()

        expect(lock.release).toHaveBeenCalledTimes(1)
        expect(lock.released).toBe(true)
      })
    })

    describe("when the lock is already been released", () => {
      it("should let the initial attempt go through", async () => {
        await manager.acquireScreenLock()

        const release = manager.releaseScreenLock()
        expect(manager.releaseScreenLock()).toBe(release)
        await manager.releaseScreenLock()

        expect(lock.release).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("when visibility is regained", () => {
    it("re-acquires the lock", async () => {
      await manager.acquireScreenLock()
      lock.released = true
      document.dispatchEvent(new Event("visibilitychange"))

      expect(request).toHaveBeenCalledTimes(2)
      expect(request).toHaveBeenLastCalledWith("screen")
    })
  })
})
