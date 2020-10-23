export default class {

    constructor(options) {

        this.canvasElement = document.querySelector(options.element || '#canvas');
        if (this.canvasElement === undefined) {
            throw 'No valid canvas object selected.';
        }

        this.canvasElement.onmousedown = (function(c) { return c.handleCanvasMouseDown; })(this);
        this.canvasElement.onmousemove = (function(c) { return c.handleCanvasMouseMove; })(this);
        this.canvasElement.onmouseup = (function(c) { return c.handleCanvasMouseUp; })(this);
        this.canvasElement.onmouseout = (function(c) { return c.handleCanvasMouseOut; })(this);

        this.defaultUnits = options.units || 'px';
        const scale = options.scale || 1.0;

        this.canvasContext = this.canvasElement.getContext('2d');

        let center_x, center_y, width, height;
        if (typeof options.top === 'object' &&
            options.top.hasOwnProperty('x') &&
            options.top.hasOwnProperty('y')) {

            center_x = parseFloat(options.top.x);
            center_y = parseFloat(options.top.y);
        } else {
            center_x = 0.0;
            center_y = 0.0;
        }

        if (typeof options.size === 'object' &&
            options.size.hasOwnProperty('width') &&
            options.size.hasOwnProperty('height')) {

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

    addItem(item) {
        if (item instanceof AetherisCanvas.Item) {
            this.canvasItems.push(item);
            this.redraw();
        }
    }

    redraw() {
        this.canvasContext.clearRect(
            0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        for (let key in this.canvasItems) {
            const item = this.canvasItems[key];
            if (this.canvasCamera.isItemVisible(item)) {
                console.log('Item is visible');
                item.draw(this.canvasContext, this.canvasCamera);
            }
        }
    }

    toggleGrid() {
        this.gridActive = !this.gridActive;
        if (this.gridActive) {            
            const ctx = this.canvasElement.getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            console.log(ctx.canvas.width.toString() + ', ' + ctx.canvas.height.toString());

            for (let i = 0; i < 100; i += 10) {
                ctx.fillStyle = this.gridColor;
                ctx.fillRect(i + 1, 10, 1, 1);
            }
        }
    }

    drawGrid() {
        // TODO: Draw grid.
    }

    zoomIn() {
        this.canvasCamera.setScale(this.canvasCamera.scale + 0.25);
        this.redraw();
    }

    zoomOut() {
        this.canvasCamera.setScale(this.canvasCamera.scale - 0.25);
        this.redraw();
    }

    isMouseOnObject(x, y) {
        for (let key in this.canvasItems) {
            const item = this.canvasItems[key];
        }
    }

    handleCanvasMouseDown(e) {
        canvas.startDragX = parseInt(e.clientX);
        canvas.startDragY = parseInt(e.clientY);
        canvas.draggingObject = canvas.isMouseOnObject(canvas.startDragX, canvas.startDragY);
        canvas.draggingCanvas = !canvas.draggingObject;
    }

    handleCanvasMouseUp(e) {
        const mouseX = parseInt(e.clientX);
        const mouseY = parseInt(e.clientY);

        if (canvas.draggingObject === true) {
            // TODO: Drop object here.
        } else {
            canvas.draggingCanvas = false;
        }
    }

    handleCanvasMouseMove(e) {
        if (canvas.draggingCanvas === true) {
            const mouseX = parseInt(e.clientX);
            const mouseY = parseInt(e.clientY);
            canvas.canvasCamera.moveCamera(canvas.startDragX - mouseX, canvas.startDragY - mouseY);
            canvas.startDragX = mouseX;
            canvas.startDragY = mouseY;

            canvas.redraw();
        } else if (canvas.draggingObject === true) {
            // TODO: Update object position.
        }
    }

    handleCanvasMouseOut(e) {

        const mouseX = parseInt(e.clientX);
        const mouseY = parseInt(e.clientY);

        if (canvas.draggingObject === true) {
            // TODO: Stop dragging object.
        } else {
            canvas.draggingCanvas = false;
        }
    }
}
