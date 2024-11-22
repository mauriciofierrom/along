describe("Section", () => {
  it("Loads the section", () => {
    cy.appFactories([["create", "section"]]).then(([section]) => {
      console.log(section)

      cy.forceLogin({ redirect_to: "/lessons"})
      cy.get(".video-card > .title").click()
      cy.findByText(section.name).should('exist')
    })
  })
})
