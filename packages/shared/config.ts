import { z } from "zod";

const stringBool = (defaultValue: string) =>
  z
    .string()
    .default(defaultValue)
    .refine((s) => s === "true" || s === "false")
    .transform((s) => s === "true");

const optionalStringBool = () =>
  z
    .string()
    .refine((s) => s === "true" || s === "false")
    .transform((s) => s === "true")
    .optional();

const allEnv = z.object({
  API_URL: z.string().url().default("http://localhost:3000"),
  DATA_DIR: z.string().default(""),
});

const serverConfigSchema = allEnv.transform((val) => {
  return {
    apiUrl: val.API_URL,
    publicUrl: val.API_URL,
    publicApiUrl: `${val.API_URL}/api`,
    dataDir: val.DATA_DIR,
  };
});

const serverConfig = serverConfigSchema.parse(process.env);

// Always explicitly pick up stuff from server config to avoid accidentally leaking stuff
export const clientConfig = {
  publicUrl: serverConfig.publicUrl,
  publicApiUrl: serverConfig.publicApiUrl,
};
export type ClientConfig = typeof clientConfig;

export default serverConfig;
