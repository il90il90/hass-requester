import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { copyFileSync, mkdirSync } from "fs";

const wwwDir = "../custom_components/hass_requester/www";

export default {
  input: "src/hass-requester-panel.ts",
  output: {
    file: `${wwwDir}/hass-requester-panel.js`,
    format: "es",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    {
      // Ensure output directory exists
      name: "ensure-dir",
      buildStart() {
        try {
          mkdirSync(wwwDir, { recursive: true });
        } catch {}
      },
    },
  ],
  external: [],
};
