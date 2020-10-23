export default class {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distanceToPoint(targetPoint) {
        return this.distanceToCoords(targetPoint.x, targetPoint.y);
    }

    distanceToCoords(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
}
