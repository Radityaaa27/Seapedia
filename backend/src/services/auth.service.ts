import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { RegisterInput, LoginInput } from "../validators/auth.validator";
import { signToken } from "../utils/jwt.util";
import { ApiError } from "../utils/ApiError";

// The service layer contains BUSINESS LOGIC.
// It orchestrates repositories and utilities.
// Controllers call services — never repositories directly.

export const authService = {
  register: async (input: RegisterInput) => {
    // 1. Check if email is already taken
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw ApiError.conflict("An account with this email already exists.");
    }

    // 2. Hash the password — NEVER store plaintext passwords
    // bcrypt salt rounds: 12 is a good balance of security vs speed.
    // Higher = slower to crack but also slower to hash on your server.
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // 3. Create user with wallet and role
    const user = await userRepository.createWithDefaults(input, hashedPassword);
    if (!user) throw ApiError.internal("Failed to create user.");

    // 4. Sign a JWT token for immediate login after registration
    const token = signToken({
      userId: user.id,
      email: user.email,
      activeRole: "BUYER",
    });

    // 5. Return token and safe user data (never return the password!)
    return {
      token,
      user: sanitizeUser(user),
    };
  },

  login: async (input: LoginInput) => {
    // 1. Find user — use a vague error to prevent user enumeration attacks
    // (never tell attackers whether the email exists or not)
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password.");
    }

    // 2. Check account is active
    if (!user.isActive) {
      throw ApiError.forbidden("Your account has been deactivated.");
    }

    // 3. Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password.");
    }

    // 4. Determine active role (first active role found)
    const activeRole = user.roles.find((r) => r.isActive)?.role ?? "BUYER";

    // 5. Sign token
    const token = signToken({
      userId: user.id,
      email: user.email,
      activeRole,
    });

    return {
      token,
      user: sanitizeUser(user),
    };
  },

  getMe: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");
    return sanitizeUser(user);
  },
};

// Strips sensitive fields before sending user data to the frontend.
// TypeScript's Omit type ensures we never accidentally include password.
const sanitizeUser = (user: any) => {
  const { password, ...safeUser } = user;
  return safeUser;
};