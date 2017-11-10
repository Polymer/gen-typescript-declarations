/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   lib/utils/style-gather.html
 */

/// <reference path="resolve-url.d.ts" />

declare namespace Polymer {

  /**
   * Module with utilities for collection CSS text from `<templates>`, external
   * stylesheets, and `dom-module`s.
   */
  namespace StyleGather {


    /**
     * Returns CSS text of styles in a space-separated list of `dom-module`s.
     */
    function cssFromModules(moduleIds: string): string;


    /**
     * Returns CSS text of styles in a given `dom-module`.  CSS in a `dom-module`
     * can come either from `<style>`s within the first `<template>`, or else
     * from one or more `<link rel="import" type="css">` links outside the
     * template.
     *
     * Any `<styles>` processed are removed from their original location.
     */
    function cssFromModule(moduleId: string): string;


    /**
     * Returns CSS text of `<styles>` within a given template.
     *
     * Any `<styles>` processed are removed from their original location.
     */
    function cssFromTemplate(template: HTMLTemplateElement|null, baseURI: string): string;


    /**
     * Returns CSS text from stylesheets loaded via `<link rel="import" type="css">`
     * links within the specified `dom-module`.
     */
    function cssFromModuleImports(moduleId: string): string;

    function _cssFromModuleImports(module: HTMLElement): string;
  }
}
