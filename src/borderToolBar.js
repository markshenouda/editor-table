import './styles/border-toolbar.pcss'
import svgPlusButton from './img/plus.svg'
import svgMunusButton from './img/minus.svg'
import {
  create,
  getRectOffset,
  getCurTableFromButton,
  debounce,
} from './documentUtils'

const CSS = {
  highlightingLine: 'tc-toolbar',
  hidden: 'tc-toolbar--hidden',
  horizontalToolBar: 'tc-toolbar--hor',
  horizontalHighlightingLine: 'tc-toolbar__shine-line--hor',
  verticalToolBar: 'tc-toolbar--ver',
  verticalHighlightingLine: 'tc-toolbar__shine-line--ver',
  mask: 'tc-toolbar__mask',
  maskAdd: 'tc-toolbar__mask--add',
  maskDelete: 'tc-toolbar__mask--delete',
  horizontalMask: 'tc-toolbar__mask--hor',
  verticalMask: 'tc-toolbar__mask--ver',
  plusButton: 'tc-toolbar__plus',
  horizontalPlusButton: 'tc-toolbar__plus--hor',
  verticalPlusButton: 'tc-toolbar__plus--ver',

  minusButton: 'tc-toolbar__minus',
  horizontalMinusButton: 'tc-toolbar__minus--hor',
  verticalMinusButton: 'tc-toolbar__minus--ver',
  area: 'tc-table__area',
}

/**
 * An item with a menu that appears when you hover over a _table border
 */
class BorderToolBar {
  /**
   * @constructor
   */
  constructor() {
    this._plusButton = this._generatePlusButton()
    this._minusButton = this._generateMinusButton()
    this._highlightingLine = this._generateHighlightingLine()
    this._mask = this._generateToolBarMask()
    this._toolbar = this._generateToolBar([
      this._plusButton,
      this._minusButton,
      this._highlightingLine,
      this._mask,
    ])
    // this._toolbar = this._generateToolBar([this._plusButton, this._mask]);
  }

  /**
   * Make the entire item invisible
   */
  hide() {
    this._toolbar.classList.add(CSS.hidden)
  }

  /**
   * Make the entire item visible
   */
  show() {
    this._toolbar.classList.remove(CSS.hidden)
    this._highlightingLine.classList.remove(CSS.hidden)
  }

  /**
   * Hide only highlightingLine
   */
  hideLine() {
    this._highlightingLine.classList.add(CSS.hidden)
  }

  /**
   * returns HTMLElement for insert in DOM
   * @returns {HTMLElement}
   */
  get htmlElement() {
    return this._toolbar
  }

  /**
   * Generates a menu button to add rows and columns.
   * @return {HTMLElement}
   */
  _generatePlusButton() {
    const button = create('div', [CSS.plusButton])

    button.innerHTML = svgPlusButton
    button.addEventListener('click', event => {
      event.stopPropagation()
      const e = new CustomEvent('click', {
        detail: { x: event.pageX, y: event.pageY },
        bubbles: true,
      })

      this._toolbar.dispatchEvent(e)
    })

    /*
     * button.addEventListener('mouseover', debounce((event) => {
     *   event.stopPropagation();
     *   this._mask.classList.add(CSS.maskAdd);
     */

    /*
     *   this._mask.style.display = 'block';
     * }, 300));
     */

    button.addEventListener(
      'mouseout',
      debounce(event => {
        event.stopPropagation()
        this._mask.classList.remove(CSS.maskDelete)
        this._mask.classList.remove(CSS.maskAdd)
        this._mask.style.display = 'none'
      }, 300)
    )

    return button
  }

  /**
   * Generates a menu button to delete rows and columns.
   * @return {HTMLElement}
   */
  _generateMinusButton() {
    const button = create('div', [CSS.minusButton])

    button.innerHTML = svgMunusButton
    button.style = 'transform: rotate(45deg)'
    button.addEventListener('click', event => {
      event.stopPropagation()
      const e = new CustomEvent('click', {
        detail: { x: event.pageX, y: event.pageY, action: 'minus' },
        bubbles: true,
      })

      this._toolbar.dispatchEvent(e)
    })

    button.addEventListener(
      'mouseout',
      debounce(event => {
        event.stopPropagation()
        this._mask.classList.remove(CSS.maskDelete)
        this._mask.classList.remove(CSS.maskAdd)
        this._mask.style.display = 'none'
      }, 300)
    )

    return button
  }

  /**
   * @private
   *
   * Generates line which сover border of _table
   */
  _generateHighlightingLine() {
    const line = create('div', [CSS.highlightingLine])

    line.addEventListener('click', event => {
      console.log('line click 禁止')
      event.stopPropagation()
      // const e = new CustomEvent('click', {'bubbles': true});

      // this._toolbar.dispatchEvent(e);
    })
    return line
  }

  /**
   * @private
   *
   * Generates the main component of the class
   * @param {Element[]} children - child elements of toolbar
   */
  _generateToolBar(children) {
    const bar = create('div', [CSS.hidden], null, children)

    bar.addEventListener('mouseleave', event => {
      this._recalcMousePos(event)
    })

    return bar
  }

