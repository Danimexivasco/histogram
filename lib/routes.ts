export const routes = {
  home:           "/",
  login:          "/login",
  register:       "/register",
  confirmEmail:   "/confirm-email",
  forgotPassword: "/forgot-password",
  resetPassword:  "/reset-password",
  profile:        "/profile"
};

export const routesWithoutHeader = [routes.login, routes.register];
