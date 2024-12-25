<?php
if (isset($_POST['btnsubmit'])) {
    $chkpro = $_POST['chkpro'] ? $_POST['chkpro'] : '';
    foreach ($chkpro as $value) {
        echo "You selected " . $value . "<br>";
    }
    $gender = $_POST['gender'] ? $_POST['gender'] : '';
    $password = $_POST['password'] ? $_POST['password'] : '';
    echo "Your gender is " . $gender . "<br>";
    echo "Your password is " . $password . "<br>";
    $food = $_POST['food'] ? $_POST['food'] : '';
    echo "Your food is " . $food . "<br>";
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        form {
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            margin: auto;
        }

        label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
        }

        input[type="text"],
        input[type="password"],
        select {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        input[type="checkbox"],
        input[type="radio"] {
            margin-right: 10px;
        }

        input[type="submit"],
        input[type="reset"] {
            background-color: #5cb85c;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }

        input[type="submit"]:hover,
        input[type="reset"]:hover {
            background-color: #4cae4c;
        }

        h2 {
            text-align: center;
            color: #333;
        }
    </style>
</head>

<body>
    <h2>Registration Form</h2>
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
        <label>Choose your program</label>
        <input type="checkbox" name="chkpro[]" value="foundation">Foundation<br>
        <input type="checkbox" name="chkpro[]" value="hnc">HNC<br>
        <input type="checkbox" name="chkpro[]" value="hnd">HND<br>

        <label>Password: </label>
        <input type="password" name="password"><br>

        <label>Gender</label>
        <input type="radio" name="gender" value="male">Male<br>
        <input type="radio" name="gender" value="female">Female<br>
        <input type="radio" name="gender" value="other">Other<br>

        <label>Select your food</label>
        <select name="food">
            <option value="pizza">Pizza</option>
            <option value="burger">Burger</option>
            <option value="french fried">French Fried</option>
        </select>

        <input type="submit" name="btnsubmit" value="Register">
        <input type="reset" value="Clear">
    </form>
</body>

</html>