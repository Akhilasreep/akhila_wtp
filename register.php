<?php
// Enable CORS for cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database Connection
$servername = "localhost";
$username = "root"; // Default for WAMP
$password = ""; // No password by default
$dbname = "page_turners";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database Connection Failed: " . $conn->connect_error]));
}

// Read JSON data from request
$data = json_decode(file_get_contents("php://input"), true);
$name = $data["name"];
$collegeName = $data["collegeName"];
$phone = $data["phone"];

// Check if phone number is already registered
$checkQuery = "SELECT * FROM users WHERE phone = '$phone'";
$result = $conn->query($checkQuery);

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Phone number already registered."]);
} else {
    // Insert user into database
    $sql = "INSERT INTO users (name, college_name, phone) VALUES ('$name', '$collegeName', '$phone')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "User registered successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}

$conn->close();
?>
