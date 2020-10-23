export default class Camera {

    constructor(centerX, centerY, width, height, scale) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
        this.setScale(scale);
    }

    recalculateBoundingBox() {

        // The origin, in the WCS, of the camera.
        // The camera bounding box gets smaller the higher the zoom. Higher zooms
        // translate into smaller visible areas, but objects get larger.
        const worldX = (this.centerX - this.width / (2.0 * this.scale));
        const worldY = (this.centerY - this.height / (2.0 * this.scale));

        this.worldBoundingRect = new AetherisCanvas.Rectangle(
            worldX, worldY, this.width / this.scale, this.height / this.scale);
    }

    setScale(scale) {
        this.scale = parseFloat(scale);
        this.scale = isNaN(this.scale) ? 1.0 : this.scale;
        this.recalculateBoundingBox();
    }

    setCameraPosition(centerX, centerY) {
        this.centerX = parseFloat(centerX);
        this.centerY = parseFloat(centerY);
        this.recalculateBoundingBox();
    }

    moveCamera(dx, dy) {
        this.centerX += dx;
        this.centerY += dy;
        this.recalculateBoundingBox();
    }

    isItemVisible(item) {
        // Item needs to fall into the camera region for it to be visible.
        // Check whether item is within camera in the WCS.
        return this.worldBoundingRect.containsPoint(item.position);
    }

    getLocalItemCoordinates(item) {
        return new AetherisCanvas.Point(
            (this.width / 2.0) + (item.position.x - this.centerX) * this.scale,
            (this.height / 2.0) + (item.position.y - this.centerY) * this.scale);
    }

    getLocalItemSize(item) {
        return new AetherisCanvas.Size(
            item.size.width * this.scale,
            item.size.height * this.scale);
    }
}