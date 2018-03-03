/**
 * LocalStorageMock serve as a mock of the localStorage for testing in Jest
 * @class LocalStorageMock
 */
class LocalStorage {
  /**
   * @description creates a new instance of this class
   * @constructor
   * @memberOf LocalStorageMock
   */
  constructor() {
    /** @type {Object} */
    this.store = {};
  }

  /**
   * @description clears the store
   * @method
   * @memberOf LocalStorageMock
   * @returns {void}
   */
  clear() {
    this.store = {};
  }

  /**
   * @description returns the value stored on the supplied key
   * @method
   * @memberOf LocalStorageMock
   * @param {string} key The item's key to retrieve from
   * @returns {void}
   */
  getItem(key) {
    return this.store[key] || null;
  }

  /**
   * @description sets the store with the supplied key
   * @method
   * @memberOf LocalStorageMock
   * @param {Object} key The key to store
   * @param {string} value The value to set the key to
   * @returns {void}
   */
  setItem(key, value) {
    this.store[key] = value;
  }

  /**
   * @description removes the item from the store corresponding to the key
   * @method
   * @memberOf LocalStorageMock
   * @param {Object} key The key to remove
   * @returns {void}
   */
  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorage();
