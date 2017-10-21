(function (exports) {
  /**
   * MENU is a class for instantiating a construct of classic <menu><ul><li> hierarchy.
   * Based on HTML5 standards.
   *
   * Note: No dependencies here (e/g jQuery) since menuing may be required in catastrophic circumstances.
   *
   * USAGE: new Menu(targetNode, dataCollection);
   *
   * @param {HTMLElement} targetNode // reference to an element configured as a template
   * @param {Array} dataCollection // conventional JSON collection of objects @see app/navigation.js
   * @returns {this}
   *
   */
  var draw = function(targetNode, dataCollection) {

    var info = dataCollection;
    var element = targetNode;

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
  }

  var init = function () {

    // TODO: provide option for append/prepend
    // element = targetNode.appendChild(factory(info));

    element = targetNode.insertBefore(factory(info), targetNode.firstChild);
    var mask = document.createElement("div");
    mask.classList.add("menuMask");
    targetNode.insertBefore(mask, targetNode.firstChild);
  };

  var remove = function () {
    var parent = element.parentNode;
    parent.removeChild(parent.firstChild);  // Remove mask
    parent.removeChild(parent.firstChild);  // Remove element
    element = undefined;
  };


  exports.Menu = function (options) {
    "use strict";

    // private instance properties

    var config = options || {info: 0};
    var property = config.info; // example
    var element, source;

    // public instance properties

    var api = {};

    api.render = function (ele, data) {

      element = ele;
      source = data;

      if (typeof data === "object") {
        draw(ele, data);
      }
    };

    return api;

  };
}(typeof exports === "object" && exports || this));