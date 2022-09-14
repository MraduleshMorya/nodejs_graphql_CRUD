const express = require("express");
const router = express.Router();
const { getUser, postUser, putUser, deleteUser } = require("../Controller/GraphqlController")

router.route("/user").get(getUser).post(postUser).put(putUser).delete(deleteUser);

module.exports = router;