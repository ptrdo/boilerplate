(function (exports) {
  /**
   * IDM_Menu is a construct of classic <menu><ul><li><a> hierarchy.
   * Based on HTML5 standards.
   *
   * USAGE:
   * var menu = new IDM_Menu(config);
   * menu.create(targetNode, dataCollection);
   *
   */

  var factory = function (json) {

    // var menu = document.createElement("li"); // TODO: parentNode option (a wrapping element)
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
    // menu.appendChild(drop);

    drop.classList.add("dropdown");

    return drop;
  };

  var draw = function (targetNode, dataCollection) {

    // TODO: provide option for append/prepend
    // element = targetNode.appendChild(factory(info));

    element = targetNode.insertBefore(factory(dataCollection), targetNode.firstChild);
    var mask = document.createElement("div");
    mask.classList.add("menuMask");
    targetNode.insertBefore(mask, targetNode.firstChild);
  };

  var erase = function (targetNode) {
    var parent = targetNode.parentNode;
    parent.removeChild(parent.firstChild);  // Remove mask
    parent.removeChild(parent.firstChild);  // Remove element
    return null;
  };


  exports.IDM_Menu = function (options) {
    "use strict";

    // private instance properties

    var config = options || { setting: null };
    var element, source, instance;

    // public instance properties

    var api = {};

    /**
     * create will generate a menu at a DOM element with prescribed data.
     *
     * @public
     * @param {HTMLElement} targetNode is the place to insert the menu.
     * @param dataCollection {JSON} is the specially-prescribed HTML syntax.
     * @returns {*}
     */
    api.create = function (targetNode, dataCollection) {
      if (arguments.length > 1) {
        if (targetNode instanceof Element) {
          if (dataCollection instanceof Object && /\{.*\:\{.*\:.*\}\}/g.test(JSON.stringify(dataCollection))) {
            if (!!instance && !!element) {
              instance = erase(element);
            }
            element = targetNode;
            source = dataCollection;
            instance = draw(element, source);
            return instance;
          }
        }
      }
      return null;
    };

    api.remove = function () {
      if (!!element) {
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
     * update will supply new data to the previous element
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