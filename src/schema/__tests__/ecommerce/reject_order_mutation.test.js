/* eslint-disable promise/always-return */
import { runQuery } from "test/utils"
import { mockxchange } from "test/fixtures/exchange/mockxchange"
import sampleOrder from "test/fixtures/results/sample_order"
import exchangeOrderJSON from "test/fixtures/exchange/order.json"

let rootValue

describe("Reject Order Mutation", () => {
  beforeEach(() => {
    const resolvers = {
      Mutation: {
        rejectOrder: () => ({
          order: exchangeOrderJSON,
          errors: [],
        }),
      },
    }
    rootValue = mockxchange(resolvers)
  })
  it("fetches order by id", () => {
    const mutation = `
      mutation {
        rejectOrder(input: {
            orderId: "111",
          }) {
            result {
              order {
                id
                code
                currencyCode
                state
                fulfillmentType
                shippingAddressLine1
                shippingAddressLine2
                shippingCity
                shippingCountry
                shippingPostalCode
                itemsTotalCents
                shippingTotalCents
                taxTotalCents
                commissionFeeCents
                transactionFeeCents
                buyerTotalCents
                sellerTotalCents
                updatedAt
                createdAt
                stateUpdatedAt
                stateExpiresAt
                partner {
                  id
                  name
                }
                user {
                  id
                  email
                }
                lineItems {
                  edges {
                    node {
                      artwork {
                        id
                        title
                        inventoryId
                      }
                    }
                  }
                }
              }
            errors
            }
          }
        }
    `

    return runQuery(mutation, rootValue).then(data => {
      expect(data.rejectOrder.result.order).toEqual(sampleOrder)
    })
  })
})
