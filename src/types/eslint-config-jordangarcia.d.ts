declare module "eslint-config-jordangarcia" {
  interface RuleConfig {
    name: string;
    files?: string[];
    rules: Record<string, unknown>;
  }

  export const coreSafety: RuleConfig;
  export const typescriptStrict: RuleConfig;

  const config: RuleConfig[];
  export default config;
}
