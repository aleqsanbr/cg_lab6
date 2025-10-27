//
// Инициализации и основные функции
//

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentPolyhedron = null;
let currentProjection = new Projection(ProjectionType.AXONOMETRIC);
let currentShape = 'tetrahedron';

function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width - 4;
    canvas.height = rect.height - 4;

    render();
}

function init() {
    setupEventListeners();
    resizeCanvas();
    loadPolyhedron('tetrahedron');
    render();
}

function setupEventListeners() {
    window.addEventListener('resize', resizeCanvas);

    document.getElementById('btnTetrahedron').addEventListener('click', () => switchShape('tetrahedron'));
    document.getElementById('btnHexahedron').addEventListener('click', () => switchShape('hexahedron'));
    document.getElementById('btnOctahedron').addEventListener('click', () => switchShape('octahedron'));
    document.getElementById('btnIcosahedron').addEventListener('click', () => switchShape('icosahedron'));
    document.getElementById('btnDodecahedron').addEventListener('click', () => switchShape('dodecahedron'));

    document.getElementById('btnPerspective').addEventListener('click', () => switchProjection(ProjectionType.PERSPECTIVE));
    document.getElementById('btnAxonometric').addEventListener('click', () => switchProjection(ProjectionType.AXONOMETRIC));

    document.getElementById('btnTranslate').addEventListener('click', handleTranslate);
    document.getElementById('btnRotate').addEventListener('click', handleRotate);
    document.getElementById('btnScale').addEventListener('click', handleScale);

    document.getElementById('btnReset').addEventListener('click', reset);
}

function switchShape(shape) {
    currentShape = shape;
    loadPolyhedron(shape);

    document.querySelectorAll('.shape-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn${capitalizeFirst(shape)}`).classList.add('active');
}

function loadPolyhedron(shape) {
    switch (shape) {
        case 'tetrahedron':
            currentPolyhedron = createTetrahedron(240);
            break;
        case 'hexahedron':
            currentPolyhedron = createHexahedron(240);
            break;
        case 'octahedron':
            currentPolyhedron = createOctahedron(240);
            break;
        case 'icosahedron':
            currentPolyhedron = createIcosahedron(200);
            break;
        case 'dodecahedron':
            currentPolyhedron = createDodecahedron(160);
            break;
    }

    updateInfo();
    render();
}

function switchProjection(type) {
    currentProjection.setType(type);

    document.querySelectorAll('.projection-btn').forEach(btn => btn.classList.remove('active'));
    if (type === ProjectionType.PERSPECTIVE) {
        document.getElementById('btnPerspective').classList.add('active');
    } else {
        document.getElementById('btnAxonometric').classList.add('active');
    }

    render();
}

function handleTranslate() {
    const dx = parseFloat(document.getElementById('translateX').value) || 0;
    const dy = parseFloat(document.getElementById('translateY').value) || 0;
    const dz = parseFloat(document.getElementById('translateZ').value) || 0;

    const matrix = createTranslationMatrix(dx, dy, dz);
    currentPolyhedron.applyTransformation(matrix);
    render();
}

function handleRotate() {
    const angleX = parseFloat(document.getElementById('rotateX').value) || 0;
    const angleY = parseFloat(document.getElementById('rotateY').value) || 0;
    const angleZ = parseFloat(document.getElementById('rotateZ').value) || 0;

    let matrix = createIdentityMatrix();
    if (angleX !== 0) matrix = multiplyMatrices4(matrix, createRotationXMatrix(angleX));
    if (angleY !== 0) matrix = multiplyMatrices4(matrix, createRotationYMatrix(angleY));
    if (angleZ !== 0) matrix = multiplyMatrices4(matrix, createRotationZMatrix(angleZ));

    currentPolyhedron.applyTransformation(matrix);
    render();
}

function handleScale() {
    const sx = parseFloat(document.getElementById('scaleX').value) || 1;
    const sy = parseFloat(document.getElementById('scaleY').value) || 1;
    const sz = parseFloat(document.getElementById('scaleZ').value) || 1;

    const matrix = createScaleMatrix(sx, sy, sz);

    currentPolyhedron.applyTransformation(matrix);
    render();
}

function reset() {
    loadPolyhedron(currentShape);
}

function render() {
    if (!currentPolyhedron) return;

    drawPolyhedron(ctx, currentPolyhedron, currentProjection, canvas.width, canvas.height, {
        drawFaces: true,
        drawEdges: true,
        drawVertices: true,
        fillFaces: true,
        wireframeColor: '#00d4ff',
        faceColor: 'rgba(100, 150, 255, 0.2)',
        vertexColor: '#00ff88',
        edgeWidth: 2,
        vertexRadius: 4
    });

    drawAxes(ctx, currentProjection, canvas.width, canvas.height, 100);
}

function updateInfo() {
    if (!currentPolyhedron) return;

    const vertexCount = currentPolyhedron.vertices.length;
    const edgeCount = currentPolyhedron.getEdges().length;
    const faceCount = currentPolyhedron.faces.length;

    document.getElementById('vertexCount').textContent = vertexCount;
    document.getElementById('edgeCount').textContent = edgeCount;
    document.getElementById('faceCount').textContent = faceCount;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

init();