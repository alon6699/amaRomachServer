import { gql } from 'apollo-server';
import { DocumentNode } from 'graphql';

export const Product: DocumentNode = gql`
type Query {
    id: String!
    name: String!
    description: String
    price: Number
    image: String
    limit: Number
}
`; 