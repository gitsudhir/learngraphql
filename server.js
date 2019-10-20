var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    aboutme:About
    table:[Int]
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
    },
    table: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

};

var app = express();
app.get('/', function (req, res) {
    res.send('hello world')
})
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(process.env.PORT || 4000, () => console.log('Now browse to localhost:4000/graphql'));