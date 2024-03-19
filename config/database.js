const mongoose = require("mongoose");

const dbConection = () => {
  const dbName = process.env.DB_NAME || 'hakathonDB';
  
  mongoose.connect(process.env.DB_URI,{dbName}).then((conn) => {
    console.log(`database connected ${conn.connection.host}`);
  })
};

module.exports = dbConection;