const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization.split(" ")[1]; // Use optional chaining to handle undefined
        if (!token) {
            return res.status(401).json({
                message: "Auth failed: Token missing"
            });
        }
        console.log(token,"before verification")
        // Verify the token
        jwt.verify(token, "secret_this_should_be_longer", (err, decoded) => {
            if (err) {
                console.log(err)
                return res.status(401).json({
                    message: "Auth failed: Invalid token"
                });
            }
            console.log("after verification")
            // If valid, attach decoded data to the request (e.g., user ID)
            req.userData = {email:decoded.email,userId:decoded.userId,role:decoded.role};

            if (["POST", "PUT", "DELETE"].includes(req.method) && req.userData.role !== "admin") {
                return res.status(403).json({ message: "Forbidden: Admin access required" });
            }
            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
        res.status(401).json({
            message: "Auth failed: Something went wrong"
        });
    }
};
