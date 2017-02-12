import { WebApp } from 'meteor/webapp';

WebApp.connectHandlers.use('/fb-messenger', (req, res) => {
  console.log('Processing webhook verification from Facebook...');
  console.log('Token: ', req.query['hub.verify_token']);
  console.log('Challenge: ', req.query['hub.challenge']);
  res.writeHead(200);
  if(req.query['hub.verify_token'] === 'peachypaws'){
    res.end(req.query['hub.challenge']);
  }else{
   res.end('Not peachy. Sorry.');
  }
});

function notifyAdmin() {
  console.log('Hey you!');
}

export { notifyAdmin };
