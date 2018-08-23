import {
  makeExecutableSchema,
  transformSchema,
  RenameTypes,
  RenameRootFields,
} from "graphql-tools"
import fs from "fs"
import path from "path"

export const mockxchange = resolvers => {
  const typeDefs = fs.readFileSync(
    path.resolve(__dirname, "../../../data/exchange.graphql"),
    "utf8"
  )

  const defaultUnionResolvers = {
    OrderOrFailureUnion: {
      __resolveType(obj, context, info) {
        if (obj.order) {
          return "OrderWithMutationSuccess"
        } else if (obj.error) {
          return "OrderWithMutationFailure"
        }
      },
    },
    RequestedFulfillmentUnion: {
      __resolveType(obj, context, info) {
        if (obj.country) {
          return "Ship"
        } else if (obj.error) {
          return "Pickup"
        }
      },
    },
  }

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: { ...defaultUnionResolvers, ...resolvers },
  })

  // namespace schema similar to src/lib/stitching/exchange/schema.ts
  const exchangeSchema = transformSchema(schema, [
    new RenameTypes(name => {
      return `Ecommerce${name}`
    }),
    new RenameRootFields((_operation, name) => `ecommerce_${name}`),
  ])

  const partnerLoader = sinon.stub().returns(
    Promise.resolve({
      id: "111",
      name: "Subscription Partner",
    })
  )

  const userByIDLoader = sinon.stub().returns(
    Promise.resolve({
      id: "111",
      email: "bob@ross.com",
    })
  )

  const creditCardLoader = sinon.stub().returns(
    Promise.resolve({
      id: "card123",
      brand: "Visa",
      last_digits: "4242",
    })
  )

  const authenticatedArtworkLoader = sinon.stub().returns(
    Promise.resolve({
      id: "hubert-farnsworth-smell-o-scope",
      title: "Smell-O-Scope",
      display: "Smell-O-Scope (2017)",
      inventory_id: "inventory note",
    })
  )

  const accessToken = "open-sesame"

  return {
    exchangeSchema,
    partnerLoader,
    userByIDLoader,
    creditCardLoader,
    authenticatedArtworkLoader,
    accessToken,
  }
}
