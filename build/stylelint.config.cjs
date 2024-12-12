/* eslint-disable no-undef */
"use strict"
/*
    Angepasste Stylelint-Config und -Regeln
    Übersicht aller Stylelint Regeln -> https://stylelint.io/user-guide/rules/list
*/
module.exports = { // eslint-disable-line no-undef
    "extends": [
        "stylelint-config-recommended", // contains these rules: https://github.com/stylelint/stylelint-config-recommended/blob/master/index.js
        "stylelint-config-recommended-scss", // contains these rules: https://github.com/kristerkari/stylelint-config-recommended-scss/blob/master/index.js
        "stylelint-config-standard" // contains these rules: https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
    ],
    "plugins": [
        "stylelint-scss", // see https://github.com/kristerkari/stylelint-scss
        "stylelint-order", // see https://github.com/hudochenkov/stylelint-order
    ],
    "ignoreFiles": ["**/*.html", "**/*.js", "**/*.php"],
    "rules": {
        "at-rule-no-unknown": null,
        "at-rule-empty-line-before": [
            "always", {
                "except": ["first-nested", "blockless-after-blockless"],
                "ignore": "after-comment"
            }],
        "block-closing-brace-newline-after": "always-single-line",
        "block-no-empty": true,
        "color-function-notation": "modern",
        'declaration-block-no-redundant-longhand-properties': null,
        "declaration-block-no-shorthand-property-overrides": true,
        "declaration-colon-newline-after": "always-multi-line",
        "declaration-empty-line-before": null,
        "font-family-no-missing-generic-family-keyword": true,
        "function-comma-newline-after": null,
        "function-parentheses-newline-inside": null,
        'function-url-quotes': null,
        'keyframes-name-pattern': null,
        "max-empty-lines": 1,
        "no-descending-specificity": null,
        "number-leading-zero": "never",
        "property-no-vendor-prefix": [
            true, {
            ignoreProperties: ["backface-visibility", "appearance"]
        }],
        'scss/comment-no-empty': null,
        "scss/at-rule-no-unknown": true,
        'scss/at-if-no-null': null,
        "selector-type-no-unknown": [true, {"severity": "warning"}],
        "selector-class-pattern": [
            "^\.?[a-z0-9_]+(-[a-z0-9_]+)*(__[a-z0-9_]+(-[a-z0-9_]+)*)?(--[a-z0-9_]+(-[a-z0-9_]+)*)?$|^pimcore_.*$",
            {
                "resolveNestedSelectors": true,
                "message": "Class names should be BEM / Pimcore's naming pattern (e.g., pimcore_field_input)."
            }
        ],
        "selector-id-pattern": null,
    }
}
