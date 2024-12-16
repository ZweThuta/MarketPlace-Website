<?php
$multiD = array(
    "fruits" => array("myfavourite" => "orange", "yuck" => "banana", "ym" => "apple"),
    "numbers" => array(1, 4, 5, 6, 8),
    "holes" => array("first", 5 => "second", "third")
);
echo $multiD["fruits"]["myfavourite"] . "<br>";
echo $multiD["holes"][6] . "<br>";
echo $multiD["fruits"]["yuck"] . "<br>";
echo $multiD["fruits"]["ym"] . "<br>";
var_dump($multiD);

$people = array("peter", "joe", "glem", "cleveland");
echo current($people) . "<br>";
echo next($people) . "<br>";
echo reset($people) . "<br>";
echo prev($people) . "<br>";
asort($people);
foreach ($people as $x => $value) {
    echo $x . " " . $value . "<br>";
}
echo "<br>";
arsort($people);
foreach ($people as $x => $value) {
    echo $x . " " . $value . "<br>";
}

echo "<br>";
ksort($people);
foreach ($people as $x => $value) {
    echo $x . " " . $value . "<br>";
}

echo "<br>";
krsort($people);
foreach ($people as $x => $value) {
    echo $x . " " . $value . "<br>";
}

echo "<br>";
sort($people);
foreach ($people as $x => $value) {
    echo $x . " " . $value . "<br>";
}

echo "<br>";
function my_sort($a, $b)
{
    if ($a == $b) return 0;
    return ($a < $b) ? -1 : 1;
}

$arr = array("a" => 4, "b" => 2, "c" => 8, "d" => 6);
uasort($arr, "my_sort");

foreach ($arr as $key => $value) {
    echo "[" . $key . "] => " . $value;
    echo "<br>";
}


$arr = array(5 => 1, 12 => 2);
foreach ($arr as $key => $value) {
}

echo "$key=>$value";
$arr[] = 56; // the same as $arr[13] = 56;
$arr["x"] = 42; // adds a new element 
unset($arr[5]); // removes the element
unset($arr); // deletes the whole array
$a = array(1 => 'one', 2 => 'two', 3 => 'three');
unset($a[2]);
$b = array_values($a);


 
function printRow($value, $key)
{
    printf(" <tr> 
    <td> %s </td> 
    <td> %s </td>
     </tr>\n", htmlspecialchars($key), htmlspecialchars($value));
}

$color = array('Red' => '#FF0000', 'Green' => '#00FF00', 'Blue' => '#0000FF', 'Yellow' => '#FFFF00');

 
echo "<table border='1'>\n";
echo "<tr><th>Color Name</th><th>Color Code</th></tr>\n";  

 
array_walk($color, 'printRow');
 
echo "</table>\n";

if(isset($_GET['btnSubmit']))
{
    $username=$_GET['name'];
    echo "Hello" .$username;
}

echo $_SERVER['PHP_SELF'];
echo "<br>";

echo $_SERVER['SERVER_NAME'];
echo "<br>";

echo $_SERVER['HTTP_HOST'];
echo "<br>";

echo $_SERVER['HTTP_USER_AGENT'];
echo "<br>";

echo $_SERVER['SCRIPT_NAME'];
echo "<br>";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="getMethod.php" method="get">
        <label for="title">Name</label>
        <input type="text" name="name">
        <input type="submit" name="btnSubmit">
    </form>
</body>
</html>