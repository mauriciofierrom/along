import Player from "controllers/player/player"

describe("Player", () => {
  describe("when trying to instantiate abstract class", () => {
    it("throws an exception", () => {
      expect(() => new Player()).toThrow(
        "Abstract class Player cannot be instantiated",
      )
    })
  })
})
