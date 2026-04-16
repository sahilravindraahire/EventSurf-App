const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const { sendOTPEmail } = require("../utils/email.util.js");
const OTP = require("../models/OTP.model.js");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  let userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email}: ${otp}`);
    await OTP.create({ email, otp, action: "account_verification" });
    await sendOTPEmail(email, otp);
    res.status(201).json({
      message: `user registered successfully. Please check your email for OTP to verify your account`,
      email: user.email,  // Send the user’s email back in the API response
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ error: "Invalid email address. Please sign up first" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid password" });
  }

  if (!user.isVerified && user.role === "user") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email, action: "account_verification" });
    await OTP.create({ email, otp, action: "account_verification" });
    await sendOTPEmail(email, otp, "account_verification");
    return res.status(400).json({
      error: `Account not verified. A new OTP has been send to your email.`,
      needsVerification: true 
    });
  }

  res.json({
    message: "Login Successfully",
    _id: user._id,    // user._id: Real database ID  &  user.id: Convenience (frontend/API)
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const otpRecord = await OTP.findOne({
    email,
    otp,
    action: "account_verification",
  });

  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid or Expired OTP" });
  }

  const user = await User.findOneAndUpdate({ email }, { isVerified: true });
  await OTP.deleteMany({ email, action: "account_verification" });
  res.json({
    message: "Account verified successfully. You can now login",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};
