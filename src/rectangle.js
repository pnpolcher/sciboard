export default class {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bottomX = x + width;
        this.bottomY = y + height;
        this.centerX = (x + width) / 2.0;
        this.centerY = (y + height) / 2.0;
    }

    distanceToPoint(point) {
        dx = this.centerX - point.x;
        dy = this.centerY - point.y;
    }

    closestGridPoint(points) {
        if (!Array.isArray(points) || points.length !== 4) {
            throw 'Parameter points needs to be an array of exactly four items.';
        }

        let minDistance = Number.MAX_VALUE;
        let pointIndex = -1;

        for (let i = 0; i < 4; i++) {
            const distance = points[i].distanceToCoords(this.centerX, this.centerY);
            if (distance < minDistance) {
                minDistance = points[i];
                pointIndex = i;
            }
        }

        return points[pointIndex];
    }

    contains(x, y) {
        console.log("bb = (" + this.x.toString() + ',' + this.y.toString() + ',' + this.bottomX.toString() + ',' + this.bottomY.toString() + ')');
        console.log('p = (' + x.toString() + ',' + y.toString() + ')');
        return (x >= this.x && y >= this.y && x <= this.bottomX && y <= this.bottomY);
    }

    containsPoint(point) {
        return this.contains(point.x, point.y);
    }
};
