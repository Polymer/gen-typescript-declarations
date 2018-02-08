/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   paper-menu-button.html
 */

/// <reference path="../polymer/types/polymer.d.ts" />
/// <reference path="../iron-a11y-keys-behavior/iron-a11y-keys-behavior.d.ts" />
/// <reference path="../iron-behaviors/iron-control-state.d.ts" />
/// <reference path="../iron-dropdown/iron-dropdown.d.ts" />
/// <reference path="../neon-animation/animations/fade-in-animation.d.ts" />
/// <reference path="../neon-animation/animations/fade-out-animation.d.ts" />
/// <reference path="../paper-styles/default-theme.d.ts" />
/// <reference path="../paper-styles/shadow.d.ts" />
/// <reference path="paper-menu-button-animations.d.ts" />

/**
 * Material design: [Dropdown buttons](https://www.google.com/design/spec/components/buttons.html#buttons-dropdown-buttons)
 *
 * `paper-menu-button` allows one to compose a designated "trigger" element with
 * another element that represents "content", to create a dropdown menu that
 * displays the "content" when the "trigger" is clicked.
 *
 * The child element assigned to the `dropdown-trigger` slot will be used as the
 * "trigger" element. The child element assigned to the `dropdown-content` slot will be
 * used as the "content" element.
 *
 * The `paper-menu-button` is sensitive to its content's `iron-select` events. If
 * the "content" element triggers an `iron-select` event, the `paper-menu-button`
 * will close automatically.
 *
 * Example:
 *
 *     <paper-menu-button>
 *       <paper-icon-button icon="menu" slot="dropdown-trigger"></paper-icon-button>
 *       <paper-listbox slot="dropdown-content">
 *         <paper-item>Share</paper-item>
 *         <paper-item>Settings</paper-item>
 *         <paper-item>Help</paper-item>
 *       </paper-listbox>
 *     </paper-menu-button>
 *
 * ### Styling
 *
 * The following custom properties and mixins are also available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--paper-menu-button-dropdown-background` | Background color of the paper-menu-button dropdown | `--primary-background-color`
 * `--paper-menu-button` | Mixin applied to the paper-menu-button | `{}`
 * `--paper-menu-button-disabled` | Mixin applied to the paper-menu-button when disabled | `{}`
 * `--paper-menu-button-dropdown` | Mixin applied to the paper-menu-button dropdown | `{}`
 * `--paper-menu-button-content` | Mixin applied to the paper-menu-button content | `{}`
 */
declare class PaperMenuButton extends Polymer.Element {

  /**
   * True if the content is currently displayed.
   */
  opened: boolean|null|undefined;

  /**
   * The orientation against which to align the menu dropdown
   * horizontally relative to the dropdown trigger.
   */
  horizontalAlign: string|null|undefined;

  /**
   * The orientation against which to align the menu dropdown
   * vertically relative to the dropdown trigger.
   */
  verticalAlign: string|null|undefined;

  /**
   * If true, the `horizontalAlign` and `verticalAlign` properties will
   * be considered preferences instead of strict requirements when
   * positioning the dropdown and may be changed if doing so reduces
   * the area of the dropdown falling outside of `fitInto`.
   */
  dynamicAlign: boolean|null|undefined;

  /**
   * A pixel value that will be added to the position calculated for the
   * given `horizontalAlign`. Use a negative value to offset to the
   * left, or a positive value to offset to the right.
   */
  horizontalOffset: number|null|undefined;

  /**
   * A pixel value that will be added to the position calculated for the
   * given `verticalAlign`. Use a negative value to offset towards the
   * top, or a positive value to offset towards the bottom.
   */
  verticalOffset: number|null|undefined;

  /**
   * If true, the dropdown will be positioned so that it doesn't overlap
   * the button.
   */
  noOverlap: boolean|null|undefined;

  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   */
  noAnimations: boolean|null|undefined;

  /**
   * Set to true to disable automatically closing the dropdown after
   * a selection has been made.
   */
  ignoreSelect: boolean|null|undefined;

  /**
   * Set to true to enable automatically closing the dropdown after an
   * item has been activated, even if the selection did not change.
   */
  closeOnActivate: boolean|null|undefined;

  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dropdown.
   */
  openAnimationConfig: object|null|undefined;

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dropdown.
   */
  closeAnimationConfig: object|null|undefined;

  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   */
  allowOutsideScroll: boolean|null|undefined;

  /**
   * Whether focus should be restored to the button when the menu closes.
   */
  restoreFocusOnClose: boolean|null|undefined;

  /**
   * This is the element intended to be bound as the focus target
   * for the `iron-dropdown` contained by `paper-menu-button`.
   */
  _dropdownContent: object|null|undefined;
  hostAttributes: object|null;

  /**
   * The content element that is contained by the menu button, if any.
   */
  contentElement: object|null;

  /**
   * If the dropdown is open when disabled becomes true, close the
   * dropdown.
   *
   * @param disabled True if disabled, otherwise false.
   */
  _disabledChanged(disabled: boolean): any;

  /**
   * Toggles the drowpdown content between opened and closed.
   */
  toggle(): any;

  /**
   * Make the dropdown content appear as an overlay positioned relative
   * to the dropdown trigger.
   */
  open(): any;

  /**
   * Hide the dropdown content.
   */
  close(): any;

  /**
   * When an `iron-select` event is received, the dropdown should
   * automatically close on the assumption that a value has been chosen.
   *
   * @param event A CustomEvent instance with type
   * set to `"iron-select"`.
   */
  _onIronSelect(event: CustomEvent|null): any;

  /**
   * Closes the dropdown when an `iron-activate` event is received if
   * `closeOnActivate` is true.
   *
   * @param event A CustomEvent of type 'iron-activate'.
   */
  _onIronActivate(event: CustomEvent|null): any;

  /**
   * When the dropdown opens, the `paper-menu-button` fires `paper-open`.
   * When the dropdown closes, the `paper-menu-button` fires `paper-close`.
   *
   * @param opened True if the dropdown is opened, otherwise false.
   * @param oldOpened The previous value of `opened`.
   */
  _openedChanged(opened: boolean, oldOpened: boolean): any;
}

interface PaperMenuButton extends Polymer.IronA11yKeysBehavior, Polymer.IronControlState {
}

interface HTMLElementTagNameMap {
  "paper-menu-button": PaperMenuButton;
}