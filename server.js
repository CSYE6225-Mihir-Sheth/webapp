import app from './applicaiton/application.js'; 
import config from './applicaiton/database/dbConfig.js'

const port = config.dbC.port;
// const port = process.env.port;  //initialized a port to be used

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);   //main application.js file listens to the server.
});

export default server;