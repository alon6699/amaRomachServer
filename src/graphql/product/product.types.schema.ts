import { gql } from 'apollo-server';
import { DocumentNode } from 'graphql';

export const ProductTypeDef: DocumentNode = gql`
    type Product {
        id: String!
        name: String!
        description: String
        price: Int
        image: String
        limit: Int
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