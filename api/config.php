<?php
// Configuración de la base de datos
$host = 'localhost';
$db   = 'vidanatural';
$user = 'root';
$pass = ''; // Contraseña por defecto en XAMPP suele ser vacía
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // En producción, no mostrar el error real al usuario
    die("Error de conexión: " . $e->getMessage());
}
?>
