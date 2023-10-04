import app from './applicaiton/application.js';  
import config from './applicaiton/database/dbConfig.js';

const port = process.env.port;  //initialized a port to be used

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);   //main application.js file listens to the server.
});