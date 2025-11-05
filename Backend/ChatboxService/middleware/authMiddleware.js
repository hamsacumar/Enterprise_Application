import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    // Call Auth service to verify token
    const resp = await axios.post(
      AUTH_SERVICE_URL,
      { token },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Expect { valid: true, user: { ... } }
    if (!resp?.data?.valid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = resp.data.user; // attach canonical user object
    req.token = token;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.response?.data || err.message);
    return res.status(403).json({ message: "Authentication failed" });
  }
};
