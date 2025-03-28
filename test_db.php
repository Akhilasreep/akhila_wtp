<?php
$conn = new mysqli("localhost", "root", "", "page_turners");
if ($conn->connect_error) {
    die("❌ Database Connection Failed: " . $conn->connect_error);
} else {
    echo "✅ Database Connected Successfully!";
}
?>
