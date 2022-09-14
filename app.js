const { Router } = require("express");
const express = require("express");
const express_obj = express();
const Routers = express.Router();
const g_routes = require("./Routes/GraphqlRoutes")
const cors = require("cors")

express_obj.use(cors())
express_obj.use(express.json());
express_obj.use(express.urlencoded({ extended: true }));

var { graphql, buildSchema, GraphQLSchema } = require("graphql");
var { graphqlHTTP } = require("express-graphql");

const { schema, QueryRoot, MutationRoot } = require("./Schema/UserCRUDschema");
const { root  } = require("./Resolvers/UserResolver");



express_obj.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

const schema2 = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot
});

// Create the Express app

express_obj.use(
  "/api",
  graphqlHTTP({
    schema: schema2,
    graphiql: true,
  })
);



module.exports.Routers = Routers
module.exports.express_obj = express_obj;