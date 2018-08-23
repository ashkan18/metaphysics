import { graphql } from "graphql"
import { OrderReturnType } from "schema/ecommerce/types/order_return"
import { OrderMutationInputType } from "schema/ecommerce/types/order_mutation_input"
import { mutationWithClientMutationId } from "graphql-relay"

export const RejectOrderMutation = mutationWithClientMutationId({
  name: "RejectOrder",
  description: "Rejects an order",
  inputFields: OrderMutationInputType.getFields(),
  outputFields: {
    result: {
      type: OrderReturnType,
      resolve: order => order,
    },
  },
  mutateAndGetPayload: (
    { orderId, creditCardId },
    context,
    { rootValue: { accessToken, exchangeSchema } }
  ) => {
    if (!accessToken) {
      return new Error("You need to be signed in to perform this action")
    }

    const mutation = `
      mutation rejectOrder($orderId: ID!) {
        ecommerce_rejectOrder(input: {
          id: $orderId,
        }) {
          order {
           id
            code
            currencyCode
            state
            partnerId
            userId
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
            lineItems{
              edges{
                node{
                  id
                  priceCents
                  artworkId
                  editionSetId
                  quantity
                }
              }
            }
          }
          errors
        }
      }
    `
    return graphql(exchangeSchema, mutation, null, context, {
      orderId,
      creditCardId,
    }).then(result => {
      if (result.errors) {
        throw Error(result.errors.map(d => d.message))
      }
      const { order, errors } = result.data.ecommerce_rejectOrder
      return {
        order,
        errors,
      }
    })
  },
})
