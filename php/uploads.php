<?php
header('Content-Type: application/json');

// Configurações do banco
$host = "localhost";
$user = "root";
$pass = "";
$db = "sperotto_conecta";

// Conexão
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["status"=>"error","msg"=>"Falha na conexão"]);
    exit;
}

// Verifica se o arquivo e setor foram enviados
if(!isset($_FILES['imagem']) || !isset($_POST['setor'])){
    echo json_encode(["status"=>"error","msg"=>"Parâmetros ausentes"]);
    exit;
}

$setor = $_POST['setor'];
$arquivo = $_FILES['imagem'];

// Pasta de uploads
$dirUploads = "uploads/";
if(!is_dir($dirUploads)){
    mkdir($dirUploads, 0777, true);
}

// Nome único para a imagem
$nomeArquivo = time() . "_" . basename($arquivo['name']);
$caminhoFinal = $dirUploads . $nomeArquivo;

// Move arquivo para a pasta uploads
if(move_uploaded_file($arquivo['tmp_name'], $caminhoFinal)){
    // Insere no banco
    $stmt = $conn->prepare("INSERT INTO tv_cards (setor, image_path) VALUES (?, ?)");
    $stmt->bind_param("ss", $setor, $caminhoFinal);
    if($stmt->execute()){
        echo json_encode([
            "status" => "ok",
            "path" => $caminhoFinal,
            "id" => $stmt->insert_id
        ]);
    } else {
        echo json_encode(["status"=>"error","msg"=>"Erro ao salvar no banco"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status"=>"error","msg"=>"Erro ao mover arquivo"]);
}

$conn->close();
?>