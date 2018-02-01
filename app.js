const http      = require('http')
const url       = require('url')
const routes    = require('routes')()
const view      = require('swig')
const fs        = require('fs')

// assets
routes.addRoute("/style.css", function(req,res){
    fs.readFile("view/assets/css/style.css",function(err,data){
        res.writeHead(200,{'Content-Type':'text/css'})
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

routes.addRoute("/",function(req,res){
    let title = ['zulfikra','lahmudin','rifaizal']
    html  = view.compileFile('./view/home/index.html')({
        title:title,
    })  
    res.writeHead(200,{'Content-Type' : 'text/html'})
    res.end(html)
})



routes.addRoute("/detail/:name",function(req,res){
    res.writeHead(200,{'Content-Type' : 'text/plain'})
    res.end("hello " + this.params.name)
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