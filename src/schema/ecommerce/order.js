import { graphql, GraphQLNonNull, GraphQLString } from "graphql"
import { OrderType } from "schema/ecommerce/types/order"
import gql from "lib/gql"

export const Order = {
  name: "Order",
  type: OrderType,
  description: "Returns a single Order",
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  resolve: (_parent, { id }, context, { rootValue: { exchangeSchema } }) => {
    const query = gql`
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
            ... on EcommerceShip {
              name
              addressLine1
              addressLine2
              city
              country
              postalCode
              region
            }
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
          lineItems {
            edges {
              node {
                id
                priceCents
                artworkId
                editionSetId
                quantity
                fulfillments {
                  edges {
                    node {
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
