const express = require('express');
const createProxyMiddleware = require('express-http-proxy');
const app = express();

const port = 4300;

// handling CORS
app.use((req, res, next) => {
console.log(req);
console.log('cors');
    res.header("Access-Control-Allow-Origin",
               "http://localhost:4300");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use('/backend',
    createProxyMiddleware(
        'http://192.168.1.72:9090/',
        {
            proxyErrorHandler: function(err, res, next) {
                console.error('Proxy Error:', err);
                // You can send a more specific error response here
                res.status(500).send('Proxy encountered an error.');
            }
        }
    )
);


// Uses the static content located in .
// __dirname resolves to the path the main.js of our Runtime Host is located, so our client’s files have to be in the sub-folder client
app.use(express.static(`${__dirname}/dist/quan-admin/browser`));

app.use('*', (_req, res) => {
    res.sendFile(`${__dirname}/dist/quan-admin/browser/index.html`);
  });

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

