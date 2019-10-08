import { create, getCoords, getSideByCoords } from './documentUtils';
import './styles/table.pcss';

const CSS = {
  table: 'tc-table',
  inputField: 'tc-table__inp',
  cell: 'tc-table__cell',
  wrapper: 'tc-table__wrap',
  area: 'tc-table__area',
  tdPrefix: 'td-index-'
};

/**
 * Generates and manages _table contents.
 */
export class Table {
  /**
   * Creates
   */
  constructor() {
    this._numberOfColumns = 0;
    this._numberOfRows = 0;
    this._element = this._createTableWrapper();
    this._table = this._element.querySelector('table');

    this._hangEvents();
  }

  /**
   * Add column in table on index place
   * @param {number} index - number in the array of columns, where new column to insert,-1 if insert at the end
   */
  addColumn(index = -1) {
    this._numberOfColumns++;
    /** Add cell in each row */
    const rows = this._table.rows;

    for (let i = 0; i < rows.length; i++) {
      const cell = rows[i].insertCell(index);

      /*
       * cell.classList.add('td-cell-index' + i);
       * console.log('add column cell: ', cell);
       */

      this._fillCell(cell);
    }

    this._rebuildCellIndex();
  };

  /**
   * Add row in table on index place
   * @param {number} index - number in the array of columns, where new column to insert,-1 if insert at the end
   * @return {HTMLElement} row
   */
  addRow(index = -1) {
    this._numberOfRows++;
    const row = this._table.insertRow(index);

    this._fillRow(row);

    this._rebuildCellIndex();
    return row;
  };

  /**
   * delete coloumn
   * @return {void}
   */
  deleteColumn(tdIndexClassName) {
    const tds = this._table.querySelectorAll('.' + tdIndexClassName);

    if (tds.length === 0) return false;

    this._numberOfColumns -= 1;

    for (let i = 0; i < tds.length; i++) {
      tds[i].remove();
    }

    this._rebuildCellIndex();
  }

  /**
   * delete row
   * @return {void}
   */
  deleteRow(row) {
    if (row) {
      row.remove();
    }
  }

  /**
   * get html element of table
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._element;
  }

  /**
   * get real table tag
   * @return {HTMLElement}
   */
  get body() {
    return this._table;
  }

  /**
   * returns selected/editable cell
   * @return {HTMLElement}
   */
  get selectedCell() {
    return this._selectedCell;
  }

  /**
   * @private
   *
   * Creates table structure
   * @return {HTMLElement} tbody - where rows will be
   */
  _createTableWrapper() {
    return create('div', [ CSS.wrapper ], null, [ create('table', [ CSS.table ]) ]);
  }

  /**
   * @private
   *
   * Create editable area of cell
   * @return {HTMLElement} - the area
   */
  _createContenteditableArea() {
    return create('div', [ CSS.inputField ], { contenteditable: 'true' });
  }

  /**
   * @private
   *
   * Fills the empty cell of the editable area
   * @param {HTMLElement} cell - empty cell
   */
  _fillCell(cell) {
    cell.classList.add(CSS.cell);
    // if (columnIndex !== undefined) cell.classList.add(CSS.tdPrefix + columnIndex);

    const content = this._createContenteditableArea();

    cell.appendChild(create('div', [ CSS.area ], null, [ content ]));
  }

  /**
   * @private
   *
   * Fills the empty row with cells  in the size of numberOfColumns
   * @param row = the empty row
   */
  _fillRow(row) {
    for (let i = 0; i < this._numberOfColumns; i++) {
      const cell = row.insertCell();

      this._fillCell(cell);
    }
  }

  /**
   * @private
   *
   * hang necessary events
   */
  _rebuildCellIndex() {
    const tbody = this._table.querySelector('tbody');

    setTimeout(() => {
      for (let rowIdx = 0; rowIdx < tbody.childNodes.length; rowIdx++) {
        const tr = tbody.childNodes[rowIdx];

        for (let rdIdx = 0; rdIdx < tr.childNodes.length; rdIdx++) {
          tr.childNodes[rdIdx].className = 'tc-table__cell cell-index-' + rdIdx;
        }
      }
    }, 100);
  }

  /**
   * @private
   *
   * hang necessary events
   */
  _hangEvents() {
    this._table.addEventListener('focus', (event) => {
      this._focusEditField(event);
    }, true);

    this._table.addEventListener('blur', (event) => {
      this._blurEditField(event);
    }, true);

    this._table.addEventListener('keydown', (event) => {
      this._pressedEnterInEditField(event);
    });

    this._table.addEventListener('click', (event) => {
      this._clickedOnCell(event);
    });

    this._table.addEventListener('mouseover', (event) => {
      this._mouseEnterInDetectArea(event);
      event.stopPropagation();
    }, true);
  }

  /**
   * @private
   *
   * When you focus on an editable field, remembers the cell
   * @param {FocusEvent} event
   */
  _focusEditField(event) {
    if (!event.target.classList.contains(CSS.inputField)) {
      return;
    }
    this._selectedCell = event.target.closest('.' + CSS.cell);
  }

  /**
   * @private
   *
   * When you blur on an editable field, remembers the cell
   * @param {FocusEvent} event
   */
  _blurEditField(event) {
    if (!event.target.classList.contains(CSS.inputField)) {
      return;
    }
    this._selectedCell = null;
  }

  /**
   * @private
   *
   * When enter is pressed when editing a field
   * @param {KeyboardEvent} event
   */
  _pressedEnterInEditField(event) {
    if (!event.target.classList.contains(CSS.inputField)) {
      return;
    }
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
    }
  }

  /**
   * @private
   *
   * When clicking on a cell
   * @param {MouseEvent} event
   */
  _clickedOnCell(event) {
    if (!event.target.classList.contains(CSS.cell)) {
      return;
    }
    const content = event.target.querySelector('.' + CSS.inputField);

    content.focus();
  }

  /**
   * @private
   *
   * When the mouse enters the detection area
   * @param {MouseEvent} event
   */
  _mouseEnterInDetectArea(event) {
    if (!event.target.classList.contains(CSS.area)) {
      return;
    }

    const coordsCell = getCoords(event.target.closest('TD'));
    const side = getSideByCoords(coordsCell, event.pageX, event.pageY);

    event.target.dispatchEvent(new CustomEvent('mouseInActivatingArea', {
      detail: {
        side: side
      },
      bubbles: true
    }));
  }
}
