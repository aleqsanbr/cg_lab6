//
// Генерация правильных многогранников
//

function createTetrahedron(size = 100) {
    const a = size;
    const h = a * Math.sqrt(2 / 3); // высота тетраэдра
    
    const vertices = [
        new Point3D(0, h * 2/3, 0),                      // вершина
        new Point3D(-a/2, -h/3, a * Math.sqrt(3) / 6),  // основание
        new Point3D(a/2, -h/3, a * Math.sqrt(3) / 6),   // основание
        new Point3D(0, -h/3, -a * Math.sqrt(3) / 3)     // основание
    ];
    
    const faces = [
        new Face([0, 1, 2]), // передняя грань
        new Face([0, 2, 3]), // правая грань
        new Face([0, 3, 1]), // левая грань
        new Face([1, 3, 2])  // основание
    ];
    
    return new Polyhedron(vertices, faces);
}

function createHexahedron(size = 100) {
    const s = size / 2;
    
    const vertices = [
        new Point3D(-s, -s, -s), // 0
        new Point3D(s, -s, -s),  // 1
        new Point3D(s, s, -s),   // 2
        new Point3D(-s, s, -s),  // 3
        new Point3D(-s, -s, s),  // 4
        new Point3D(s, -s, s),   // 5
        new Point3D(s, s, s),    // 6
        new Point3D(-s, s, s)    // 7
    ];
    
    const faces = [
        new Face([0, 1, 2, 3]), // задняя грань
        new Face([4, 5, 6, 7]), // передняя грань
        new Face([0, 1, 5, 4]), // нижняя грань
        new Face([2, 3, 7, 6]), // верхняя грань
        new Face([0, 3, 7, 4]), // левая грань
        new Face([1, 2, 6, 5])  // правая грань
    ];
    
    return new Polyhedron(vertices, faces);
}

function createOctahedron(size = 100) {
    const s = size / Math.sqrt(2);
    
    const vertices = [
        new Point3D(0, s, 0),   // верхняя вершина
        new Point3D(-s, 0, 0),  // левая
        new Point3D(0, 0, s),   // передняя
        new Point3D(s, 0, 0),   // правая
        new Point3D(0, 0, -s),  // задняя
        new Point3D(0, -s, 0)   // нижняя вершина
    ];
    
    const faces = [
        // Верхние грани
        new Face([0, 2, 1]),
        new Face([0, 3, 2]),
        new Face([0, 4, 3]),
        new Face([0, 1, 4]),
        // Нижние грани
        new Face([5, 1, 2]),
        new Face([5, 2, 3]),
        new Face([5, 3, 4]),
        new Face([5, 4, 1])
    ];
    
    return new Polyhedron(vertices, faces);
}

function createIcosahedron(size = 100) {
    const phi = (1 + Math.sqrt(5)) / 2; // золотое сечение
    const a = size / (2 * Math.sin(2 * Math.PI / 5));
    const b = a / phi;
    
    const vertices = [
        new Point3D(0, b, a),
        new Point3D(b, a, 0),
        new Point3D(-b, a, 0),
        new Point3D(0, b, -a),
        new Point3D(0, -b, a),
        new Point3D(-a, 0, b),
        new Point3D(0, -b, -a),
        new Point3D(a, 0, -b),
        new Point3D(a, 0, b),
        new Point3D(-a, 0, -b),
        new Point3D(b, -a, 0),
        new Point3D(-b, -a, 0)
    ];
    
    const faces = [
        new Face([0, 1, 2]),
        new Face([1, 0, 8]),
        new Face([2, 1, 3]),
        new Face([3, 1, 7]),
        new Face([8, 0, 4]),
        new Face([0, 2, 5]),
        new Face([4, 0, 5]),
        new Face([7, 1, 8]),
        new Face([10, 8, 4]),
        new Face([11, 4, 5]),
        new Face([6, 7, 10]),
        new Face([9, 3, 6]),
        new Face([2, 3, 9]),
        new Face([5, 2, 9]),
        new Face([11, 5, 9]),
        new Face([10, 7, 8]),
        new Face([6, 3, 7]),
        new Face([9, 6, 11]),
        new Face([11, 6, 10]),
        new Face([4, 11, 10])
    ];
    
    return new Polyhedron(vertices, faces);
}

function createDodecahedron(size = 100) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const a = size / 2;
    const b = a / phi;
    const c = a * phi;
    
    const vertices = [
        new Point3D(a, a, a),
        new Point3D(a, a, -a),
        new Point3D(a, -a, a),
        new Point3D(a, -a, -a),
        new Point3D(-a, a, a),
        new Point3D(-a, a, -a),
        new Point3D(-a, -a, a),
        new Point3D(-a, -a, -a),
        new Point3D(0, b, c),
        new Point3D(0, b, -c),
        new Point3D(0, -b, c),
        new Point3D(0, -b, -c),
        new Point3D(b, c, 0),
        new Point3D(b, -c, 0),
        new Point3D(-b, c, 0),
        new Point3D(-b, -c, 0),
        new Point3D(c, 0, b),
        new Point3D(c, 0, -b),
        new Point3D(-c, 0, b),
        new Point3D(-c, 0, -b)
    ];
    
    const faces = [
        new Face([0, 8, 10, 2, 16]),
        new Face([0, 16, 17, 1, 12]),
        new Face([0, 12, 14, 4, 8]),
        new Face([1, 9, 5, 14, 12]),
        new Face([1, 17, 3, 11, 9]),
        new Face([2, 10, 6, 15, 13]),
        new Face([2, 13, 3, 17, 16]),
        new Face([3, 13, 15, 7, 11]),
        new Face([4, 14, 5, 19, 18]),
        new Face([4, 18, 6, 10, 8]),
        new Face([5, 9, 11, 7, 19]),
        new Face([6, 18, 19, 7, 15])
    ];
    
    return new Polyhedron(vertices, faces);
}
