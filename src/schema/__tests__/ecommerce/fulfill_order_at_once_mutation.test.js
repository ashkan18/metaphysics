/* eslint-disable promise/always-return */
import { runQuery } from "test/utils"
import { mockxchange } from "test/fixtures/exchange/mockxchange"
import sampleOrder from "test/fixtures/results/sample_order"
import exchangeOrderJSON from "test/fixtures/exchange/order.json"
import orderFields from "./order_fields"
import gql from "lib/gql"

let rootValue

describe("Fulfill Order at Once Mutation", () => {
  beforeEach(() => {
    const resolvers = {
      Mutation: {
        fulfillAtOnce: () => ({
          order: exchangeOrderJSON,
          errors: [],
        }),
      },
    }

    rootValue = mockxchange(resolvers)
  })
  it("fulfills the order and return it", () => {
    const mutation = gql`
      mutation {
        fulfillOrderAtOnce(input: {
            orderId: "111",
            fulfillment: {
              courier: "fedEx",
              trackingId: "track1",
              estimatedDelivery: "2018-05-18"
            }
          }) {
            result {
              order{
                ${orderFields}
              }
            }
          }
        }
    `

    return runQuery(mutation, rootValue).then(data => {
      expect(data.fulfillOrderAtOnce.result.order).toEqual(
        sampleOrder(true, true)
      )
    })
  })
})
