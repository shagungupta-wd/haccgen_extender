// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Multi-language tag helpers ({mlang xx}...{mlang}, as read by filter_multilang2).
 *
 * @module tiny_haccgen_extender/mlang
 * @copyright 2026, Dynamic Pixel
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Moodle language pack codes for the languages offered by the translate dialog.
 *
 * The code must match the language pack code of the site (current_language()),
 * otherwise the filter hides the text. The user can change it in the dialog.
 */
export const LANGUAGE_CODES = {
  'English': 'en',
  'Albanian': 'sq',
  'Arabic': 'ar',
  'Bosnian': 'bs',
  'Bulgarian': 'bg',
  'Chinese': 'zh_cn',
  'Croatian': 'hr',
  'Czech': 'cs',
  'French': 'fr',
  'German': 'de',
  'Greek': 'el',
  'Hausa': 'ha',
  'Hindi': 'hi',
  'Hungarian': 'hu',
  'Igbo': 'ig',
  'Italian': 'it',
  'Kannada': 'kn',
  'Kurdish': 'ku',
  'Latin': 'la',
  'Nigerian Pidgin': 'pcm',
  'Pashto': 'ps',
  'Persian': 'fa',
  'Polish': 'pl',
  'Romanian': 'ro',
  'Russian': 'ru',
  'Serbian': 'sr',
  'Slovak': 'sk',
  'Spanish': 'es',
  'Tamil': 'ta',
  'Telugu': 'te',
  'Turkish': 'tr',
  'Ukrainian': 'uk',
  'Yorùbá': 'yo',
};

/**
 * @param {string} language Language name as shown in the translate dialog.
 * @returns {string} Language pack code, or '' when unknown.
 */
export const languageCodeFor = (language) => LANGUAGE_CODES[String(language || '')] || '';

/**
 * Clean a user-entered code. Accepts one code or a comma list ("en", "zh_cn", "de,de_du", "other").
 *
 * @param {string} code
 * @returns {string} Normalised code, or '' when it is not valid.
 */
export const normaliseMlangCode = (code) => {
  const c = String(code || '').toLowerCase().replace(/\s+/g, '');
  return /^[a-z0-9_-]+(,[a-z0-9_-]+)*$/.test(c) ? c : '';
};

// Blocks whose own text is wrapped. A block that contains another of these is skipped,
// so every tag pair opens and closes inside the same element.
const LEAF_BLOCKS = 'p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote, pre, dt, dd, figcaption';

/**
 * Wrap each text block of an HTML fragment in {mlang code}...{mlang}.
 *
 * Tagging block by block (instead of around the whole fragment) keeps the markup valid
 * and lets a "replace selection" inside a paragraph still produce a closed pair.
 *
 * @param {string} html HTML fragment.
 * @param {string} code Language code (already normalised).
 * @returns {string}
 */
export const wrapHtmlWithMlang = (html, code) => {
  const fragment = String(html || '');
  if (!fragment.trim() || !code) {
    return fragment;
  }
  const open = `{mlang ${code}}`;
  const close = '{mlang}';

  const tpl = document.createElement('template');
  tpl.innerHTML = fragment;
  const leaves = Array.from(tpl.content.querySelectorAll(LEAF_BLOCKS))
    .filter((el) => !el.querySelector(LEAF_BLOCKS) && el.textContent.trim() !== '');

  if (!leaves.length) {
    return open + fragment + close;
  }
  leaves.forEach((el) => {
    el.insertBefore(document.createTextNode(open), el.firstChild);
    el.appendChild(document.createTextNode(close));
  });
  return tpl.innerHTML;
};
