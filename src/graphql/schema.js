const { gql } = require('apollo-server');

const typeDefs = gql`
type User{
    id: ID!
    username: String!
    email: String!
    password: String!
}

type Auth{
    token: String!
}
input UpdateInput{
    username: String
    email: String
    password: String

}
type Query{
    getUsers: [User]!
    getUserById(id: ID!): User!
    getUserByAuth(token: String!): User!
}

type Mutation{
    signup(
        username: String! 
        email: String! 
        password: String! 
        confirmPassword: String! 
        ): Auth! 
    login(
        email: String! 
        password: String! 
        ): Auth! 
    updateUserById(
        id: ID! 
        userData: UpdateInput
        ): User 
}


`;

module.exports = typeDefs;