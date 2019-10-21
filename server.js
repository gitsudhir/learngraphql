var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const fetch = require('node-fetch');
var schema = buildSchema(`
  type Query {
    hello: String
    aboutme:About
    todos:[Todo]
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

  type Todo{
    userId: Int
    id: Int
    title: String
    completed: Boolean
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
    todos: async () => {
        let res = await fetch(`https://jsonplaceholder.typicode.com/todos`)
        let data = await res.json()
        return data;
    }
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