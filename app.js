const express = require('express');
const cluster =  require('cluster');
const core = require('os'); 
const PORT = 8080;
const app = express();
if(cluster.isMaster){
    console.log(`Prceso primario con pid ${process.pid} corriendo`);
    for(let i=0;i<core.cpus().length;i++){
        cluster.fork();
    }
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`worker ${worker.process.pid} murió :(`)
        cluster.fork();
        console.log(`worker restaurado`)
    })
}else{
    console.log(`Soy un worker con pid ${process.pid}`)
    app.listen(PORT, ()=> console.log(`Worker ${process.pid} en el puerto ${PORT}`))
}

app.get('/info', (req,res)=>{
    let today = new Date();
    let date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    res.send(`Esta servidor tiene  ${core.cpus().length} procesadores y esta escuchando en el puerto ${PORT} - PID ${process.pid} - ${date}`)
})

app.get('/api/randoms', (req,res)=>{
    let random = generateRandom(0,10000000)
    console.log(`Peticion al worker ${process.pid}`)
    res.send(`el numero random es ${random}  y esta con el worker ${process.pid}`)
})
