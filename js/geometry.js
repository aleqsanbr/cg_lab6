//
// Классы, матричные преобразования
//

class Point3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Point3D(this.x, this.y, this.z);
    }
}

class Face {
    constructor(vertexIndices) {
        this.vertexIndices = vertexIndices;
    }
}

class Polyhedron {
    constructor(vertices, faces) {
        this.vertices = vertices;
        this.faces = faces;
    }

    clone() {
        const newVertices = this.vertices.map(v => v.clone());
        const newFaces = this.faces.map(f => new Face([...f.vertexIndices]));
        return new Polyhedron(newVertices, newFaces);
    }

    getCenter() {
        const sum = this.vertices.reduce(
            (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y, z: acc.z + v.z }),
            { x: 0, y: 0, z: 0 }
        );
        const n = this.vertices.length;
        return new Point3D(sum.x / n, sum.y / n, sum.z / n);
    }

    getEdges() {
        const edges = [];
        const edgeSet = new Set();

        this.faces.forEach(face => {
            for (let i = 0; i < face.vertexIndices.length; i++) {
                const v1 = face.vertexIndices[i];
                const v2 = face.vertexIndices[(i + 1) % face.vertexIndices.length];
                const edgeKey = v1 < v2 ? `${v1}-${v2}` : `${v2}-${v1}`;

                if (!edgeSet.has(edgeKey)) {
                    edgeSet.add(edgeKey);
                    edges.push([v1, v2]);
                }
            }
        });

        return edges;
    }

    applyTransformation(matrix) {
        this.vertices = this.vertices.map(v => applyMatrix4(v, matrix));
    }
}

function createIdentityMatrix() {
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function multiplyMatrices4(m1, m2) {
    const result = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                result[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }

    return result;
}

function applyMatrix4(point, matrix) {
    const x = point.x * matrix[0][0] + point.y * matrix[0][1] + point.z * matrix[0][2] + matrix[0][3];
    const y = point.x * matrix[1][0] + point.y * matrix[1][1] + point.z * matrix[1][2] + matrix[1][3];
    const z = point.x * matrix[2][0] + point.y * matrix[2][1] + point.z * matrix[2][2] + matrix[2][3];
    const w = point.x * matrix[3][0] + point.y * matrix[3][1] + point.z * matrix[3][2] + matrix[3][3];

    return new Point3D(x / w, y / w, z / w);
}

function createTranslationMatrix(dx, dy, dz) {
    return [
        [1, 0, 0, dx],
        [0, 1, 0, dy],
        [0, 0, 1, dz],
        [0, 0, 0, 1]
    ];
}

function createScaleMatrix(sx, sy, sz) {
    return [
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ];
}

function createRotationXMatrix(angleInDegrees) {
    const rad = angleInDegrees * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return [
        [1, 0, 0, 0],
        [0, cos, -sin, 0],
        [0, sin, cos, 0],
        [0, 0, 0, 1]
    ];
}

function createRotationYMatrix(angleInDegrees) {
    const rad = angleInDegrees * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return [
        [cos, 0, sin, 0],
        [0, 1, 0, 0],
        [-sin, 0, cos, 0],
        [0, 0, 0, 1]
    ];
}

function createRotationZMatrix(angleInDegrees) {
    const rad = angleInDegrees * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    return [
        [cos, -sin, 0, 0],
        [sin, cos, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function createScaleAroundPointMatrix(sx, sy, sz, cx, cy, cz) {
    const t1 = createTranslationMatrix(-cx, -cy, -cz);
    const s = createScaleMatrix(sx, sy, sz);
    const t2 = createTranslationMatrix(cx, cy, cz);

    return multiplyMatrices4(multiplyMatrices4(t2, s), t1);
}

function createRotationAroundCenterMatrix(angleX, angleY, angleZ, center) {
    const t1 = createTranslationMatrix(-center.x, -center.y, -center.z);

    let rotation = createIdentityMatrix();
    if (angleX !== 0) rotation = multiplyMatrices4(rotation, createRotationXMatrix(angleX));
    if (angleY !== 0) rotation = multiplyMatrices4(rotation, createRotationYMatrix(angleY));
    if (angleZ !== 0) rotation = multiplyMatrices4(rotation, createRotationZMatrix(angleZ));

    const t2 = createTranslationMatrix(center.x, center.y, center.z);

    return multiplyMatrices4(multiplyMatrices4(t2, rotation), t1);
}

// ========== Поворот вокруг произвольной прямой ==========

function createRotationAroundLineMatrix(angle, p1, p2) {
    // Направляющий вектор прямой
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    // Нормализация
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const lx = dx / length;
    const ly = dy / length;
    const lz = dz / length;

	 // Перенос в начало координат
    const t1 = createTranslationMatrix(-p1.x, -p1.y, -p1.z);

    // Формула Родрига для поворота вокруг произвольной оси
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const oneMinusCos = 1 - cos;

    const rotationMatrix = [
        [
            cos + lx * lx * oneMinusCos,
            lx * ly * oneMinusCos - lz * sin,
            lx * lz * oneMinusCos + ly * sin,
            0
        ],
        [
            ly * lx * oneMinusCos + lz * sin,
            cos + ly * ly * oneMinusCos,
            ly * lz * oneMinusCos - lx * sin,
            0
        ],
        [
            lz * lx * oneMinusCos - ly * sin,
            lz * ly * oneMinusCos + lx * sin,
            cos + lz * lz * oneMinusCos,
            0
        ],
        [0, 0, 0, 1]
    ];

    // Перенос обратно
    const t2 = createTranslationMatrix(p1.x, p1.y, p1.z);

    return multiplyMatrices4(multiplyMatrices4(t2, rotationMatrix), t1);
}
