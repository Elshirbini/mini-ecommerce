export const r2Config = {
  region: 'auto' as const,
  get endpoint() {
    return process.env.R2_ENDPOINT;
  },
  get credentials() {
    return {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    };
  },
  get bucket() {
    return process.env.R2_BUCKET_NAME!;
  },
  get R2_PUBLIC_DOMAIN() {
    return process.env.R2_PUBLIC_DOMAIN!;
  },
};
