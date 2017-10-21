declare namespace Polymer {

  /**
   * Element mixin that provides basic template parsing and stamping, including
   * the following template-related features for stamped templates:
   * 
   * - Declarative event listeners (`on-eventname="listener"`)
   * - Map of node id's to stamped node instances (`this.$.id`)
   * - Nested template content caching/removal and re-installation (performance
   *   optimization)
   */
  function TemplateStamp<T extends new(...args: any[]) => {}>(base: T): {
    new(...args: any[]): {

      /**
       * Clones the provided template content and returns a document fragment
       * containing the cloned dom.
       * 
       * The template is parsed (once and memoized) using this library's
       * template parsing features, and provides the following value-added
       * features:
       * * Adds declarative event listeners for `on-event="handler"` attributes
       * * Generates an "id map" for all nodes with id's under `$` on returned
       *   document fragment
       * * Passes template info including `content` back to templates as
       *   `_templateInfo` (a performance optimization to avoid deep template
       *   cloning)
       * 
       * Note that the memoized template parsing process is destructive to the
       * template: attributes for bindings and declarative event listeners are
       * removed after being noted in notes, and any nested `<template>.content`
       * is removed and stored in notes as well.
       */
      _stampTemplate(template: HTMLTemplateElement): StampedTemplate;

      /**
       * Adds an event listener by method name for the event provided.
       * 
       * This method generates a handler function that looks up the method
       * name at handling time.
       */
      _addMethodEventListenerToNode(node: Node|null, eventName: string, methodName: string, context?: any): Function|null;

      /**
       * Override point for adding custom or simulated event handling.
       */
      _addEventListenerToNode(node: Node|null, eventName: string, handler: Function|null): any;

      /**
       * Override point for adding custom or simulated event handling.
       */
      _removeEventListenerFromNode(node: Node|null, eventName: string, handler: Function|null): any;
    }
  } & T
}