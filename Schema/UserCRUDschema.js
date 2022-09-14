const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  graphql,
  buildSchema,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const {Pool,Client} = require("pg");
const joinMonster = require("join-monster")

const client = new Pool({
  database: "test_db2",
  user: "postgres",
  password: "root@123",
  host: "localhost",
  port: "5432",
});
client.connect();



exports.schema = buildSchema(`
    type Getdict{
        id : Int
        ids : String
    }
    type UserSchema{
        name : String
        username : String
        phoneno : Int
        getdict2 : Getdict
        getdict : Getdict
    }
    type Query {
        hello: String
        random: String
        intlist: [Int]
        user(id:Int): UserSchema
    }
    type Mutation{
        mutate: String
    }
`);







// var schema = buildSchema(`
//   type Query {
//     quoteOfTheDay: String
//     random: Float!
//     rollThreeDice: [Int]
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   quoteOfTheDay: () => {
//     return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
//   },
//   random: () => {
//     return Math.random();
//   },
//   rollThreeDice: () => {
//     return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6));
//   },
// };

const Users = new GraphQLObjectType({
  name: "Users",
  extensions: {
    joinMonster: {
      sqlTable: 'public."users"', // the SQL table is on the schema "public" called "users"
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLInt },
    fname: { type: GraphQLString },
    lname: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    friends: {
      type: new GraphQLList(Users),
      extensions: {
        joinMonster: {
          junction: {
            sqlTable: "public.friends",
            sqlJoins: [
              (usersTable, friendsTable, args) => {
                console.log(usersTable);
                console.log(friendsTable);
                return `${usersTable}.id = ${friendsTable}.user_id`;
              },
              (friendsTable, usersTable, args) => {
                console.log(usersTable);
                console.log(friendsTable);
                return `${friendsTable}.friends_id = ${usersTable}.id`;
              },
            ],
          },
        },
      },
    },
  }),
});

Users._typeConfig = {
  sqlTable: "users",
  uniqueKey: "id",
};

var Friends = new GraphQLObjectType({
  name: "Friends",
  extensions: {
    joinMonster: {
      sqlTable: 'public."friends"', // the SQL table is on the schema "public" called "users"
      uniqueKey: "id",
    },
  },
  fields: () => ({
    id: { type: GraphQLInt },
    user_id: { type: GraphQLInt },
    friends_id: { type: GraphQLInt },
  }),
});

Friends._typeConfig = {
  sqlTable: "friends",
  uniqueKey: "id",
};

exports.QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    hello: {
      type: GraphQLString,
      resolve: () => "Hello world!",
    },
    users: {
      type: new GraphQLList(Users),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          console.log(sql);
          return client.query(sql);
        });
      },
    },
    user: {
      type: Users,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      extensions: {
        joinMonster: {
          where: (userTable, args, context) => `${userTable}.id = ${args.id}`
        }
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          console.log(sql)
          return client.query(sql);
        });
      },
    },
  }
  )
});


exports.MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    user: {
      type: Users,
      args: {
        first_name: { type: new GraphQLNonNull(GraphQLString) },
        last_name: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          return (
            await client.query(
              "INSERT INTO public.users (fname, lname, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
              [args.first_name, args.last_name, args.username, args.password]
            )
          ).rows[0];
        } catch (err) {
          throw new Error("Failed to insert new player");
        }
      },
    },
  }),
});

