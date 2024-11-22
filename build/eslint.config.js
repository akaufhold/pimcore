// eslint.config.js
import { fixupPluginRules } from "@eslint/compat";
import example from "eslint-plugin-example";

export default [
    {
        plugins: {
            example: fixupPluginRules(example)
        }
    },

    // other config
];