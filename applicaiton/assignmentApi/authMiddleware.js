export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).send('Invalid credentials'); 
    }
  
    const base64Credentials = authHeader.split(' ')[1];
    
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    
    const [email, password] = credentials.split(':');
    
    // authenticate credentials
    
    if(!isValid) {
      return res.status(401).send('Invalid credentials');
    }
  
    req.user = email;
  
    next();
  }