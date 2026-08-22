import rateLimit from "express-rate-limit"

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 10,  // Limit each IP to 10 login requests per `window` (here, per 15 minutes)
    message: {message: "Too many login attempts. Please try again in 15 minutes."},
    standardHeaders: true,
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 registration requests per `window` (here, per hour)
    message: {message: "Too many accounts created from this IP, please try again after an hour."},
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset requests per `window` (here, per hour)
    message: {message: "Too many password reset requests. Please try again in an hour."},
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});