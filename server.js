const { ApolloServer } =  require('apollo-server');
const cors = require('cors');
const {config} = require('dotenv');
const typeDefs = require('./src/graphql/schema');
const resolvers = require('./src/graphql/resolvers');
const DBconnect = require('./src/config/db.config');
const getUserByToken = require('./src/_helpers/getUserByToken');

config();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const bearer = req.headers.authorization || '';
        if(!bearer) return null;
        const token = bearer.split('Bearer ')[1];
        const user = await getUserByToken(token);
        return {
            currentUser: user
        }
    }
});

DBconnect().then(_ => {
    console.info('Database connected  ');
    server
        .listen()
        .then(res => console.log(`GraphQL server running on: ${res.url}`))

})