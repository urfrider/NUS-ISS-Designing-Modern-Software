export const validation = {
  username: [
    {
      required: true,
      message: "Please input your username!",
    },
  ],
  password: [
    {
      required: true,
      message: "Please input your password!",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "Please confirm your password!",
    },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: any) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("The passwords don't match!"));
      },
    }),
  ],
  address: [
    {
      required: true,
      message: "Please enter your address!",
    },
  ],
  uen: [
    {
      required: true,
      message: "Please enter your uen!",
    },
  ],
};
