import * as express from 'express';
import { routes } from './routes';
const cookieParser = require('cookie-parser');

const app = express();
const port = 8082;


/*let users = [
    {username: "admin", password: "admin123", admin: 1, token: "woot"},
    {username: "test", password: "hejsan123", admin: 0, token: "woot"}
];*/

app.use(cookieParser());

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        //console.log(`${req.ip} ${req.method} ${req.url}`);
        //console.log(req.cookies);
        next();
    }
})

app.use(routes);

app.listen(port, '127.0.0.1', function() {
    console.log("backend running at: " + port);
}); 