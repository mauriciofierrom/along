import Zoom from "../../../../app/javascript/controllers/zoom/zoom"
import ZoomManager from "../../../../app/javascript/controllers/zoom/zoom_manager"

describe("ZoomManager", () => {
  const duration = 290

  describe("zoomOut", () => {
    it("removes the last element in the zoom levels", () => {
      const zoom1 = new Zoom(4.0, 33.0, duration)
      const zoom2 = new Zoom(6.0, 22.0, duration)

      const zoomManager = new ZoomManager([zoom1, zoom2], duration)

      zoomManager.zoomOut()

      expect(zoomManager.activeZoom).toBe(zoom1)
    })
  })

  describe("zoomIn", () => {
    it("returns the last element in the zoom levels", () => {
      const zoom1 = new Zoom(4.0, 33.0, duration)
      const zoom2 = new Zoom(6.0, 22.0, duration)

      const zoomManager = new ZoomManager([zoom1, zoom2], duration)

      expect(zoomManager.activeZoom).toBe(zoom2)
    })
  })
})
