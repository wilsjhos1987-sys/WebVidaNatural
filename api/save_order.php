<?php
header('Content-Type: application/json');
require_once 'config.php';

// Obtener datos del cuerpo de la solicitud (JSON)
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

try {
    // Iniciar transacción para asegurar integridad
    $pdo->beginTransaction();

    // 1. Insertar el pedido principal
    $stmt = $pdo->prepare("INSERT INTO orders (total_amount) VALUES (:total)");
    $stmt->execute([':total' => $data['total']]);
    $orderId = $pdo->lastInsertId();

    // 2. Insertar los items del pedido
    $stmtItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (:order_id, :product_id, :name, :qty, :price)");

    foreach ($data['items'] as $item) {
        $stmtItem->execute([
            ':order_id' => $orderId,
            ':product_id' => $item['id'],
            ':name' => $item['name'],
            ':qty' => $item['quantity'],
            ':price' => $item['price']
        ]);
    }

    // Confirmar transacción
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Pedido guardado correctamente',
        'order_id' => $orderId
    ]);

} catch (Exception $e) {
    // Revertir cambios si hay error
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el pedido: ' . $e->getMessage()]);
}
?>