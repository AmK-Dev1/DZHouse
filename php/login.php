<?php
header('Content-Type: application/json; charset=utf-8');

// 1) connection
require_once 'database.php'; 

// 2) Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

// 3) Read JSON body
$body = json_decode(file_get_contents('php://input'), true);
$email    = $body['email']    ?? '';
$password = $body['password'] ?? '';

// 4) Basic validation
if (!$email || !$password) {
  http_response_code(400);
  echo json_encode(['error' => 'Email and password required']);
  exit;
}

// 5) Lookup user by email
$stmt = $pdo->prepare('SELECT ID, password, role FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

// 6) Check credentials (plain‐text comparison)
$inputPassword = $password;              // from the JSON body above
$storedPassword = $user['password'] ?? '';  // from the DB

if (!$user || $inputPassword !== $storedPassword) {
  http_response_code(401);
  echo json_encode(['error' => 'Invalid credentials']);
  exit;
}

// 7) Success — return user_id and role
echo json_encode([
  'user_id' => (int)$user['ID'],
  'role'    => $user['role']
]);

