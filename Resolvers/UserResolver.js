const { request } = require("express");

exports.root = {
  hello: () => {
    return "graphiql quote of the day working ";
  },
  random: () => {
    return "random working ";
  },
  intlist: () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  },

  mutate: () => {
    return "mutation";
  },
  user: (args, req) => {
    console.log("user", args);

    return {
      name: "yash",
      username: "ymorya",
      phoneno: 1234567890,
    };
  },
  getdict: (args, req, context, info) => {
    console.log("User getdict ");
    // console.log("args",args);
    // console.log("context",context);
    // console.log("info",info);
    return {
      id: 1,
      ids: "getdict user ",
    };
  },
  getdict2: (args, req, context, info) => {
    console.log("User getdict2 ");
    // console.log("args",args);
    // console.log("context",context);
    // console.log("info",info);
    return {
      id: 2,
      ids: "getdict user 2",
    };
  },
};
