//
// Проекции
//

const ProjectionType = {
    PERSPECTIVE: 'perspective',
    AXONOMETRIC: 'axonometric'
};

class Projection {
    constructor(type = ProjectionType.PERSPECTIVE) {
        this.type = type;
        this.distance = 1000;
    }

    project(point3D, canvasWidth, canvasHeight) {
        if (this.type === ProjectionType.PERSPECTIVE) {
            return this.perspectiveProject(point3D, canvasWidth, canvasHeight);
        } else {
            return this.axonometricProject(point3D, canvasWidth, canvasHeight);
        }
    }

    perspectiveProject(point3D, canvasWidth, canvasHeight) {
        // Перспективная проекция
        const factor = this.distance / (this.distance - point3D.z);
        
        const x2D = point3D.x * factor + canvasWidth / 2;
        const y2D = -point3D.y * factor + canvasHeight / 2;
        
        return { x: x2D, y: y2D, depth: point3D.z };
    }

    axonometricProject(point3D, canvasWidth, canvasHeight) {
        // Изометрическая проекция (частный случай аксонометрии)
        const angleX = Math.PI / 6; // 30°
        const angleZ = Math.PI / 6; // 30°
        
        const x2D = (point3D.x * Math.cos(angleX) - point3D.z * Math.cos(angleZ)) + canvasWidth / 2;
        const y2D = (-point3D.y + point3D.x * Math.sin(angleX) + point3D.z * Math.sin(angleZ)) + canvasHeight / 2;
        
        return { x: x2D, y: y2D, depth: point3D.z };
    }

    setType(type) {
        this.type = type;
    }
}

function projectPolyhedron(polyhedron, projection, canvasWidth, canvasHeight) {
    const projectedVertices = polyhedron.vertices.map(v => 
        projection.project(v, canvasWidth, canvasHeight)
    );
    
    return {
        vertices: projectedVertices,
        faces: polyhedron.faces,
        edges: polyhedron.getEdges()
    };
}
