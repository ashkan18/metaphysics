import { graphql, GraphQLNonNull, GraphQLString } from "graphql"
import { OrderType } from "schema/ecommerce/types/order"
import { RequestedFulfillmentFragment } from "./query_helpers"
export const Order = {
  name: "Order",
  type: OrderType,
  description: "Returns a single Order",
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  resolve: (_parent, { id }, context, { rootValue: { exchangeSchema } }) => {
    const query = `
      query EcommerceOrder($id: ID!) {
        ecommerce_order(id: $id) {
          id
          code
          currencyCode
          state
          partnerId
          userId
          creditCardId
          requestedFulfillment {
            ${RequestedFulfillmentFragment}
          }
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
          lineItems{
            edges{
              node{
                id
                priceCents
                artworkId
                editionSetId
                quantity
                fulfillments{
                  edges{
                    node{
                      id
                      courier
                      trackingId
                      estimatedDelivery
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    return graphql(exchangeSchema, query, null, context, {
      id,
    }).then(result => {
      if (result.errors) {
        throw Error(result.errors.map(d => d.message))
      }
      return result.data.ecommerce_order
    })
  },
}
