const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');

const todos = [];

var requestListener = (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
     'Content-Type': 'application/json'
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
      // 確定有 id
  } else if ( req.url.startsWith("/todos/") && req.method==="PATCH" ) {
    req.on('end', () => {
      // 確定 資料類型為JSON，不然 JSON.parse 就錯誤進到 catch 去了
      try {
        const id = req.url.split('/').pop();
        const index = todos.findIndex( element => element.id === id );
        const title = JSON.parse(body).title;
        // 確定有那筆 id
        // 確定有 title 資料
        if( index !== -1 && title !== undefined) {
          todos[index].title = title;
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

