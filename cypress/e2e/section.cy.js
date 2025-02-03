describe("Section", () => {
  it("Loads the section", () => {
    cy.appFactories([["create", "section"]]).then(([section]) => {
      cy.forceLogin({ redirect_to: "/lessons" })
      cy.get(".video-card > .title").click()
      cy.findByText(section.name).should("exist")
    })
  })

  describe("On create", () => {
    it("enables the range inputs when the video starts playing", () => {
      cy.appFactories([["create", "lesson"]]).then(([lesson]) => {
        cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
        cy.findByText("New Section").click()
        cy.get("#section_start_time")
          .should("have.class", "disabled")
          .should("be.disabled")
        cy.get("#section_end_time")
          .should("have.class", "disabled")
          .should("be.disabled")
        cy.get("#section_start_time")
          .should("not.have.class", "disabled")
          .should("not.be.disabled")
        cy.get("#section_end_time")
          .should("not.have.class", "disabled")
          .should("not.be.disabled")
      })
    })
  })

  describe("On edit", () => {
    it("enables the range inputs when the video starts playing", () => {
      cy.appFactories([["create", "section"]]).then(([section]) => {
        cy.forceLogin({ redirect_to: `/lessons/${section.lesson_id}` })
        cy.reload()
        cy.get(".fa-pencil-square-o").click({ force: true })
        cy.get("#section_start_time")
          .should("have.class", "disabled")
          .should("be.disabled")
        cy.get("#section_end_time")
          .should("have.class", "disabled")
          .should("be.disabled")
        cy.get("#section_start_time")
          .should("not.have.class", "disabled")
          .should("not.be.disabled")
        cy.get("#section_end_time")
          .should("not.have.class", "disabled")
          .should("not.be.disabled")
      })
    })
  })
})
