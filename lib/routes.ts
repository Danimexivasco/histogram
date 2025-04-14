export const routes = {
  home:           "/",
  login:          "/login",
  register:       "/register",
  confirmEmail:   "/confirm-email",
  forgotPassword: "/forgot-password",
  resetPassword:  "/reset-password",
  profile:        "/profile"
};

export const authRoutes = [routes.login, routes.register];

export const protectedRoutes = [routes.profile];