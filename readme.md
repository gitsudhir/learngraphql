# learn graphql as fullstack developer

## in postman
- url : `http://localhost:4000/graphql`
- Method : `POST`

*Query*
```bash
mutation ($userId:Int,$title:String,$completed:Boolean){
 insertTodo(userId:$userId,title:$title,completed:$completed){
     title
     userId
     completed
 }
}
 
```

*GRAPHQL VARIABLES*
```javascript
     {
        "title": "tum hi aana",
        "userId": 12,
        "completed": true
      }
```
*image*
![image](./img/mutationpost.png)