/* eslint-disable promise/always-return */

import { runQuery } from "test/utils"
import { mockxchange } from "test/fixtures/exchange/mockxchange"
import sampleOrder from "test/fixtures/results/sample_order"
import exchangeOrderJSON from "test/fixtures/exchange/order.json"
import orderFields from "./order_fields"

let rootValue

describe("Order type", () => {
  beforeEach(() => {
    const resolvers = { Query: { order: () => exchangeOrderJSON } }

    rootValue = mockxchange(resolvers)
  })
  it("fetches order by id", () => {
    const query = `
      {
        order(id: "52dd3c2e4b8480091700027f") {
          ${orderFields}
        }
      }
    `

    return runQuery(query, rootValue).then(data => {
      expect(data.order).toEqual(sampleOrder(true, true, true))
    })
  })
})
