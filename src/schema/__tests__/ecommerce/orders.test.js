/* eslint-disable promise/always-return */

import { runQuery } from "test/utils"
import { mockxchange } from "test/fixtures/exchange/mockxchange"
import sampleOrder from "test/fixtures/results/sample_order"
import exchangeOrdersJSON from "test/fixtures/exchange/orders.json"
import orderFields from "./order_fields"
import gql from "lib/gql"

let rootValue

describe("Order type", () => {
  beforeEach(() => {
    const resolvers = {
      Query: {
        orders: () => {
          console.log("Returning from mocked resolver in exchange:")
          console.log(exchangeOrdersJSON)
          return exchangeOrdersJSON
        },
      },
    }
    rootValue = mockxchange(resolvers)
  })

  it("fetches order by partner id", () => {
    const query = gql`
      {
        orders(partnerId: "581b45e4cd530e658b000124") {
          edges {
            node {
              ${orderFields}
            }
          }
        }
      }
    `

    return runQuery(query, rootValue).then(data => {
      console.log(data)
      expect(data.orders.edges[0].node).toEqual(sampleOrder(true, false))
    })
  })
})
