import { gql } from "apollo-server";
import { DocumentNode } from "graphql";

export const productsSchema: DocumentNode = gql`
  extend type Query {
    getProducts: [Product]
    getProduct(id: ID!): Product
  }
  
  extend type Mutation {
    createProduct(product: ProductInput!): Product
    updateProduct(id: ID!, product: productUpdateInput!): Product
    deleteProduct(id: ID!): Product
    updateProductInCart(id: ID!, amount: Int!): Product
    checkout: Boolean
  }

  extend type Subscription {
    productUpdates: Product
  }
`;
