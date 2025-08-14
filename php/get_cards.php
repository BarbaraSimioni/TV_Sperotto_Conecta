<?php
header('Content-Type: application/json');

// Configurações do banco
$host = "localhost";
$user = "root";
$pass = "";
$db = "sperotto_conecta";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$setor = isset($_GET['setor']) ? $_GET['setor'] : "";
$cards = [];

if($setor){
    $stmt = $conn->prepare("SELECT id, image_path FROM tv_cards WHERE setor = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $setor);
    $stmt->execute();
    $result = $stmt->get_result();
    while($row = $result->fetch_assoc()){
        $cards[] = $row;
    }
    $stmt->close();
}

$conn->close();
echo json_encode($cards);
?>