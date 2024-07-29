const app = require("./app");
require("dotenv").config();

const PORT = process.env.APP_RUNNING_PORT || 9002;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
