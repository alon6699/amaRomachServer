import { gql } from 'apollo-server';
import { DocumentNode } from 'graphql';

export const ProductTypeDef: DocumentNode = gql`
    type Product {
        id: ID!
        name: String!
        description: String
        price: Int
        image: String
        limit: Int
        deleted: Boolean
    }

    input productUpdateInput {
    name: String
    description: String
    price: Int
    image: String
    limit: Int
    }

    input ProductInput {
    name: String!
    description: String!
    price: Int!
    image: String!
    limit: Int
    }
`;