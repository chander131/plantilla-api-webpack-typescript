type InjectionEnv = {
  environment: string,
  port: number,
  typeMorgan: string,
}

const injectionsEnv: InjectionEnv = {
  environment: process.env.development,
  port: Number(process.env.PORT),
  typeMorgan: process.env.NODE_ENV.includes("development") ? "dev" : "combined",
};

export default injectionsEnv;
