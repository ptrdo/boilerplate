(function (exports) {
  /**
   * IDM_Menu is a dropdown menu constructor as prescribed by JSON-formatted HTML syntax.
   *
   * @copyright (c) 2017 Intellectual Ventures Property Holdings, LLC
   * @license MIT
   * @version 1.00, 2017/10/24
   * @requires "HTML5", "ECMA-262 Edition 5.1"
   * @requires IE 10+, Edge 14+, FF 52+, Chrome 49+, Safari 10+
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
   *   import IDM_Menu from "path/to/idmorg-menu.js";
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
      // removing the menuMask...
      parent.removeChild(parent.firstChild);
    }
    parent.removeChild(parent.firstChild);
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
     * @property {Function} config.menuHandler is attached/removed as handler for open/close of menu.
     * @property {Function} config.menuItemHandler is attached/removed as "click" handler of the appended menu.
     */
    var config = {
      handleToggling: true,
      maskElsewhere: true,
      menuHandler: function(event) {
        event.stopPropagation();
        element.classList.toggle("active");
      },
      menuItemHandler: function(event) {}
    };

    /* override defaults */
    if (!!options && options instanceof Object) {
      if ("handleToggling" in options) {
        config.handleToggling = !!options.handleToggling;
      }
      if ("maskElsewhere" in options) {
        config.maskElsewhere = !!options.maskElsewhere;
      }
      if ("menuHandler" in options) {
        if (options.menuHandler instanceof Function) {
          config.menuHandler = options.menuHandler;
        }
      }
      if ("menuItemHandler" in options) {
        if (options.menuItemHandler instanceof Function) {
          config.menuItemHandler = options.menuItemHandler;
        }
      }
    }

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
              element.removeEventListener("click", config.menuHandler);
              instance.removeEventListener("click", config.menuItemHandler);
              instance = erase(element);
            }
            element = targetNode;
            source = dataCollection;
            instance = draw(element, source, config.maskElsewhere);
            instance.addEventListener("click", config.menuItemHandler, false);
            if (config.handleToggling) {
              element.addEventListener("click", config.menuHandler, false);
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
     * remove element, data, and handlers.
     */
    api.remove = function () {
      if (!!element) {
        element.removeEventListener("click", config.menuHandler);
        instance.removeEventListener("click", config.menuItemHandler);
        instance = erase(element);
        element = null;
      }
      source = null;
    };

    api.getElement = function () {
      return element;
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