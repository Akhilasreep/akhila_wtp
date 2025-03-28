<?php
$servername = "localhost";
$username = "root"; // Default for WAMP
$password = ""; // No password by default
$dbname = "page_turners";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
