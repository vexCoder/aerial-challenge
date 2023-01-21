declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_S3_HOST: string;
      NEXT_PUBLIC_AWS_S3_HOST: string;
      AWS_S3_ACCESS: string;
      AWS_S3_SECRET: string;
      AWS_REGION_NAME: string;
      AWS_API_VERSION: string;
    }
  }
}

export {}