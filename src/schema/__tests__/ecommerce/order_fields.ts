import gql from "lib/gql"

const orderFields = gql`
  id
  code
  currencyCode
  state
  requestedFulfillment {
    ... on Ship {
      name
      addressLine1
      addressLine2
      city
      country
      postalCode
      region
    }
  }
  creditCard {
    brand
    id
    last_digits
  }
  itemsTotalCents
  taxTotalCents
  commissionFeeCents
  transactionFeeCents
  buyerTotalCents
  sellerTotalCents
  itemsTotal
  shippingTotal
  shippingTotalCents
  taxTotal
  commissionFee
  transactionFee
  buyerTotal
  sellerTotal
  updatedAt
  createdAt
  stateUpdatedAt
  stateExpiresAt
  partner {
    id
    name
  }
  user {
    id
    email
  }
  lineItems {
    edges {
      node {
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
        artwork {
          id
          title
          inventoryId
        }
      }
    }
  }
`

export default orderFields
