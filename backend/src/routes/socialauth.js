import express from "express";
import {
  googleCallback,
  facebookCallback,
  socialLoginSuccess,
  socialLogout,
} from "../controller/socialauthcontroller.js";

const router = express.Router();

// Google OAuth
router.post('/google/callback', googleCallback);

// Facebook OAuth
router.post('/facebook/callback', facebookCallback);

// Check if user is logged in
router.get("/check", socialLoginSuccess);

// Logout
router.post("/logout", socialLogout);

export default router;
