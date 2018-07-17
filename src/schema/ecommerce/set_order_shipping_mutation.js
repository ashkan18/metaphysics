import {
  graphql,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql"
import { OrderReturnType } from "./types/order_return"
import { mutationWithClientMutationId } from "graphql-relay"

const SetOrderShippingInputType = new GraphQLInputObjectType({
  name: "SetOrderShippingInput",
  fields: {
    orderId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Order ID",
    },
    fulfillmentType: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Fulfillment type",
    },
    shippingAddressLine1: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Shipping Address Line 1 ",
    },
    shippingAddressLine2: {
      type: GraphQLString,
      description: "Shipping Address Line 2",
    },
    shippingCity: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Shipping Address City",
    },
    shippingCountry: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Shipping Address Country",
    },
    shippingPostalCode: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Shipping Address Postal Code",
    },
  },
})

export const SetOrderShippingMutation = mutationWithClientMutationId({
  name: "SetOrderShipping",
  description: "Sets shipping information on an order.",
  inputFields: SetOrderShippingInputType.getFields(),
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
      mutation setOrderShipping($orderId: ID!, $fulfillmentType: string!, $shippingAddressLine1: string!, $shippingAddressLine2: string, $shippingCity: string!, $shippingCountry: string!, shippingPostalCode: $shippingPostalCode) {
        ecommerce_setShipping(input: {
          id: $orderId,
          fulfillmentType: $fulfillmentType,
          shippingAddressLine1: $shippingAddressLine1,
          shippingAddressLine2: $shippingAddressLine2,
          shippingCity: $shippingCity,
          shippingCountry: $shippingCountry,
          shippingPostalCode: $shippingPostalCode
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
      const { order, errors } = result.data.ecommerce_setShipping
      return {
        order,
        errors,
      }
    })
  },
})
