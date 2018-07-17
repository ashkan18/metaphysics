import { graphql } from "graphql"
import { OrderReturnType } from "./types/order_return"
import { OrderMutationInputType } from "./types/order_mutation_input"
import { mutationWithClientMutationId } from "graphql-relay"

export const ApproveOrderMutation = mutationWithClientMutationId({
  name: "ApproveOrder",
  description: "Approves an order with payment",
  inputFields: OrderMutationInputType.getFields(),
  outputFields: {
    result: {
      type: OrderReturnType,
      resolve: order => order,
    },
  },
  mutateAndGetPayload: (
    { orderId },
    context,
    { rootValue: { accessToken, exchangeSchema } }
  ) => {
    if (!accessToken) {
      return new Error("You need to be signed in to perform this action")
    }
    const mutation = `
      mutation approveOrder($orderId: ID!) {
        ecommerce_approveOrder(input: {
          id: $orderId,
        }) {
          order {
            id
            code
            currencyCode
            state
            partnerId
            userId
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
    }).then(result => {
      const { order, errors } = result.data.ecommerce_approveOrder
      return {
        order,
        errors,
      }
    })
  },
})
