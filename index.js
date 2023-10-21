const app = require("./app");
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const PORT = process.env.RUNNING_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port number ${PORT}`);
});