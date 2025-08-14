<?php
header('Content-Type: application/json');

// Configurações do banco
$host = "localhost";
$user = "root";
$pass = "";
$db = "sperotto_conecta";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["status"=>"error","msg"=>"Falha na conexão"]);
    exit;
}

if(!isset($_POST['id'])){
    echo json_encode(["status"=>"error","msg"=>"ID não informado"]);
    exit;
}

$id = $_POST['id'];

// Busca o caminho do arquivo antes de deletar
$stmt = $conn->prepare("SELECT image_path FROM tv_cards WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
if($row = $result->fetch_assoc()){
    $caminho = $row['image_path'];
    if(file_exists($caminho)){
        unlink($caminho); // apaga do disco
    }
}

// Deleta do banco
$stmt = $conn->prepare("DELETE FROM tv_cards WHERE id = ?");
$stmt->bind_param("i", $id);
if($stmt->execute()){
    echo json_encode(["status"=>"ok"]);
}else{
    echo json_encode(["status"=>"error","msg"=>"Erro ao deletar do banco"]);
}

$stmt->close();
$conn->close();
?>