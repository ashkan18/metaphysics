import { graphql, GraphQLString } from "graphql"
import { OrderConnection } from "schema/ecommerce/types/order"
import { OrdersSortMethodTypeEnum } from "schema/ecommerce/types/orders_sort_method_enum"
import gql from "lib/gql"

export const Orders = {
  name: "Orders",
  type: OrderConnection,
  description: "Returns list of orders",
  args: {
    userId: { type: GraphQLString },
    partnerId: { type: GraphQLString },
    state: { type: GraphQLString },
    sort: { type: OrdersSortMethodTypeEnum },
  },
  resolve: (
    _parent,
    { userId, partnerId, state, sort },
    context,
    { rootValue: { exchangeSchema } }
  ) => {
    console.log("MP Query which will call exchangeSchema:")
    const query = gql`
      query EcommerceOrders(
        $userId: String
        $partnerId: String
        $state: EcommerceOrderStateEnum
        $sort: EcommerceOrderConnectionSortEnum
      ) {
        ecommerce_orders(
          userId: $userId
          partnerId: $partnerId
          state: $state
          sort: $sort
        ) {
          edges {
            node {
              id
              code
              currencyCode
              state
              partnerId
              userId
              updatedAt
              createdAt
              requestedFulfillment {
                ... on EcommerceShip {
                  country
                }
                ... on EcommercePickup {
                  fulfillmentType
                }
              }
              itemsTotalCents
              shippingTotalCents
              taxTotalCents
              commissionFeeCents
              transactionFeeCents
              buyerTotalCents
              sellerTotalCents
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
                  }
                }
              }
            }
          }
        }
      }
    `
    return graphql(exchangeSchema, query, null, context, {
      userId,
      partnerId,
      state,
      sort,
    }).then(result => {
      console.log("resolve in exchange gave ------>")
      console.log(result)
      if (result.errors) {
        throw Error(result.errors.map(d => d.message))
      }
      return result.data.ecommerce_orders
    })
  },
}
