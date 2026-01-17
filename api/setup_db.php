<?php
// Script para configuración automática de la base de datos
header('Content-Type: text/html; charset=utf-8');

$host = 'localhost';
$root_user = 'root';
$root_pass = ''; // Por defecto en XAMPP

try {
    // 1. Conectar al servidor MySQL sin seleccionar base de datos
    $pdo = new PDO("mysql:host=$host", $root_user, $root_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Iniciando configuración de la base de datos...</h2>";
    
    // 2. Crear base de datos
    $pdo->exec("CREATE DATABASE IF NOT EXISTS vidanatural CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "<p>✅ Base de datos 'vidanatural' verificada/creada.</p>";
    
    // 3. Seleccionar la base de datos
    $pdo->exec("USE vidanatural");
    
    // 4. Leer el archivo SQL
    $sqlFile = '../database.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("No se encuentra el archivo database.sql en la ruta ../database.sql");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // 5. Ejecutar consultas
    // PDO no permite ejecutar múltiples declaraciones en una sola llamada a exec() de forma robusta en todas las configuraciones,
    // pero para este script simple intentaremos dividirlo o ejecutarlo directo si la configuración lo permite.
    // Una mejor opción es dividir por ; pero cuidado con los ; dentro de strings.
    // Dado que database.sql es simple, usaremos un enfoque básico.
    
    $statements = array_filter(array_map('trim', explode(';', $sql)));

    foreach ($statements as $stmt) {
        if (!empty($stmt)) {
            $pdo->exec($stmt);
        }
    }
    
    echo "<p>✅ Tablas y datos creados exitosamente.</p>";
    echo "<h3>¡Configuración completada!</h3>";
    echo "<p>Ahora puedes volver a la <a href='../index.html'>página principal</a> y recargar.</p>";

} catch (PDOException $e) {
    die("<h3 style='color:red'>Error de Base de Datos:</h3> " . $e->getMessage() . "<br>Verifique que XAMPP (MySQL) esté corriendo.");
} catch (Exception $e) {
    die("<h3 style='color:red'>Error General:</h3> " . $e->getMessage());
}
?>
