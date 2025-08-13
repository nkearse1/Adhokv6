// @ts-nocheck
/* eslint-disable */

describe('accept bid flow', () => {
  it('shows upsell modal for non-subscribers', () => {
    cy.login('client-free');
    cy.visit('/projects/1/bids');
    cy.get('[data-testid="bid-accept"]').first().click();
    cy.get('[data-testid="upsell-modal"]').should('be.visible');
  });

  it('allows per-project unlock', () => {
    cy.login('client-free');
    cy.visit('/projects/1/bids');
    cy.get('[data-testid="bid-accept"]').first().click();
    cy.get('[data-testid="project-unlock"]').click();
    cy.get('[data-testid="bid-accept"]').first().should('not.be.disabled');
  });

  it('disables other bids after acceptance', () => {
    cy.login('client-pro');
    cy.visit('/projects/1/bids');
    cy.get('[data-testid="bid-accept"]').first().click();
    cy.get('[data-testid="bid-accept"]').first().should('be.disabled');
    cy.get('[data-testid="bid-accept"]').eq(1).should('be.disabled');
  });
});
