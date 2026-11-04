import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createConnection } from 'node:net';

// Native PostgreSQL for local development; no Windows services or system accounts are created.
if(!process.env.DATABASE_URL)throw new Error('Run npm run env:setup first.');
const url=new URL(process.env.DATABASE_URL);
if(!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('db:local only supports localhost.');
const port=Number(url.port||5432),name=decodeURIComponent(url.pathname.slice(1));
if(!/^[a-zA-Z][a-zA-Z0-9_]{0,62}$/.test(name))throw new Error('Invalid local database name.');
const occupied=await new Promise(resolvePromise=>{
 const socket=createConnection({host:'127.0.0.1',port});
 socket.setTimeout(1500);socket.on('connect',()=>{socket.destroy();resolvePromise(true)});
 socket.on('error',()=>resolvePromise(false));socket.on('timeout',()=>{socket.destroy();resolvePromise(false)});
});
if(occupied)throw new Error(`Port ${port} is occupied. Use the running database or change .env before initialization.`);
const databaseDir=resolve('.data/postgres');
const startupMessages=[];
const record=message=>{startupMessages.push(String(message).replaceAll(decodeURIComponent(url.password),'[redacted]'));if(startupMessages.length>10)startupMessages.shift()};
const postgres=new EmbeddedPostgres({
 databaseDir,port,user:decodeURIComponent(url.username),password:decodeURIComponent(url.password),
 persistent:true,createPostgresUser:false,authMethod:'scram-sha-256',
 initdbFlags:['--encoding=UTF8','--locale=C'],postgresFlags:['-h','127.0.0.1'],
 onLog:record,onError:record,
});
try{
 if(!existsSync(resolve(databaseDir,'PG_VERSION')))await postgres.initialise();
 await postgres.start();
}catch{throw new Error('Local PostgreSQL startup failed: '+startupMessages.join('\n'))}
let timer;
try{
 const client=postgres.getPgClient('postgres','127.0.0.1');
 await client.connect();
 try{
  const result=await client.query('SELECT 1 FROM pg_database WHERE datname = $1',[name]);
  if(!result.rowCount)await client.query(`CREATE DATABASE "${name}"`); // name is restricted above; identifiers cannot be bind parameters.
 }finally{await client.end()}
 console.log(`PostgreSQL 16 ready on 127.0.0.1:${port}. Data: .data/postgres. Keep this terminal open. Ctrl+C stops the server and preserves data.`);
 timer=setInterval(()=>{},60000);
}catch(error){await postgres.stop();throw error}
let stopping=false;
async function stop(){if(stopping)return;stopping=true;clearInterval(timer);await postgres.stop();process.exit(0)}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
