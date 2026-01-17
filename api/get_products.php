<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    // Preparar y ejecutar la consulta
    $stmt = $pdo->query("SELECT * FROM products");
    $products = $stmt->fetchAll();

    // Decodificar el campo badges de string JSON a array PHP para que el frontend reciba array
    // Aunque mysql driver mysqlnd puede hacerlo automatico, es seguro hacerlo explicitamente o dejarlo como string
    // y que JS lo parsee. Sin embargo, fetchAll devuelve el JSON como string.
    // Vamos a recorrer y decodificar badges

    foreach ($products as &$product) {
        if (isset($product['badges'])) {
            $product['badges'] = json_decode($product['badges']);
        }
        // Asegurarse de que price sea número, no string
        $product['price'] = (float) $product['price'];
    }

    echo json_encode($products);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>