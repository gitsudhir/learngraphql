var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const fetch = require('node-fetch');
const { Client } = require('pg');

let client;
try {


    const connectionString = 'postgres://ufvzmttqiuribp:1f60d2a724b59b395f36d2256a553bd8a4fc0a0e7dcea47470b111c4582035fb@ec2-54-197-238-238.compute-1.amazonaws.com:5432/dbigvql5i88eu3';
    client = new Client({
        connectionString: process.env.DATABASE_URL || connectionString,
        ssl: true,

    });
    client.connect();




    var schema = buildSchema(`
  type Query {
    hello: String
    aboutme:About
    todos:[Todo]
    todoWithID(id:Int):Todo
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
    insertTodo(userId:Int,title:String,completed:Boolean):Todo

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
            const allTodoData = `
           SELECT * FROM todolist `;
            client.query(allTodoData)
                .then((res) => {
                    console.log(res.rows);
                    client.end();
                    return res.rows;
                })
                .catch((err) => {
                    console.log('SELECT:', err);
                    client.end();
                });

        },
        insertTodo: async ({ userId, title, completed }) => {
            // const data = { userId, title, completed };
            console.log('data:', JSON.stringify({ userId, title, completed }))
            const insertTodoData = `
            INSERT INTO todolist (userId, title, completed) VALUES
            (${userId}, '${title}', ${completed})`;
            client.query(insertTodoData)
                .then((res) => {
                    console.log(res);
                    client.end();
                    return { userId, title, completed }
                })
                .catch((err) => {
                    console.log('insert:', err);
                    client.end();
                });
        },
        todoWithID: function ({ id = 1 }) {
            console.log('id :>>>', id);

            const allTodoData = `
            SELECT * FROM todolist WHERE id=${id}`;
            console.log('query is :>>>', allTodoData);
            client.query(allTodoData)
                .then((res) => {
                    console.log(typeof res.rows[0]);
                    client.end();
                    // return res.rows[0];
                    return { id: 1, title: 'tum hi aana', userid: 1, completed: true }
                })
                .catch((err) => {
                    console.log('SELECT:', err);
                    client.end();
                });
        },

    };
} catch (error) {
    console.log('error: ', error)
} finally {
    // client.end();
}
var app = express();
app.get('/', function (req, res) {
    res.send('hello world')
})
app.get('/allTable', function (req, response) {

    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
            response.send(JSON.stringify(row))
        }
        response.end();
        client.end();
    });
})
app.get('/create', function (req, response) {
    const todoTable = `CREATE TABLE IF NOT EXISTS
    todolist(
      id SERIAL PRIMARY KEY,
      title VARCHAR(128) NOT NULL,
      userId INT NOT NULL,
      completed BOOLEAN NOT NULL
    )`;
    client.query(todoTable)
        .then((res) => {
            console.log(res);
            response.send(res);
            client.end();
        })
        .catch((err) => {
            console.log('guery:', err);
            response.send(err)
            client.end();
        });




    // res.send('hello world')
})
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(process.env.PORT || 4000, () => console.log('Now browse to localhost:4000/graphql'));