var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(9000, () => {
  console.log('Server running on port 9000');
});

app.post('/smartContract', async (req, res, next) => {
  const endpoint = 'http://localhost:8888';
  const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
  const fetch = require('node-fetch'); // node only; not needed in browsers
  const { TextDecoder, TextEncoder } = require('text-encoding'); // node, IE11 and IE Edge Browsers
  const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
  const defaultPrivateKey = '5JD9AGTuTeD5BXZwGQ5AtwBqHK21aHmYnTetHgk1B3pjj7krT8N'; // useraaaaaaaa
  const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  // videoacc createvideo '["12","videoacc", "Hi", "www.hi.com", "sheet"]' -p videoacc@active
  // timestamp, const name author, const string &title, const string &url, const string &tag

  // TODO:
  // note: these fields here do not match the front end. We need trigger and expiration date
  // we also need to trigger payment or cancellation

  console.log(req.body);

  const resp = await api.transact(
    {
      actions: [
        {
          account: 'videoacc',
          name: 'createvideo',
          authorization: [
            {
              actor: 'videoacc',
              permission: 'active'
            }
          ],
          data: {
            timestamp: '423423434',
            author: 'videoacc',
            title: req.body.title,
            url: req.body.url,
            tag: req.body.tag
          }
        }
      ]
    },
    {
      blocksBehind: 3,
      expireSeconds: 30
    }
  );

  console.log(resp);

  res.json(resp);
});

app.get('/smartContracts', async (req, res, next) => {
  const endpoint = 'http://localhost:8888';

  const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
  const fetch = require('node-fetch'); // node only; not needed in browsers
  const { TextDecoder, TextEncoder } = require('text-encoding'); // node, IE11 and IE Edge Browsers

  const rpc = new JsonRpc(endpoint, { fetch });

  const resp = await rpc.get_table_rows({
    json: true,
    code: 'videoacc', // contract who owns the table
    scope: 'videoacc', // scope of the table
    table: 'videostruct', // name of the table as specified by the contract abi
    limit: 100
  });

  // TODO
  // Fields are not coming back from the serve.
  // Fix later

  data = [];

  for (row of resp.rows) {
    row.tag = 'trip';
    row.url = 'https://www.youtube.com/watch?v=SW48b1RO-z0';
    row.title = 'My Trip';
    row.Id = row.pkey;
    row.sponsor = 'GoPro Inc.';
    row.monetization = '$2000.00';
    row.trigger = '100000 Views';
    data.push(row);
  }

  console.log(resp.rows);
  console.log(data);

  res.json(data);
});
