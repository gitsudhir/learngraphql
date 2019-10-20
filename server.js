var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    aboutme:About
  }
type About {
    id:ID
    name:String
    phone:String
    hobby:String
}
`);

var root = {
    hello: () => 'Hello world!',
    aboutme: {
        name: () => "sudhir",
        phone: () => "7654627171",
        hobby: () => "learning",
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));