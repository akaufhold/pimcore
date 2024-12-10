/**
 * @module Collider
 * @author Andreas Kaufhold <info@stackfactory.de>
 * @version 1.0.0
 * @example new Collider('class1',DOMElement1,'id1')
 */

 'use strict'

 import Loader from './loader'
 
 /**
	* Class for checking collisions between html elements
	* @namespace Collider
	*/
 export default class Collider {
	 /**
		* Stored Elements
		* @public {opts} controlMessage - Default Message for detected collision.
		*/
	 elements = []
 
	 /**
		* Options
		* @private {object} opts - Options for Collision Detection.
		*/
	 #opts
 
	 /**
		* Defaults
		* @private {string} controlMessage - Default message for detected collision.
		* @public {int} elementsCount - Counter for loaded elements
		* @public {bool} elementsLoaded - Logs if elements are loaded already
		*/
	 static #controlMessage = 'Collision occured'
	 elementsCount = 0
	 elementsLoaded = false
 
	 /**
		* Creates a Collider.
		* @constructor
		* @param {object} options - Options for element collision.
		* @param {array} elements - Array of classes to check collision for.
		*/
 
	 constructor (
		 options = {},
		 ...elements
	 ) {
		 this.#setOptions(options)
		 this.#opts = this.options
		 this.elements = elements.length && Array.from(this.#elementsFromDom(elements))
		 this.elementsCount = this.elements.length
		 try {
			 this.elementsCount && this.init()
		 } catch (err) {
			 console.error(err)
			 throw new Error('Elements not found in DOM', {cause: err})
		 }
	 }
 
	 /**
		* Set this.options.
		* @param {object} options - The string containing two comma-separated numbers.
		*/
	 #setOptions (options) {
		 this.#mergeDeep(this.options, options)
	 }
 
	 /**
		* Recursive Overwriting of options object.
		* @param {object} target - Options object to overwrite.
		* @param {object} source - Source object from constructor.
		* @return {object} An options object.
		*/
	 #mergeDeep (target, source) {
		 const isObject = (obj) => obj && typeof obj === 'object'
		 if (!isObject(target) || !isObject(source)) {
			 return source
		 }
		 Object.keys(source).forEach(key => {
			 const targetValue = target[key]
			 const sourceValue = source[key]
			 if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
				 target[key] = targetValue.concat(sourceValue)
			 } else if (isObject(targetValue) && isObject(sourceValue)) {
				 target[key] = this.#mergeDeep(Object.assign({}, targetValue), sourceValue)
			 } else {
				 target[key] = sourceValue
			 }
		 })
		 return target
	 }
 
	 async init () {
		 try {
			 /**
				* elementsLoaded is now Loader#elementsLoaded
				* @instance
				*/
			 const loader = await new Loader(this.elements)
			 this.elementsLoaded = loader.elementsLoaded
		 } catch (err) {
			 throw new Error('Elements initialising failed', {cause: err})
		 } finally {
			 this.getElementsCollision()
		 }
	 }
 
	 /**
		* Preloading elements from DOM
		* @return {NodeList} A list of node elements.
		*/
	 #elementsFromDom (elements) {
		 return document.querySelectorAll(`.${this.opts.sliderClass}`)[0].children
	 }
 
	 /**
		* Check collisions of stored element nodes
		* @return {NodeList} A list of Node Elements.
		*/
	 getElementsCollision () {
		 this.elements.forEach((el) => this.#getElementProperties(el))
		 this.checkCollisionCondition(el)
	 }
 
	 #getElementProperties(el){
		 el.b = el.getBoundingClientRect();
		 return el;
	 }
 
	 #checkCollisionCondition(el1, el2) {
		 return !(
			 el1.top > el2.bottom ||
			 el1.right < el2.left ||
			 el1.bottom < el2.top ||
			 el1.left > el2.right
		 );
	 }
 }
 