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
type Mutation {
    table(num: Int): [Int]
    sum(a:Int,b:Int):Int
  }
`);

var root = {
    hello: () => 'Hello world!',
    aboutme: {
        name: () => "sudhir",
        phone: () => "7654627171",
        hobby: () => "learning",
    },

    table: function ({ num }) {
        return [...new Array(10)].map((_, i) => (i + 1) * num);
    },
    sum: (({ a, b }) => a + b),

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