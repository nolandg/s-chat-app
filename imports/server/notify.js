import { WebApp } from 'meteor/webapp';

const http = require('http');
const Bot = require('messenger-bot');

WebApp.connectHandlers.use('/x', (req, res) => {
  console.log('Processing webhook verification from Facebook...');
  console.log('Token: ', req.query['hub.verify_token']);
  console.log('Challenge: ', req.query['hub.challenge']);
  res.writeHead(200);
  if (req.query['hub.verify_token'] === 'peachypaws') {
    res.end(req.query['hub.challenge']);
  } else {
    res.end('Not peachy. Sorry.');
  }
});

const bot = new Bot({
  token: 'EAAUiVTkV4osBAO1D1zKlvhXdn6Wggk07mPIjDDyr8KnvflPc7ECSAibJ5J3NDKsw7mWDrkaRgZCEWgef3lmN2cPaRYhqNi4UFmc8SX5bsQxKTaMDvWZBqJaiNKdV9CrmYQEMZCgQpLxuqZB8S8ZA4SbHx7u0WXXaTsyRKNHPZBTgZDZD',
  verify: 'peachypaws',
  app_secret: 'a9965387317cec7bc0a4d535dd935cd8',
});

bot.on('error', (err) => {
  console.log(err.message);
});

bot.on('message', (payload, reply) => {
  console.log('on message');
  const text = payload.message.text;

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err;

    reply({ text }, (err) => {
      if (err) throw err;
	  console.log('sender: ', payload.sender);
	  console.log('Profile: ', profile);
      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`);
    
      notifyAdmin();  
	});
  });
});

function notifyAdmin() {
 bot.sendMessage(1425630790804760, {text: 'Test message'}, (error, info) => {
   if (error) {
       console.error(error);
       return;
     }
  
     console.log(info);
   });
}

http.createServer(bot.middleware()).listen(7034);
export { notifyAdmin };
