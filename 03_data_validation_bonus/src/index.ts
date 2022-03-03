import * as mongo from "mongodb";
import express from "express";
const databaseUrl = "mongodb://mongo-basics-app:password@localhost:27017/mongo-basics";

const options = { useNewUrlParser: true, useUnifiedTopology: true };

mongo.MongoClient.connect(databaseUrl).then((client) => {
  const db = client.db();
});
