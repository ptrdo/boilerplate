﻿(function (exports) {
  /**
   * IDM_Menu is a dropdown menu constructor as prescribed by JSON-formatted HTML syntax.
   *
   * @copyright (c) 2017 Intellectual Ventures Property Holdings, LLC
   * @license MIT
   * @version 1.00, 2017/10/24
   * @requires "HTML5", "ECMA-262 Edition 5.1"
   * @requires Explorer 10+, Edge 14+, FF 52+, Chrome 49+, Safari 10+
   * @requires idmorg-core.css (-font.css, -global.css recommended)
   *
   * AMD (RequireJS) IMPLEMENTATION:
   *
   *   require.config({
   *     paths: { IDM_Menu: "/path/to/idmorg-menu"},
   *     shim: { IDM_Menu: { exports: "IDM_Menu" }}
   *   });
   *
   *   define(["IDM_Menu"], function(Menu) {
   *
   *     var myMenu = new Menu(configOverrides);
   *     myMenu.create(someTargetNode, someJSON);
   *
   *   });
   *
   *
   * CommonJS (NodeJS) IMPLEMENTATION:
   *
   *   import { IDM_Menu } from "path/to/idmorg-menu.js";
   *
   *   $(function() {
   *
   *     var myMenu = new IDM_Menu(configOverrides);
   *     myMenu.create(someTargetNode, someJSON);
   *
   *   });
   *
   *
   * BROWSER IMPLEMENTATION:
   *
   *   <script type="text/javascript" src="./path/to/idmorg-menu.js"></script>
   *
   *   window.addEventListener("load", function(event) {
   *
   *     var myMenu = new IDM_Menu(configOverrides);
   *     myMenu.create(someTargetNode, someJSON);
   *
   *   }, true);
   *
   */

  var factory = function (json) {

    var drop = document.createElement("menu");
    var list = document.createElement("ul");

    json.childNodes.forEach(function (child) {

      var text, cell = null, item = document.createElement("li");

      if ("element" in child) {
        cell = document.createElement(child.element);
        text = document.createTextNode(child.content);
        cell.appendChild(text);
        item.appendChild(cell);
        if (/\ba\b/i.test(child.element)) {
          cell.setAttribute("tabindex", 0);
        }
      }

      if ("attributes" in child) {
        for (var prop in child.attributes) {
          if (child.attributes.hasOwnProperty(prop)) {
            if (!!cell) {
              cell.setAttribute(prop, child.attributes[prop]);
            } else {
              item.setAttribute(prop, child.attributes[prop]);
            }
          }
        }
      }

      if ("childNodes" in child) {
        cell = document.createElement("a");
        text = document.createTextNode("\uFF0B");
        cell.setAttribute("href", "#void");
        cell.appendChild(text);
        cell.classList.add("expander");
        item.appendChild(cell);
        item.classList.add("more");
        item.appendChild(factory({"childNodes": child.childNodes}));
      }

      list.appendChild(item);
    });

    drop.appendChild(list);
    drop.classList.add("dropdown");
    return drop;
  };

  var draw = function (targetNode, dataCollection, addMask) {
    var menu = targetNode.insertBefore(factory(dataCollection), targetNode.firstChild);
    var mask = document.createElement("div");
    if (!!addMask) {
      mask.classList.add("menuMask");
      targetNode.insertBefore(mask, targetNode.firstChild);
    }
    return menu;
  };

  var erase = function (targetNode) {
    var parent = targetNode.parentNode;
    if (parent.firstChild != targetNode) {
      // remove menuMask if it exists...
      parent.removeChild(parent.firstChild);
    }
    if (parent.firstChild == targetNode) {
      // remove the menu itself...
      parent.removeChild(parent.firstChild);
    }
    return null;
  };


  exports.IDM_Menu = function (options) {
    "use strict";

    /**
     * @private
     * @property {HTMLElement} instance is the appended menu.
     * @property {HTMLElement} element is the parent of the appended menu.
     * @property {JSON} source is the data which prescribes the menu.
     */
    var element, source, instance;

    /**
     * @public overridden via options passed at instantiation
     * @property {Boolean} config.handleToggling when true, open/close of menu is provided.
     * @property {Boolean} config.maskElsewhere when true, entire viewport is cloaked to dismiss menu with click-away.
     * @property {Function} config.onMenuToggle fires when menu is opened or closed, invoked with one argument: true if open, false if closed.
     * @property {Function} config.onMenuItemClick fires when menu item is clicked, invoked with one argument: the event.
     */
    var config = {
      handleToggling: true,
      maskElsewhere: true,
      onMenuToggle: function(isOpen) {
        // console.log("menu.isOpen:", isOpen);
      },
      onMenuItemClick: function(event) {
        // console.log("clicked!", event.target);
        // when usurping an href, add this here:
        // event.preventDefault();
      }
    };

    /* override defaults with any passed options */
    if (!!options && options instanceof Object) {
      if ("handleToggling" in options) {
        config.handleToggling = !!options.handleToggling;
      }
      if ("maskElsewhere" in options) {
        config.maskElsewhere = !!options.maskElsewhere;
      }
      if ("onMenuToggle" in options) {
        if (options.onMenuToggle instanceof Function) {
          config.onMenuToggle = options.onMenuToggle;
        }
      }
      if ("onMenuItemClick" in options) {
        if (options.onMenuItemClick instanceof Function) {
          config.onMenuItemClick = options.onMenuItemClick;
        }
      }
    }

    /**
     * @private listeners
     * @event {Function} onMenuToggleHandler is a listener for the "click" which opens/closes a menu.
     * @event {Function} onMenuItemClickHandler is a listener for the "click" of a menu item.
     */
    var onMenuToggleHandler = function (event) {
      event.stopPropagation();
      element.classList.toggle("active");

      if ("onMenuToggle" in config && config.onMenuToggle instanceof Function) {
        config.onMenuToggle(element.classList.contains("active"));
      }
    };
    var onMenuItemClickHandler = function (event) {
      // event.stopPropagation(); // ...would end bubble and keep menu open
      if ("onMenuItemClick" in config && config.onMenuItemClick instanceof Function) {
        config.onMenuItemClick(event);
      }
    };

    /**
     * @public methods
     */
    var api = {};

    /**
     * create will generate a menu at a DOM element with prescribed data.
     *
     * @public
     * @param {HTMLElement} targetNode is the place to insert the menu.
     * @param {JSON} dataCollection is the specially-prescribed HTML syntax.
     * @returns {*}
     */
    api.create = function (targetNode, dataCollection) {
      if (arguments.length > 1) {
        if (targetNode instanceof Element) {
          if (dataCollection instanceof Object && /\{.*\:\{.*\:.*\}\}/g.test(JSON.stringify(dataCollection))) {
            if (!!instance && !!element) {
              element.removeEventListener("click", onMenuToggleHandler);
              instance.removeEventListener("click", onMenuItemClickHandler);
              instance = erase(element);
            }
            element = targetNode;
            source = dataCollection;
            instance = draw(element, source, config.maskElsewhere);
            instance.addEventListener("click", onMenuItemClickHandler, false);
            if (config.handleToggling) {
              element.addEventListener("click", onMenuToggleHandler, false);
            }
            return instance;
          }
        }
      }
      return null;
    };

    /**
     * isReady
     * @returns {Boolean} true when a menu is rendered to the DOM.
     */
    api.isReady = function () {
      return !!instance;
    };

    /**
     * isOpen
     * @returns {Boolean} true when a menu is rendered and visible.
     */
    api.isOpen = function () {
      return !!element && element.classList.contains("active");
    };

    /**
     * remove element, data, and handlers.
     */
    api.remove = function () {
      if (!!element) {
        element.removeEventListener("click", onMenuToggleHandler);
        instance.removeEventListener("click", onMenuItemClickHandler);
        instance = erase(element);
        element = null;
      }
      source = null;
    };

    api.getElement = function () {
      return element;
    };

    api.getMenu = function () {
      return instance;
    };

    api.getData = function () {
      return source;
    };

    /**
     * update will usurp a pre-existing menu instance with new data.
     *
     * @public
     * @param {JSON} newData is the JSON of specially-prescribed HTML syntax.
     * @returns {Boolean} true is success, false is fail (or no prior element exists).
     */
    api.update = function (newData) {
      if (!!element) {
        return !!this.create(element, newData);
      }
      return false;
    };

    return api;

  };
}(typeof exports === "object" && exports || this));