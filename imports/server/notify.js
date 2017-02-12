import { WebApp } from 'meteor/webapp';

const http = require('http');
const Bot = require('messenger-bot');

WebApp.connectHandlers.use('/fb-messenger', (req, res) => {
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
  token: 'EAAUiVTkV4osBAIwXYYT6DQJRhhZCxZBZBIVhKZBZCr47S5RYKGDlOKvGX5BxTYnVqnxdpz289uvNXhfyGDZBMeKncPERndXRZAKDv9ya9rYLCo26gtiN0qsws2AZBEwnICZBM3e1moSlRYZCuZBb18RiYVowpGhdut75LO02sPkV4EgzAZDZD',
  verify: 'peachypaws',
  app_secret: 'a9965387317cec7bc0a4d535dd935cd8',
});

bot.on('error', (err) => {
  console.log(err.message);
});

bot.on('message', (payload, reply) => {
  const text = payload.message.text;

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err;

    reply({ text }, (err) => {
      if (err) throw err;

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`);
    });
  });
});

function notifyAdmin() {
  // bot.sendMessage(881570267, 'Test message', (error, info) => {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //
  //   console.log(info);
  // });
}

http.createServer(bot.middleware()).listen(7034);
export { notifyAdmin };
