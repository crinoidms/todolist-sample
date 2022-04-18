const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');

const todos = [];

var requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content"ype, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
        "Content-Type": "application/json"
    }
    let body = "";
    req.on('data', chunk =>{
      body += chunk;
    })
    if( req.url==="/todos" && req.method==="GET" ){
        res.writeHead( 200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    } else if (req.url==="/todos" && req.method==="POST") {
      req.on('end', () => {
        try {
          const title = JSON.parse(body).title;
          console.log(title);
          if ( title !== undefined) {
            const newTodo = {
              "title": title,
              "id": uuidv4()
            }
            todos.push(newTodo);
            res.writeHead( 200, headers);
            res.write(JSON.stringify({
              "status": "success",
              "data": todos
            }));
            res.end();
          } else {
            errHandle(res);
          }
        } catch (error) {
          errHandle(res);
        }
      })
    } else if ( req.url==="/todos" && req.method==="DELETE" ) {
        todos.length = 0;
        res.writeHead( 200, headers);
        res.write(JSON.stringify({
          "status": "success",
          "data": todos
        }));
        res.end();
    } else if ( req.url.startsWith("/todos/") && req.method==="DELETE" ) {
      const id = req.url.split('/').pop();
      const index = todos.findIndex( element => element.id === id );
      console.log(index, id);
      console.log(todos);
      if( index !== -1) {
        todos.splice(index, 1);
        res.writeHead( 200, headers);
        res.write(JSON.stringify({
          "status": "success",
          "data": todos
        }));
        res.end();
      } else {
        errHandle(res);
      }
  } else if ( req.url.startsWith("/todos/") && req.method==="PATCH" ) {
    req.on('end', () => {
      try {
        const id = req.url.split('/').pop();
        const index = todos.findIndex( element => element.id === id );
        console.log(index, id);
        console.log(todos);
        if( index !== -1) {
          todos.splice(index, 1);
          res.writeHead( 200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos
          }));
          res.end();
        } else {
          errHandle(res);
        }
        const title = JSON.parse(body).title;
        console.log(title);
        if ( title !== undefined) {
          const newTodo = {
            "title": title,
            "id": uuidv4()
          }
          todos.push(newTodo);
          res.writeHead( 200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos
          }));
          res.end();
        } else {
          errHandle(res);
        }
      } catch (error) {
        errHandle(res);
      }
    })
} else if (req.method==="OPTIONS") {
        res.writeHead( 200, headers);
        res.end();
    } else {
        res.writeHead( 404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
}

var server = http.createServer(requestListener);
server.listen( process.env.PORT || 3005);  // heroku 設定用
// server.listen(3005);


// db.posts.insertOne({
// 	"name":"貼文姓名",
//     "image":"貼文圖片",
// "content":"貼文內容",
// "likes":2,
// "comments":355,
// "createdAt":"發文時間",
// "type":"貼文種類",
// "tags":"貼文標籤",
// })

// const checkScore = new Promise( score => {
//     if( score >= 60 ) {
//         console.log(score);
//     } else {
//         console.log("不及格");
//     }
// })


// const checkScore = (score) => {
//     return new Promise(function(resolve, reject) {
//       if (score >= 60) {
//         resolve(scroe + "及格");
//       } else {
//         reject("不及格");
//       }
//     })
//   }

// const randomScore = Math.round(Math.random()*100);

// checkScore(randomScore)
//   .then((res)=>{
//     console.log(res);
//   })
//   .catch((error)=>{
//     console.log(error);  
//   });