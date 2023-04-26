Feature: Cart usage
  As a user I want to add products to my cart,
  preview it cart and fill in payment info 
  so that I can make a purchase. 

  Background:
    Given that I am on the start page
    And that I have searched for "lampa"

  Scenario Outline: Successful purchase 
    When I add "<quantities>" "<products>" to cart
    And I go to checkout
    And I fill out sensible payment info
    And click pay
    Then it should confirm my payment
    And clear the cart

    Examples:
      | products                        | quantities | 
      | Taklampa                        | 1          |
      | Golvlampa                       | 2          |
      | Taklampa;;Golvlampa;;Bordslampa | 1;;2;;3    |

  Scenario Outline: Product bulk price 
    When I add "<quantities>" "<products>" to cart
    Then their bulk prices should match price * qty

    Examples:
      | products                        | quantities | 
      | Taklampa                        | 1          |
      | Golvlampa                       | 2          |
      | Taklampa;;Golvlampa;;Bordslampa | 1;;2;;3    |

  Scenario Outline: Total cart price
    When I add "<quantities>" "<products>" to cart
    Then the cart price should equal all bulk prices

    Examples:
      | products                        | quantities | 
      | Taklampa                        | 1          |
      | Golvlampa                       | 2          |
      | Taklampa;;Golvlampa;;Bordslampa | 1;;2;;3    |

  Scenario Outline: CardNbr check
    When I try paying using CardNbr "<card>"
    Then paying "<outcome>"

    Examples:
      | card                       | outcome |
      | eggs bacon spam!           | fails   |
      | 020406081012               | fails   |
      | 02040608101214161820222426 | fails   |
      | 0204060810121416           | works   |

  Scenario: Payment sum
    When I add "2" "Taklampa" to cart
    Then pay
    Then the payment should equal the cart total
  
