<?php
// accommodations.php
// ======= DEBUG CONFIGURATION =======
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

// 1) connection
require_once 'database.php'; // make sure this path is correct

// 2) Helper to read JSON body
function getJsonBody() {
  $raw = file_get_contents('php://input');
  return json_decode($raw, true);
}

// 3) Read method & optional ID
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

try {
  switch($method) {
    case 'GET':
      // ... same as before ...
      break;

    case 'POST':
      // create new — including all fields
      $data = getJsonBody();
      $sql = "INSERT INTO accommodations
        (user_id, title, type, address, price,
         parking, wifi, air_conditioning, balcony,
         reservation_mode, description)
       VALUES
        (:user_id, :title, :type, :address, :price,
         :parking, :wifi, :air_conditioning, :balcony,
         :reservation_mode, :description)";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([
        ':user_id'          => $data['user_id']          ?? null,
        ':title'            => $data['title']            ?? '',
        ':type'             => $data['type']             ?? 'other',
        ':address'          => $data['address']          ?? '',
        ':price'            => $data['price']            ?? 0,
        ':parking'          => !empty($data['parking'])          ? 1 : 0,
        ':wifi'             => !empty($data['wifi'])             ? 1 : 0,
        ':air_conditioning' => !empty($data['air_conditioning']) ? 1 : 0,
        ':balcony'          => !empty($data['balcony'])          ? 1 : 0,
        ':reservation_mode' => $data['reservation_mode'] ?? 'confirmation',
        ':description'      => $data['description']      ?? null,
      ]);
      http_response_code(201);
      echo json_encode(['ID' => (int)$pdo->lastInsertId()]);
      break;

    // PUT / DELETE blocks...

    default:
      http_response_code(405);
      header('Allow: GET, POST, PUT');
      echo json_encode(['error'=>'Method not allowed']);
      break;
  }
} catch (Exception $e) {
  http_response_code(500);
  // dump the actual PHP exception message to JSON
  echo json_encode(['error'=>'Server error', 'message'=>$e->getMessage()]);
}
