const http      = require('http')
const url       = require('url')
const routes    = require('routes')()
const view      = require('swig')
const fs        = require('fs')
const mysql     = require('mysql')
const qs        = require('querystring')
// config mysql
let con = mysql.createConnection({
    host:"localhost",
    user:'root',
    password:'',
    database:'crossnet'
})

// assets
routes.addRoute("/style.css", function(req,res){
    fs.readFile("view/assets/css/style.css",function(err,data){
        res.writeHead(200,{'Content-Type':'text/css'})
        res.write(data)
        res.end()
    })
})
routes.addRoute("/datetime.css", function(req,res){
    fs.readFile("view/assets/css/datetime.css",function(err,data){
        res.writeHead(200,{'Content-Type':'text/css'})
        res.write(data)
        res.end()
    })
})

routes.addRoute("/datetime.full.js", function(req,res){
    fs.readFile("view/assets/js/datetime.full.js",function(err,data){
        res.writeHead(200,{'Content-Type':'text/js'})
        res.write(data)
        res.end()
    })
})

// route
routes.addRoute("/login",function(req,res){
    html  = view.compileFile('./view/auth/index.html')()
    res.writeHead(200,{'Content-Type' : 'text/html'})
    res.end(html)
})

routes.addRoute("/dialy",function(req,res){
        if(req.method.toUpperCase() == "GET"){
            con.query("SELECT * FROM dialy_activity", function(err, result, field){  
                html  = view.compileFile('./view/home/index.html')({
                    data:result
                })  
                res.writeHead(200,{'Content-Type' : 'text/html'})
                res.end(html)
            }) 
        }
        
        if(req.method.toUpperCase() == 'POST'){
            var formData = ""
            req.on('data',function(chunck){
               formData += chunck
            })
            req.on("end", function(){              
                var data    = qs.parse(formData.toString())  
                var sql     = `INSERT INTO dialy_activity (nama,keterangan,status,start_datetime,end_datetime,alamat,user_id) VALUES ('${data.nama}','${data.keterangan}','${data.status}','${data.start_datetime}','${data.end_datetime}','${data.alamat}',1)`
                con.query(sql,function(err,result){
                    if(err) throw err
                    res.writeHead(302,{
                        'Location':'/dialy'
                    })
                    res.end()   
                }) 
                    
            })
            
        }

})

routes.addRoute("/dialy/delete/",function(req,res){
    if(req.method.toUpperCase() == 'POST'){
        var formData = ""
        req.on('data',function(chunk){
            formData += chunk
            
        })

        req.on('end', function(){
            var data = qs.parse(formData.toString())
            var sql = `DELETE FROM dialy_activity WHERE id=${data.id}`
            con.query(sql, function(err,result){
                res.writeHead(302,{'Location' : '/dialy'})
                res.end()
            })
            
        })
    }
})



// server
http.createServer(function(req,res){
   let path = url.parse(req.url).pathname
   let match = routes.match(path)

   if(match){
        match.fn(req,res)
   }else{
        res.writeHead(404,{
            'Content-Type': 'text/html'
        })
        res.end("No found")
   }
}).listen(8080, function(){
    console.log("server start 8080")
})