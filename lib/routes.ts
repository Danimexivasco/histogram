export const routes = {
  home:           "/",
  login:          "/login",
  register:       "/register",
  confirmEmail:   "/confirm-email",
  forgotPassword: "/forgot-password",
  resetPassword:  "/reset-password",

  profile:     "/:username",
  editProfile: "/:username/edit",

  post:       "/:username/post/:id",
  createPost: "/:username/post/create"
};

export const authRoutes = [routes.login, routes.register];

export const protectedRoutes = [routes.editProfile];