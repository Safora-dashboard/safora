import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = new URL('../dist/', import.meta.url);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(path.includes('..'))throw Error();const name=path==='/'?'index.html':path.slice(1);const data=await readFile(new URL(name,root));res.writeHead(200,{'Content-Type':types[name.slice(name.lastIndexOf('.'))]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(4175,'127.0.0.1',()=>console.log('Local: http://localhost:4175'));