  /**
   * @private
   *
   * Generates the main component of the class
   * @param {Element[]} children - child elements of toolbar
   */
  _generateToolBarMask() {
    const mask = create('div', [CSS.mask])

    return mask
  }

  /**
   * @private
   *
   * Recalc mouse position when the mouse left toolbar
   * @param {MouseEvent} event
   */
  _recalcMousePos(event) {
    this.hide()
    const area = document.elementFromPoint(event.pageX, event.pageY)

    if (area !== null && area.classList.contains(CSS.area)) {
      // eslint-disable-next-line no-undef
      const e = new MouseEvent('mouseover', {
        clientX: event.pageX,
        clientY: event.pageY,
      })

      area.dispatchEvent(e)
    }
  }
}

/**
 * An item with a menu that appears when you hover over a _table border horizontally
 */
export class HorizontalBorderToolBar extends BorderToolBar {
  /**
   * Creates
   */
  constructor() {
    super()

    this._toolbar.classList.add(CSS.horizontalToolBar)
    this._plusButton.classList.add(CSS.horizontalPlusButton)
    this._minusButton.classList.add(CSS.horizontalMinusButton)
    this._highlightingLine.classList.add(CSS.horizontalHighlightingLine)
    this._mask.classList.add(CSS.horizontalMask)

    this._plusButton.addEventListener(
      'mouseover',
      debounce(event => {
        event.stopPropagation()
        this._mask.classList.add(CSS.maskAdd)
        this._mask.style.top = '0'
        this._mask.style.left = '0'

        this._mask.style.display = 'block'
      }, 300)
    )

    this._minusButton.addEventListener(
      'mouseover',
      debounce(event => {
        event.stopPropagation()
        const table = getCurTableFromButton(event)
        const { topOffset, rightOffset, bottomOffset } = getRectOffset(
          table,
          event.target.parentElement
        )

        // if is left border OR bottom border OR top border, should add offset
        this._mask.classList.add(CSS.maskDelete)

        if (topOffset === -12 && rightOffset === 10 && bottomOffset !== 10) {
          // console.log('is top border');
          this._mask.style.top = '0'
          this._mask.style.left = '0'
        } else if (
          topOffset !== -12 &&
          rightOffset === 10 &&
          bottomOffset === 10
        ) {
          this._mask.style.top = '-16px'
          this._mask.style.left = '0'
          // console.log('is hor bottom');
        }
        this._mask.style.display = 'block'
      }, 300)
    )
  }

  /**
   * Move ToolBar to y coord
   * @param {number} y - coord
   */
  showIn(y) {
    // const halfHeight = Math.floor(Number.parseInt(window.getComputedStyle(this._toolbar).height) / 2);
    const halfHeight = Math.floor(
      Number.parseInt(window.getComputedStyle(this._toolbar).height)
    )

    this._toolbar.style.top = y - halfHeight + 'px'
    this.show()
  }
}

/**
 * An item with a menu that appears when you hover over a _table border vertically
 */
export class VerticalBorderToolBar extends BorderToolBar {
  /**
   * Creates
   */
  constructor() {
    super()

    this._toolbar.classList.add(CSS.verticalToolBar)
    this._plusButton.classList.add(CSS.verticalPlusButton)
    this._minusButton.classList.add(CSS.verticalMinusButton)
    this._highlightingLine.classList.add(CSS.verticalHighlightingLine)
    this._mask.classList.add(CSS.verticalMask)

    this._plusButton.addEventListener(
      'mouseover',
      debounce(event => {
        event.stopPropagation()
        this._mask.classList.add(CSS.maskAdd)
        this._mask.style.top = '0'
        this._mask.style.left = '0'

        this._mask.style.display = 'block'
      }, 300)
    )

    this._minusButton.addEventListener(
      'mouseover',
      debounce(event => {
        event.stopPropagation()
        const table = getCurTableFromButton(event)
        const {
          topOffset,
          leftOffset,
          rightOffset,
          bottomOffset,
        } = getRectOffset(table, event.target.parentElement)

        this._mask.classList.add(CSS.maskDelete)
        if (leftOffset === -12 && bottomOffset === 10) {
          this._mask.style.left = '0'
          // console.log('is left border');
        } else if (
          topOffset !== -12 &&
          rightOffset === 10 &&
          bottomOffset === 10
        ) {
          this._mask.style.left = '-16px'
          // console.log('is ver bottom');
        }

        this._mask.style.display = 'block'
      }, 300)
    )
  }

  /**
   * Move ToolBar to x coord
   * @param {number} x - coord
   */
  showIn(x) {
    // const halfWidth = Math.floor(Number.parseInt(window.getComputedStyle(this._toolbar).width) / 2);
    const halfWidth = Math.floor(
      Number.parseInt(window.getComputedStyle(this._toolbar).width)
    )

    this._toolbar.style.left = x - halfWidth + 'px'
    this.show()
  }
}
