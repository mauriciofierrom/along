describe("Lesson", () => {
  describe("New", () => {
    beforeEach(() => {
      cy.appFactories([["create", "user"]])
      cy.forceLogin()
      cy.findByText("New Lesson").click()
    })

    context("when the video succeeds to load", () => {
      beforeEach(() => {
        cy.findByLabelText("Video link")
          .invoke("val", "https://some.com")
          .trigger("input")
        cy.findByLabelText("Name").should("not.have.class", "disabled")
        cy.findByLabelText("Instrument").should("not.have.class", "disabled")
        cy.findByText("Create Lesson").should("not.have.class", "disabled")
      })

      it("doesn't disable fields nor button", () => {
        cy.findByText("This video is restricted from being embedded").should(
          "not.exist",
        )
      })

      context("and the a new url is used that fails to load", () => {
        it("disables the rest of the fields and the the submit button and shows the error message", () => {
          cy.get("#player").then(([player]) => {
            player.dataset.error = "load"
            cy.findByLabelText("Video link")
              .invoke("val", "https://some.com")
              .trigger("input")
            cy.findByLabelText("Name").should("have.class", "disabled")
            cy.findByLabelText("Instrument").should("have.class", "disabled")
            cy.findByText("Create Lesson").should("have.class", "disabled")
            cy.findByText("This video is restricted from being embedded")
          })
        })
      })
    })

    context("when the video fails to load", () => {
      beforeEach(() => {
        cy.get("#player").then(([player]) => {
          player.dataset.error = "load"
          cy.findByLabelText("Video link")
            .invoke("val", "https://some.com")
            .trigger("input")
          cy.findByLabelText("Name").should("have.class", "disabled")
          cy.findByLabelText("Instrument").should("have.class", "disabled")
          cy.findByText("Create Lesson").should("have.class", "disabled")
        })
      })

      it("disables the rest of the fields and the submit button and shows the error message", () => {
        cy.findByText("This video is restricted from being embedded")
      })

      context("and a new url is used that succeeds to load", () => {
        it("enables the rest of the fields and the submit button and hides the error message", () => {
          cy.get("#player").then(([player]) => {
            delete player.dataset.error
            cy.findByLabelText("Video link")
              .invoke("val", "https://some-other.com")
              .trigger("input")
            cy.findByLabelText("Name").should("not.have.class", "disabled")
            cy.findByLabelText("Instrument").should(
              "not.have.class",
              "disabled",
            )
            cy.findByText("Create Lesson").should("not.have.class", "disabled")
            cy.findByText(
              "This video is restricted from being embedded",
            ).should("not.exist")
          })
        })
      })
    })
  })

  describe("Show", () => {
    it("enables the New Section button after player is ready", () => {
      cy.appFactories([["create", "lesson"]]).then(([lesson]) => {
        cy.window().then((window) => {
          window.localStorage.setItem("simulateLoad", true)
        })
        cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
      })

      cy.findByText("New Section").should("have.class", "disabled")
      cy.findByText("New Section").should("not.have.class", "disabled")
    })
  })
})
