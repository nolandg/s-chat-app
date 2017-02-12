import { WebApp } from 'meteor/webapp';

WebApp.connectHandlers.use('/fb-messenger', (req, res) => {
  console.log(req.body);
  res.writeHead(200);
  res.end('Hello world');
});

function notifyAdmin() {
  console.log('Hey you!');
}

export { notifyAdmin };
