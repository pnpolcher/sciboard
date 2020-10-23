(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SciBoard = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var Camera = /*#__PURE__*/function () {
    function Camera(centerX, centerY, width, height, scale) {
      _classCallCheck(this, Camera);

      this.centerX = centerX;
      this.centerY = centerY;
      this.width = width;
      this.height = height;
      this.setScale(scale);
    }

    _createClass(Camera, [{
      key: "recalculateBoundingBox",
      value: function recalculateBoundingBox() {
        // The origin, in the WCS, of the camera.
        // The camera bounding box gets smaller the higher the zoom. Higher zooms
        // translate into smaller visible areas, but objects get larger.
        var worldX = this.centerX - this.width / (2.0 * this.scale);
        var worldY = this.centerY - this.height / (2.0 * this.scale);
        this.worldBoundingRect = new AetherisCanvas.Rectangle(worldX, worldY, this.width / this.scale, this.height / this.scale);
      }
    }, {
      key: "setScale",
      value: function setScale(scale) {
        this.scale = parseFloat(scale);
        this.scale = isNaN(this.scale) ? 1.0 : this.scale;
        this.recalculateBoundingBox();
      }
    }, {
      key: "setCameraPosition",
      value: function setCameraPosition(centerX, centerY) {
        this.centerX = parseFloat(centerX);
        this.centerY = parseFloat(centerY);
        this.recalculateBoundingBox();
      }
    }, {
      key: "moveCamera",
      value: function moveCamera(dx, dy) {
        this.centerX += dx;
        this.centerY += dy;
        this.recalculateBoundingBox();
      }
    }, {
      key: "isItemVisible",
      value: function isItemVisible(item) {
        // Item needs to fall into the camera region for it to be visible.
        // Check whether item is within camera in the WCS.
        return this.worldBoundingRect.containsPoint(item.position);
      }
    }, {
      key: "getLocalItemCoordinates",
      value: function getLocalItemCoordinates(item) {
        return new AetherisCanvas.Point(this.width / 2.0 + (item.position.x - this.centerX) * this.scale, this.height / 2.0 + (item.position.y - this.centerY) * this.scale);
      }
    }, {
      key: "getLocalItemSize",
      value: function getLocalItemSize(item) {
        return new AetherisCanvas.Size(item.size.width * this.scale, item.size.height * this.scale);
      }
    }]);

    return Camera;
  }();

  var _default = /*#__PURE__*/function () {
    function _default(options) {
      _classCallCheck(this, _default);

      this.canvasElement = document.querySelector(options.element || '#canvas');

      if (this.canvasElement === undefined) {
        throw 'No valid canvas object selected.';
      }

      this.canvasElement.onmousedown = function (c) {
        return c.handleCanvasMouseDown;
      }(this);

      this.canvasElement.onmousemove = function (c) {
        return c.handleCanvasMouseMove;
      }(this);

      this.canvasElement.onmouseup = function (c) {
        return c.handleCanvasMouseUp;
      }(this);

      this.canvasElement.onmouseout = function (c) {
        return c.handleCanvasMouseOut;
      }(this);

      this.defaultUnits = options.units || 'px';
      var scale = options.scale || 1.0;
      this.canvasContext = this.canvasElement.getContext('2d');
      var center_x, center_y, width, height;

      if (_typeof(options.top) === 'object' && options.top.hasOwnProperty('x') && options.top.hasOwnProperty('y')) {
        center_x = parseFloat(options.top.x);
        center_y = parseFloat(options.top.y);
      } else {
        center_x = 0.0;
        center_y = 0.0;
      }

      if (_typeof(options.size) === 'object' && options.size.hasOwnProperty('width') && options.size.hasOwnProperty('height')) {
        width = parseFloat(options.size.width);
        height = parseFloat(options.size.height);
      } else {
        width = this.canvasContext.canvas.width;
        height = this.canvasContext.canvas.height;
      }

      this.canvasCamera = new AetherisCanvas.Camera(center_x, center_y, width, height, scale);
      this.canvasItems = [];
      this.gridColor = options.gridColor || '#2020cc';
      this.gridActive = false;
      this.gridCenter = new AetherisCanvas.Point(0.0, 0.0);
      this.gridDimensions = new AetherisCanvas.Dimension(10.0, this.defaultUnits);
      this.draggingCanvas = false;
      this.draggingObject = false;
      this.startDragX = 0;
      this.startDragY = 0;
    }

    _createClass(_default, [{
      key: "addItem",
      value: function addItem(item) {
        if (item instanceof AetherisCanvas.Item) {
          this.canvasItems.push(item);
          this.redraw();
        }
      }
    }, {
      key: "redraw",
      value: function redraw() {
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);

        for (var key in this.canvasItems) {
          var item = this.canvasItems[key];

          if (this.canvasCamera.isItemVisible(item)) {
            console.log('Item is visible');
            item.draw(this.canvasContext, this.canvasCamera);
          }
        }
      }
    }, {
      key: "toggleGrid",
      value: function toggleGrid() {
        this.gridActive = !this.gridActive;

        if (this.gridActive) {
          var ctx = this.canvasElement.getContext('2d');
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          console.log(ctx.canvas.width.toString() + ', ' + ctx.canvas.height.toString());

          for (var i = 0; i < 100; i += 10) {
            ctx.fillStyle = this.gridColor;
            ctx.fillRect(i + 1, 10, 1, 1);
          }
        }
      }
    }, {
      key: "drawGrid",
      value: function drawGrid() {// TODO: Draw grid.
      }
    }, {
      key: "zoomIn",
      value: function zoomIn() {
        this.canvasCamera.setScale(this.canvasCamera.scale + 0.25);
        this.redraw();
      }
    }, {
      key: "zoomOut",
      value: function zoomOut() {
        this.canvasCamera.setScale(this.canvasCamera.scale - 0.25);
        this.redraw();
      }
    }, {
      key: "isMouseOnObject",
      value: function isMouseOnObject(x, y) {
        for (var key in this.canvasItems) {
          var item = this.canvasItems[key];
        }
      }
    }, {
      key: "handleCanvasMouseDown",
      value: function handleCanvasMouseDown(e) {
        canvas.startDragX = parseInt(e.clientX);
        canvas.startDragY = parseInt(e.clientY);
        canvas.draggingObject = canvas.isMouseOnObject(canvas.startDragX, canvas.startDragY);
        canvas.draggingCanvas = !canvas.draggingObject;
      }
    }, {
      key: "handleCanvasMouseUp",
      value: function handleCanvasMouseUp(e) {
        var mouseX = parseInt(e.clientX);
        var mouseY = parseInt(e.clientY);

        if (canvas.draggingObject === true) ; else {
          canvas.draggingCanvas = false;
        }
      }
    }, {
      key: "handleCanvasMouseMove",
      value: function handleCanvasMouseMove(e) {
        if (canvas.draggingCanvas === true) {
          var mouseX = parseInt(e.clientX);
          var mouseY = parseInt(e.clientY);
          canvas.canvasCamera.moveCamera(canvas.startDragX - mouseX, canvas.startDragY - mouseY);
          canvas.startDragX = mouseX;
          canvas.startDragY = mouseY;
          canvas.redraw();
        } else if (canvas.draggingObject === true) ;
      }
    }, {
      key: "handleCanvasMouseOut",
      value: function handleCanvasMouseOut(e) {
        var mouseX = parseInt(e.clientX);
        var mouseY = parseInt(e.clientY);

        if (canvas.draggingObject === true) ; else {
          canvas.draggingCanvas = false;
        }
      }
    }]);

    return _default;
  }();

  var _default$1 = function _default(size, units) {
    _classCallCheck(this, _default);

    this.size = size;
    this.units = units;
  };

  var Item = /*#__PURE__*/function () {
    function Item(x, y, width, height, centerObject, props) {
      _classCallCheck(this, Item);

      // Whether the x and y coordinates refer to the center of the object.
      // If not, they refer to the top left corner of its bounding box.
      this.centerObject = centerObject || false; // The position of the item in the WCS.

      this.position = new AetherisCanvas.Point(x, y); // The size of the item.

      this.size = new AetherisCanvas.Size(width, height); // Custom properties attached to this item.

      this.props = props; // Children contained by this item. They all must be of type Item.

      this.children = []; // The item's parent, or null if it's a root item.

      this.parent = null;
    }

    _createClass(Item, [{
      key: "draw",
      value: function draw(ctx, camera) {
        var destCoords = camera.getLocalItemCoordinates(this);
        var destSize = camera.getLocalItemSize(this);

        if (this.centerObject) {
          ctx.fillRect(destCoords.x - destSize.width / 2.0, destCoords.y - destSize.height / 2.0, destSize.width, destSize.height);
        } else {
          ctx.fillRect(destCoords.x, destCoords.y, destSize.width, destSize.height);
        }

        for (var key in this.children) {
          var item = this.children[key];
          item.draw(ctx, camera);
        }
      }
    }, {
      key: "addChild",
      value: function addChild(x, y, child) {
        if (child instanceof Item) {
          // Update the child's position.
          child.parent = this;
          child.position.x = x;
          child.position.y = y;
          this.children.push(child);
        } else {
          throw 'Parameter child is not of class Item.';
        }
      }
    }, {
      key: "moveItem",
      value: function moveItem(dx, dy) {
        this.position.x += dx;
        this.position.y += dy;
      }
    }]);

    return Item;
  }();

  var _default$2 = /*#__PURE__*/function () {
    function _default(x, y) {
      _classCallCheck(this, _default);

      this.x = x;
      this.y = y;
    }

    _createClass(_default, [{
      key: "distanceToPoint",
      value: function distanceToPoint(targetPoint) {
        return this.distanceToCoords(targetPoint.x, targetPoint.y);
      }
    }, {
      key: "distanceToCoords",
      value: function distanceToCoords(x, y) {
        var dx = this.x - x;
        var dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy);
      }
    }]);

    return _default;
  }();

  var _default$3 = /*#__PURE__*/function () {
    function _default(x, y, width, height) {
      _classCallCheck(this, _default);

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.bottomX = x + width;
      this.bottomY = y + height;
      this.centerX = (x + width) / 2.0;
      this.centerY = (y + height) / 2.0;
    }

    _createClass(_default, [{
      key: "distanceToPoint",
      value: function distanceToPoint(point) {
        dx = this.centerX - point.x;
        dy = this.centerY - point.y;
      }
    }, {
      key: "closestGridPoint",
      value: function closestGridPoint(points) {
        if (!Array.isArray(points) || points.length !== 4) {
          throw 'Parameter points needs to be an array of exactly four items.';
        }

        var minDistance = Number.MAX_VALUE;
        var pointIndex = -1;

        for (var i = 0; i < 4; i++) {
          var distance = points[i].distanceToCoords(this.centerX, this.centerY);

          if (distance < minDistance) {
            minDistance = points[i];
            pointIndex = i;
          }
        }

        return points[pointIndex];
      }
    }, {
      key: "contains",
      value: function contains(x, y) {
        console.log("bb = (" + this.x.toString() + ',' + this.y.toString() + ',' + this.bottomX.toString() + ',' + this.bottomY.toString() + ')');
        console.log('p = (' + x.toString() + ',' + y.toString() + ')');
        return x >= this.x && y >= this.y && x <= this.bottomX && y <= this.bottomY;
      }
    }, {
      key: "containsPoint",
      value: function containsPoint(point) {
        return this.contains(point.x, point.y);
      }
    }]);

    return _default;
  }();

  var _default$4 = function _default(width, height) {
    _classCallCheck(this, _default);

    this.width = width;
    this.height = height;
  };

  exports.Camera = Camera;
  exports.Canvas = _default;
  exports.Dimension = _default$1;
  exports.Item = Item;
  exports.Point = _default$2;
  exports.Rectangle = _default$3;
  exports.Size = _default$4;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sciboard.js.map
