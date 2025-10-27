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
        // Камера расположена на расстоянии distance по оси Z
        const factor = this.distance / (this.distance - point3D.z);
        
        const x2D = point3D.x * factor + canvasWidth / 2;
        const y2D = -point3D.y * factor + canvasHeight / 2; // инвертируем Y
        
        return { x: x2D, y: y2D, depth: point3D.z };
    }

    axonometricProject(point3D, canvasWidth, canvasHeight) {
        // Изометрическая проекция (частный случай аксонометрии)
        // Углы: 30° для X, 30° для Z
        const angleX = Math.PI / 6; // 30°
        const angleZ = Math.PI / 6; // 30°
        
        const x2D = (point3D.x * Math.cos(angleX) - point3D.z * Math.cos(angleZ)) + canvasWidth / 2;
        const y2D = (-point3D.y + point3D.x * Math.sin(angleX) + point3D.z * Math.sin(angleZ)) + canvasHeight / 2;
        
        return { x: x2D, y: y2D, depth: point3D.z };
    }

    setDistance(distance) {
        this.distance = distance;
    }

    setType(type) {
        this.type = type;
    }
}

// ========== Вспомогательные функции для отрисовки ==========

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

// Определение видимости грани (для удаления невидимых граней)
function isFaceVisible(face, vertices3D, cameraPosition) {
    // Берем три первые вершины грани для вычисления нормали
    const v1 = vertices3D[face.vertexIndices[0]];
    const v2 = vertices3D[face.vertexIndices[1]];
    const v3 = vertices3D[face.vertexIndices[2]];
    
    // Векторы двух сторон треугольника
    const edge1 = {
        x: v2.x - v1.x,
        y: v2.y - v1.y,
        z: v2.z - v1.z
    };
    const edge2 = {
        x: v3.x - v1.x,
        y: v3.y - v1.y,
        z: v3.z - v1.z
    };
    
    // Нормаль грани (векторное произведение)
    const normal = {
        x: edge1.y * edge2.z - edge1.z * edge2.y,
        y: edge1.z * edge2.x - edge1.x * edge2.z,
        z: edge1.x * edge2.y - edge1.y * edge2.x
    };
    
    // Вектор от грани к камере
    const toCamera = {
        x: cameraPosition.x - v1.x,
        y: cameraPosition.y - v1.y,
        z: cameraPosition.z - v1.z
    };
    
    // Скалярное произведение (если > 0, грань видна)
    const dot = normal.x * toCamera.x + normal.y * toCamera.y + normal.z * toCamera.z;
    
    return dot > 0;
}
