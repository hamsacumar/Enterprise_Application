import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const resp = await axios.post(AUTH_SERVICE_URL, { token });

    if (!resp?.data?.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: resp.data.userId,
      username: resp.data.username,
      role: resp.data.role,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.response?.data || err.message);
    return res.status(403).json({ message: "Authentication failed" });
  }
};
