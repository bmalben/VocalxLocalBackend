const mongoose = require('mongoose');

const connection_string = process.env.connection_string;

mongoose.connect(connection_string)
  .then(() => {
    console.log(
      "VXL application successfully connected to MongoDB-Atlas"
    );
  })
  .catch((err) => {
    console.log("MongoDB Connection failed...", err);
  });
