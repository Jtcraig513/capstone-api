const knex = require("knex")(require("../knexfile"));

const getUsers = async (req, res) => {
    try {
        const users = await knex("users")
            .select(
                "id",
                "username",
                "password",
                "name",
                "email"
            )
        res.status(200).json(users);
    } catch (error) {
        res.status(400).send(`Unable to retrieve users data. ${error}`);
    }
}

const getUser = async (req, res) => {
    try {
        const user = await knex("users")
            .where({ id: req.params.id })
            .select(
                "id",
                "username",
                "password",
                "name",
                "email"
            )

        if (user === 0) {
            return res.status(404).json({
                message: `User with ID ${req.params.id} not found`,
            });
        }

        const userData = user[0];
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({
            message: `Unable to retrieve user data for warehouse with ID: ${req.params.id}.`,
        });
    }
}

const addUser = async (req, res) => {

    if (
        !req.body.username ||
        !req.body.password ||
        !req.body.name ||
        !req.body.email
    ) {
        return res.status(400).json({
            message:
                "Please provide necessary details for the new user in the request",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(401).json({
            message: "Email is invalid",
        });
    }

    try {
        const result = await knex("users").insert(req.body);
        const newUserId = result[0];
        const newUser = await knex("users")
            .where({ id: newUserId })
            .select(
                "id",
                "username",
                "password",
                "name",
                "email"
            );

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            message: `Unable to create new user: ${error}`,
        });
    }


}


module.exports = {
    getUsers,
    getUser,
    addUser,
}