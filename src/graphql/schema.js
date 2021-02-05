const { gql } = require('apollo-server');

const typeDefs = gql`
# Primary schema
type User{
    id: ID!
    username: String!
    email: String!
    password: String!
}

# Input types
input UpdateInput{
    id: ID!
    username: String!
    email: String!
    password: String!
}
# Other types
type Auth{
    token: String!
}
type ResponsePayload{
    status: Boolean!
    message: String
    error: String
    data: User
}
type DeleteResponse{
    status: Boolean!
    message: String
    error: String
    data: String
}
# Query and Mutations
type Query{
    getUsers: [User]!
    getUserById(id: ID!): User!
    getUserByAuth: User!
    
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
    ): ResponsePayload 
    removeUser(id: ID): DeleteResponse
}


`;

module.exports = typeDefs;