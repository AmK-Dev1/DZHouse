<?php
// API
header('Content-Type: application/json; charset=utf-8');

// 1) connection
require_once 'database.php'; 

// 2) Read method and optional id
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

// 3) JSON body
function getJsonBody() {
  $raw = file_get_contents('php://input');
  return json_decode($raw, true);
}

// 4) REST router
switch($method) {
  
  case 'GET':
    if ($id) {
      $stmt = $pdo->prepare("SELECT * FROM users WHERE ID = ?");
      $stmt->execute([$id]);
      $user = $stmt->fetch();
      if ($user) echo json_encode($user);
      else {
        http_response_code(404);
        echo json_encode(['error'=>'User not found']);
      }
    } else {
      $stmt = $pdo->query("SELECT * FROM users");
      echo json_encode($stmt->fetchAll());
    }
    break;

  case 'POST':
    $data = getJsonBody();
    $sql = "INSERT INTO users (role, first_name, last_name, phone, email, password, address, postal_code, rib, id_document, profile_photo)
            VALUES (:role,:first_name,:last_name,:phone,:email,:password,:address,:postal_code,:rib,:id_document,:profile_photo)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':role'          => $data['role'] ?? 'tenant',
      ':first_name'    => $data['first_name'] ?? '',
      ':last_name'     => $data['last_name'] ?? '',
      ':phone'         => $data['phone'] ?? null,
      ':email'         => $data['email'] ?? '',
      ':password'      => $data['password'], PASSWORD_DEFAULT,
      ':address'       => $data['address'] ?? null,
      ':postal_code'   => $data['postal_code'] ?? null,
      ':rib'           => $data['rib'] ?? null,
      ':id_document'   => $data['id_document'] ?? null,
      ':profile_photo' => $data['profile_photo'] ?? null,
    ]);
    http_response_code(201);
    echo json_encode(['ID'=>$pdo->lastInsertId()]);
    break;

}
