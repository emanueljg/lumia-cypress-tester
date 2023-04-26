Feature: Search and view products
  As a user I want to be able to search and view products,
  so that I can add add them to the cart.

  Background:
    Given that I am on the start page

  Scenario: No search
    Given that the user has not searched for anything
    Then the search field should display "Type to search"
    And the search result display should not appear

  Scenario Outline: Search for products
    Given that the user has not searched for anything
    When I type "<text>" in the search field
    Then "<products>" should appear as the search result

    Examples:
      | text     | products                        |    
      | Taklampa | Taklampa                        |
      | tAkLaMpA | Taklampa                        |
      | lampa    | Taklampa;;Bordslampa;;Golvlampa |

  Scenario: Dynamically update search result
    Given that the user has not searched for anything
    When I type "g" in the search field
    Then "Golvlampa;;Spotlight" should appear as the search result
    When I type "o" in the search field
    Then "Golvlampa" should appear as the search result

  Scenario Outline: View product info
    Given that I have searched for "<products>"
    Then product info should display

    Examples:
      | products    |
      | Taklampa   |
      | Bordslampa |
      | Golvlampa  |
  
  Scenario Outline: Toggle product image preview
    Given that I have searched for "<product>"
    When I click on the product thumbnail
    Then the product image preview should appear 
    And product info should display
    When I click anywhere on the image preview
    Then the image preview should disappear

    Examples:
      | product    |
      | Taklampa   |
      | Bordslampa |
      | Golvlampa  |
  

  
