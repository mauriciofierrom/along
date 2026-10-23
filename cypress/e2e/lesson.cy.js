describe("Lesson", () => {
  context("when the player fails to initialize", () => {
    it("shows a player error", () => {
      cy.window().then((window) => {
        window.sessionStorage.setItem("simulateError", "init")
      })
      cy.appFactories([["create", "user"]])
      cy.forceLogin()
      cy.findByText("New Lesson").click()

      cy.findByText("Player error")
      cy.findByText("Player initialization failed")
      cy.findByText("Details")
      cy.findByText("Init error details")
    })
  })

  describe("Tutorial", () => {
    context("whent here's no lesson", () => {
      it("should skip lesson item's steps", () => {
        const titles = ["New Lesson button", "Lesson list", "That's it!"]
        cy.appFactories([["create", "user"]])
        cy.forceLogin()
        cy.findByTestId("lesson-tutor").click()
        titles.forEach((title) => {
          cy.get(".driver-popover-title").should("have.text", title)
          cy.get(".driver-popover-next-btn").click()
        })
      })
    })

    context("when there's at least one lesson", () => {
      it("should do the whole tour", () => {
        const titles = [
          "New Lesson button",
          "Lesson list",
          "Lesson item",
          "Lesson title",
          "Lesson delete button",
          "That's it!",
        ]
        cy.appFactories([["create", "user"]]).then(([user]) => {
          cy.appFactories([
            ["create", "lesson", { name: "My Lesson", user_id: user.id }],
          ]).then(() => {
            cy.forceLogin({ email: user.email })
            cy.findByTestId("lesson-tutor").click()
            titles.forEach((title) => {
              cy.get(".driver-popover-title").should("have.text", title)
              cy.get(".driver-popover-next-btn").click()
            })
          })
        })
      })
    })
  })

  describe("New", () => {
    beforeEach(() => {
      cy.appFactories([["create", "user"]])
      cy.forceLogin()
      cy.findByText("New Lesson").click()
    })

    context("when using the paste button", () => {
      context("and the clipboard has a valid YouTube URL", () => {
        it("should populate the URL field", () => {
          const url = "https://youtu.be/dQw4w9WgXcQ?si=rDMqqHoAycx5gXfY"
          cy.window().then((window) => {
            cy.stub(window.navigator.clipboard, "readText").resolves(url)
          })
          cy.findByTestId("paste-button").click()
          cy.findByLabelText("Video link").should("have.value", url)
        })
      })

      context("and the clipboard doesn't have a valid YouTube URL", () => {
        it("should do nothing", () => {
          cy.window().then((window) => {
            cy.stub(window.navigator.clipboard, "readText")
              .resolves("Awkward copied text")
              .as("readText")
          })
          cy.findByTestId("paste-button").click()
          cy.get("@readText").should("have.been.called")
          cy.findByLabelText("Video link").should("have.value", "")
        })
      })
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
        })
      })

      describe("shows a player error", () => {
        it("shows a player error", () => {
          cy.findByText("Player error")
          cy.findByText("Player failed to load")
          cy.findByText("Details")
          cy.findByText("Load error details")
        })
      })

      context("and lesson creation is attempted", () => {
        beforeEach(() => {
          cy.findByLabelText("Name").should("have.class", "disabled")
          cy.findByLabelText("Instrument").should("have.class", "disabled")
          cy.findByText("Create Lesson").should("have.class", "disabled")
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
              cy.findByText("Create Lesson").should(
                "not.have.class",
                "disabled",
              )
              cy.findByText(
                "This video is restricted from being embedded",
              ).should("not.exist")
            })
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

  describe("Inline name editing", () => {
    beforeEach(() => {
      cy.appFactories([["create", "lesson", { name: "My Lesson" }]]).then(
        ([lesson]) => {
          cy.appFactories([
            [
              "create",
              "lesson",
              { name: "Your Lesson", user_id: lesson.user_id },
            ],
          ]).then(() => {
            cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
            cy.findByTestId("edit-lesson").click({ force: true })
          })
        },
      )
    })

    context("when editing succeeds", () => {
      it("udpates the lesson name in place", () => {
        cy.get("#lesson_name").clear().type("Our Lesson")
        cy.findByText("Update Lesson").click({ force: true })
        cy.findByText("Our Lesson")
      })
    })

    context("when canceling", () => {
      it("preserves the name", () => {
        cy.findByText("Cancel").click({ force: true })
        cy.findByText("My Lesson")
      })
    })

    context("on validation error", () => {
      beforeEach(() => {
        cy.get("#lesson_name").clear().type("Your Lesson")
        cy.findByText("Update Lesson").click({ force: true })
      })

      it("sets custom validity with the validation error message", () => {
        cy.get("#lesson_name").should(($field) => {
          expect($field.get(0).checkValidity()).to.equal(false)
          expect($field.get(0).validationMessage).to.equal(
            "has already been taken",
          )
        })
      })

      it("sets the invalid class on the element", () => {
        cy.get("#lesson_name").should("have.class", "invalid")
      })
    })
  })
})
