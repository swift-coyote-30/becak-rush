/**
 * @fileoverview Becak Rush - Input Management System
 * Handles unified keyboard, touch, and pointer events for smooth mobile and desktop control.
 */

/** Action flag for confirming menus, starting games, or interacting. */
export const ACTION_CONFIRM = 1;

/** Action flag for toggling pause state. */
export const ACTION_PAUSE = 2;

/** Key codes recognized for moving left (Arrow Left, A). */
const LEFT_KEYS = new Set(['ArrowLeft', 'KeyA']);

/** Key codes recognized for moving right (Arrow Right, D). */
const RIGHT_KEYS = new Set(['ArrowRight', 'KeyD']);

/** Key codes recognized for confirmation / start / restart (Space, Enter). */
const CONFIRM_KEYS = new Set(['Space', 'Enter']);

/** Key codes recognized for pausing the game (P, Escape). */
const PAUSE_KEYS = new Set(['KeyP', 'Escape']);

/**
 * Creates and initializes an input controller listening to keyboard and pointer events on the target DOM element.
 * 
 * @param {HTMLElement} targetElement - The game canvas or container element for touch/pointer capture.
 * @returns {Object} Input controller interface with `direction()` and `takeActions()`.
 */
export function createInput(targetElement) {
  let leftPressed = 0;
  let rightPressed = 0;
  let actions = 0;
  let pointerActive = 0;
  let pointerDir = 0;

  // Prevent default browser touch behaviors (scrolling, zooming, text selection) on target element
  targetElement.style.touchAction = 'none';

  /**
   * Updates pointer or touch direction based on horizontal position relative to the target element center.
   * Left half of screen steers left (-1); right half steers right (1).
   * 
   * @param {PointerEvent|TouchEvent} e - The pointer or touch event.
   */
  function updatePointer(e) {
    const rect = targetElement.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
    const relX = clientX - rect.left;
    pointerDir = relX < rect.width / 2 ? -1 : 1;
  }

  /**
   * Keydown event handler for continuous movement keys and one-shot action keys.
   */
  function onKeyDown(e) {
    if (LEFT_KEYS.has(e.code)) {
      leftPressed = 1;
    } else if (RIGHT_KEYS.has(e.code)) {
      rightPressed = 1;
    } else if (CONFIRM_KEYS.has(e.code)) {
      if (!e.repeat) actions |= ACTION_CONFIRM;
    } else if (PAUSE_KEYS.has(e.code)) {
      if (!e.repeat) actions |= ACTION_PAUSE;
    } else {
      return;
    }
    e.preventDefault();
  }

  /**
   * Keyup event handler to reset directional movement states when keys are released.
   */
  function onKeyUp(e) {
    if (LEFT_KEYS.has(e.code)) leftPressed = 0;
    if (RIGHT_KEYS.has(e.code)) rightPressed = 0;
  }

  /**
   * Resets all input states when window loses focus to prevent stuck movement keys.
   */
  function onBlur() {
    leftPressed = 0;
    rightPressed = 0;
    pointerStartClear();
  }

  /**
   * Clears pointer/touch tracking states.
   */
  function pointerStartClear() {
    pointerActive = 0;
    pointerDir = 0;
  }

  /**
   * Pointer down event handler initiating touch steering and trigger confirm action.
   */
  function onPointerDown(e) {
    e.preventDefault();
    pointerActive = 1;
    updatePointer(e);
    actions |= ACTION_CONFIRM;
  }

  /**
   * Pointer move event handler updating steering direction while touch/mouse is dragged.
   */
  function onPointerMove(e) {
    if (pointerActive) updatePointer(e);
  }

  /**
   * Pointer up/cancel event handler ending touch steering.
   */
  function onPointerEnd() {
    pointerStartClear();
  }

  // Register window-level keyboard and focus listeners
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  // Register element-level pointer/touch listeners
  targetElement.addEventListener('pointerdown', onPointerDown);
  targetElement.addEventListener('pointermove', onPointerMove);
  targetElement.addEventListener('pointerup', onPointerEnd);
  targetElement.addEventListener('pointercancel', onPointerEnd);

  return {
    /**
     * Returns current steering direction: -1 for left, 1 for right, 0 for neutral.
     * Prioritizes active touch/pointer interaction over keyboard input.
     * @returns {number} Direction (-1, 0, or 1)
     */
    direction: () => (pointerActive ? pointerDir : rightPressed - leftPressed),

    /**
     * Retrieves accumulated one-shot actions (confirm, pause) and resets the action bitmask.
     * @returns {number} Bitmask of triggered actions
     */
    takeActions: () => {
      const current = actions;
      actions = 0;
      return current;
    }
  };
}
