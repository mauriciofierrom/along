import Zoom from "../../../../app/javascript/controllers/zoom/zoom"

describe("Zoom", () => {
  it("converts a point", () => {
    const zoom = new Zoom(0, 72, 1273)
    const { start, end } = zoom.convert(323.28, 535.1)

    expect(parseFloat(start.toFixed(2))).toBe(18.28)
    expect(parseFloat(end.toFixed(2))).toBe(30.26)
  })

  it("reverts a point", () => {
    const zoom = new Zoom(0.0, 72.0, 1273)

    expect(parseFloat(zoom.restorePoint(18.28).toFixed(2))).toBe(323.2)
    expect(parseFloat(zoom.restorePoint(30.26).toFixed(2))).toBe(535.01)
  })

  it("is reversible", () => {
    const zoom = new Zoom(0, 72, 1273)
    const point = 323.2
    const converted = zoom.convertPoint(point)
    const reverted = zoom.restorePoint(converted)

    expect(point).toBe(reverted)
  })
})
