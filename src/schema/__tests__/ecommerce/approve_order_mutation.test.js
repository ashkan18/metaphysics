/* eslint-disable promise/always-return */
import { runQuery } from "test/utils"
import sampleOrder from "test/fixtures/results/sample_order"
import exchangeOrderJSON from "test/fixtures/exchange/order.json"
import { mockxchange } from "test/fixtures/exchange/mockxchange"
import orderFields from "./order_fields"

let rootValue

describe("Approve Order Mutation", () => {
  beforeEach(() => {
    const resolvers = {
      Mutation: {
        approveOrder: () => ({
          order: exchangeOrderJSON,
          errors: [],
        }),
      },
    }

    rootValue = mockxchange(resolvers)
  })
  it("approves order and returns order", () => {
    const mutation = `
      mutation {
        approveOrder(input: {
            orderId: "111",
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
      expect(data.approveOrder.result.order).toEqual(sampleOrder(true, false))
    })
  })
})
