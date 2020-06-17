import { gql } from "apollo-server";
import { DocumentNode } from "graphql";

export const productsSchema: DocumentNode = gql`
  extend type Query {
    getProducts: [Product]
    getProduct(id: String!): Product
  }
  
  extend type Mutation {
    createProduct(product: ProductInput!): Product
    updateProduct(id: String!, product: productUpdateInput!): Product
    deleteProduct(id: String!): Product
    updateProductInCart(id: String!, amount: Int!): Product
    checkout: Boolean
  }

  extend type Subscription {
    productUpdates: Product
  }
`;
