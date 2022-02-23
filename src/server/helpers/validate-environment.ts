import path from 'path';

const validateEnvironment = (argv:any): string => {
  // let build:string = process.env.NODE_ENV || "";
  
  // if (build) {
  //   build = build.trim().toLocaleLowerCase();

  //   if (build && ["development", "exec_test"].includes(build)) {
  //     dotenv.config({
  //       path: path.resolve(process.cwd(), ".env")
  //     });
  //   }
  // }

  let _pathEnv:string = path.resolve(process.cwd(), '.env');

  if (argv?.build) {
    let _build = argv.build.toLowerCase().trim();

    if (_build == "development")
      _pathEnv = path.resolve(process.cwd(), 'ENV', 'DEV', '.env');
    else if (_build == "test")
      _pathEnv = path.resolve(process.cwd(), 'ENV', 'TEST', '.env');
    else if (_build == "production")
      _pathEnv = path.resolve(process.cwd(), 'ENV', 'PRO', '.env');
  }

  return _pathEnv;
};

export default validateEnvironment;
