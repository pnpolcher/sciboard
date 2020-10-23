export default class Item {

    constructor(x, y, width, height, centerObject, props) {

        // Whether the x and y coordinates refer to the center of the object.
        // If not, they refer to the top left corner of its bounding box.
        this.centerObject = centerObject || false;

        // The position of the item in the WCS.
        this.position = new AetherisCanvas.Point(x, y);

        // The size of the item.
        this.size = new AetherisCanvas.Size(width, height);

        // Custom properties attached to this item.
        this.props = props;

        // Children contained by this item. They all must be of type Item.
        this.children = [];

        // The item's parent, or null if it's a root item.
        this.parent = null;
    }

    draw(ctx, camera) {
        const destCoords = camera.getLocalItemCoordinates(this);
        const destSize = camera.getLocalItemSize(this);

        if (this.centerObject) {
            ctx.fillRect(destCoords.x - destSize.width/2.0, destCoords.y - destSize.height/2.0, destSize.width, destSize.height);
        } else {
            ctx.fillRect(destCoords.x, destCoords.y, destSize.width, destSize.height);
        }

        for (let key in this.children) {
            const item = this.children[key];
            item.draw(ctx, camera);
        }
    }

    addChild(x, y, child) {
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

    moveItem(dx, dy) {
        this.position.x += dx;
        this.position.y += dy;
    }
}