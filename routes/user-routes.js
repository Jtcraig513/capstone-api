const router = require("express").Router();
const userController = require("../controllers/user-controller");

router
    .route("/")
    .get(userController.getUsers)
    .post(userController.addUser);

router
    .route("/:id")
    .get(userController.getUser);

module.exports = router;