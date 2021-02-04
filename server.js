const { ApolloServer } =  require('apollo-server');
const typeDefs = require('./src/graphql/schema');
const resolvers = require('./src/graphql/resolvers');
const DBconnect = require('./src/config/db.config')
const server = new ApolloServer({
    typeDefs,
    resolvers
});

DBconnect().then(_ => {
    console.info('Database connected  ');
    server
        .listen()
        .then(res => console.log(`GraphQL server running on: ${res.url}`))

})