const bodyParser = require('body-parser');
const dotenv = require('dotenv');
import express = require('express');
const apiConfig = require('./api.ts');
dotenv.config();

const port = process.env.PORT;

const app: express.Application = express();
app.use(bodyParser.json());
apiConfig(app);

app.listen(port || 3001, () => {
  console.log(`Server running on http://localhost:${port} ...`);
});
