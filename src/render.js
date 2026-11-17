/**
 * @fileoverview Becak Rush - Canvas Renderer
 * Handles HTML5 2D canvas painting for Malioboro field, becak player, items, HUD, and dialog panels.
 */

import { FIELD } from './config.js';
import { KIND_BAKPIA, KIND_COIN } from './world.js';

/** Screen state: Title screen */
export const SCREEN_TITLE = 'title';

/** Screen state: Active gameplay */
export const SCREEN_PLAY = 'play';

/** Screen state: Paused game */
export const SCREEN_PAUSED = 'paused';

/** Screen state: Game over screen */
export const SCREEN_OVER = 'over';

/**
 * Creates and returns the game renderer associated with the HTML canvas.
 * 
 * @param {HTMLCanvasElement} canvas - The target 2D canvas element
 * @returns {Object} Renderer interface containing the `draw` method
 */
export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  /** Resizes canvas drawing buffer to match configured field dimensions. */
  function resize() {
    canvas.width = FIELD.width;
    canvas.height = FIELD.height;
  }
  resize();
  /**
   * Helper to draw filled text on canvas.
   */
  function text(v,x,y,s,c,a) {
    ctx.fillStyle = c;
    ctx.font = 'bold ' + s + 'px sans-serif';
    ctx.textAlign = a || 'left';
    ctx.fillText(v,x,y);
  }

  /**
   * Helper to draw a filled rectangle on canvas.
   */
  function rect(x,y,w,h,c) {
    ctx.fillStyle = c;
    ctx.fillRect(x,y,w,h);
  }

  /**
   * Renders the Malioboro street field, sidewalks, sky, and road lane dividers.
   */
  function drawField(st) {
    rect(0,0,640,1280,'#ffe9c4');
    rect(0,0,640,120,'#ffd9a0');
    rect(300,20,40,100,'#fff8e7');
    rect(292,10,56,14,'#fff8e7');
    rect(0,120,640,1160,'#8a6d4b');
    rect(20,120,80,1160,'#a5875f');
    rect(540,120,80,1160,'#a5875f');
    ctx.fillStyle = '#fff8e7';
    for(let y=140;y<1280;y+=100) ctx.fillRect(315,y,10,40);
  }

  /**
   * Renders the player's Becak (green body, canopy, wheels).
   */
  function drawBecak(p) {
    const x = p.x, y = p.y;
    ctx.fillStyle = '#1f9d55';
    ctx.fillRect(x+8,y+10,52,30);
    ctx.fillStyle = '#fff8e7';
    ctx.fillRect(x+8,y+2,52,10);
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x+16,y+48,10,0,7);
    ctx.arc(x+56,y+48,10,0,7);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.fillRect(x+60,y+20,10,6);
  }
  /**
   * Renders all active items (passenger coins, Bakpia pastries, and obstacles).
   */
  function drawItems(st) {
    for (const it of st.items) {
      if (!it.active) continue;
      if (it.kind === KIND_COIN) {
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(it.x+15,it.y+15,15,0,7);
        ctx.fill();
        text('P',it.x+15,it.y+21,16,'#222','center');
      } else if (it.kind === KIND_BAKPIA) {
        rect(it.x,it.y,46,36,'#c98a3d');
        rect(it.x+6,it.y+6,34,24,'#fff8e7');
        text('B',it.x+23,it.y+25,16,'#7a4a00','center');
      } else {
        rect(it.x,it.y,it.width,it.height,'#cc2222');
        rect(it.x+4,it.y+4,it.width-8,10,'#222');
      }
    }
  }

  /**
   * Renders the heads-up display (score, lives remaining, current level).
   */
  function drawHud(st) {
    text('Score: ' + st.score,12,28,20,'#222');
    text('Nyawa: ' + st.lives,500,28,20,'#cc2222');
    text('Level: ' + st.level,260,28,20,'#222');
  }

  /**
   * Renders modal dialog panels (Title, Pause, Game Over).
   */
  function drawPanel(t, lines, p) {
    rect(80,520,480,240,'#fff8e7');
    text(t,320,570,28,'#222','center');
    let y = 610;
    for (const l of lines) { text(l,320,y,16,'#555','center'); y += 26; }
    text(p,320,730,16,'#1f9d55','center');
  }

  const TITLE_LINES = ['BECAK RUSH','Jogja Edition','Kumpulin Penumpang P'];
  const PAUSED_LINES = ['Game dijeda'];
  const OVER_LINES = ['Becak nabrak!'];

  /**
   * Main render dispatch function rendering the complete frame according to current game state and screen.
   */
  function draw(st, screen, best) {
    drawField(st);
    if (screen === SCREEN_TITLE) {
      drawPanel('BECAK RUSH', TITLE_LINES, 'Press Space to start');
      return;
    }
    drawItems(st);
    drawBecak(st.player);
    drawHud(st);
    if (screen === SCREEN_PAUSED) {
      drawPanel('Paused', PAUSED_LINES, 'Press P to resume');
    }
    if (screen === SCREEN_OVER) {
      drawPanel('Game over', OVER_LINES, 'Press Space or click to play again');
    }
    if (best) text('Best: ' + best, 12, 1260, 16, '#222');
  }
  return { draw };
}
