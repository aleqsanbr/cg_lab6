//
// Отрисовка 3D объектов
//

function drawPolyhedron(ctx, polyhedron, projection, canvasWidth, canvasHeight, options = {}) {
    const {
        drawFaces = true,
        drawEdges = true,
        drawVertices = true,
        fillFaces = true,
        wireframeColor = '#00d4ff',
        faceColor = 'rgba(100, 150, 255, 0.3)',
        vertexColor = '#00ff88',
        edgeWidth = 2,
        vertexRadius = 4
    } = options;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const projected = projectPolyhedron(polyhedron, projection, canvasWidth, canvasHeight);

    if (drawFaces && fillFaces) {
        polyhedron.faces.forEach(face => {
            ctx.fillStyle = faceColor;
            ctx.beginPath();
            
            face.vertexIndices.forEach((vIndex, i) => {
                const p = projected.vertices[vIndex];
                if (i === 0) {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            });
            
            ctx.closePath();
            ctx.fill();
        });
    }

    if (drawEdges) {
        ctx.strokeStyle = wireframeColor;
        ctx.lineWidth = edgeWidth;

        projected.edges.forEach(([v1Index, v2Index]) => {
            const p1 = projected.vertices[v1Index];
            const p2 = projected.vertices[v2Index];

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });

        ctx.globalAlpha = 1;
    }

    if (drawVertices) {
        ctx.fillStyle = vertexColor;
        
        projected.vertices.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, vertexRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

function drawAxes(ctx, projection, canvasWidth, canvasHeight, axisLength = 150) {
    const origin = new Point3D(0, 0, 0);
    const xAxis = new Point3D(axisLength, 0, 0);
    const yAxis = new Point3D(0, axisLength, 0);
    const zAxis = new Point3D(0, 0, axisLength);

    const originProj = projection.project(origin, canvasWidth, canvasHeight);
    const xAxisProj = projection.project(xAxis, canvasWidth, canvasHeight);
    const yAxisProj = projection.project(yAxis, canvasWidth, canvasHeight);
    const zAxisProj = projection.project(zAxis, canvasWidth, canvasHeight);

    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.globalAlpha = 0.4;

    ctx.strokeStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(originProj.x, originProj.y);
    ctx.lineTo(xAxisProj.x, xAxisProj.y);
    ctx.stroke();

    ctx.strokeStyle = '#44ff44';
    ctx.beginPath();
    ctx.moveTo(originProj.x, originProj.y);
    ctx.lineTo(yAxisProj.x, yAxisProj.y);
    ctx.stroke();

    ctx.strokeStyle = '#4444ff';
    ctx.beginPath();
    ctx.moveTo(originProj.x, originProj.y);
    ctx.lineTo(zAxisProj.x, zAxisProj.y);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.globalAlpha = 0.6;
    ctx.fillText('X', xAxisProj.x + 10, xAxisProj.y);
    ctx.fillText('Y', yAxisProj.x, yAxisProj.y - 10);
    ctx.fillText('Z', zAxisProj.x, zAxisProj.y + 20);
    ctx.globalAlpha = 1;
}
