<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

$eData = file_get_contents('php://input');
include 'dbconnect.php';
$db = new dbconnect;

$conn = $db->connect();

$data = json_decode($eData);
$input_message = strtolower(trim($data->message));

$product_keywords = [
    "electronics" => ["electronics", "gadgets", "devices", "tech", "appliances", "smartphones", "laptops", "tablets", "headphones", "smartwatches", "tv", "camera", "speakers", "gaming consoles", "wearables"],
    "fashion" => ["clothing", "apparel", "fashion", "wear", "shirts", "pants", "dresses", "jackets", "suits", "skirts", "t-shirts", "sweaters", "jeans", "blouses", "sweatshirts"],
    "sports" => ["sports", "fitness", "gear", "equipment", "workout", "exercise", "outdoor", "camping", "hiking", "biking", "running", "swimming", "yoga", "sportswear", "accessories"],
    "game" => ["toys", "games", "action figures", "board games", "puzzles", "collectibles", "figurines", "games for kids", "video games", "gaming accessories", "dolls", "educational toys", "building blocks", "figure"],
    "beauty" => ["beauty", "cosmetics", "skincare", "makeup", "haircare", "fragrance", "shampoo", "conditioner", "serums", "lotions", "nail care", "face masks", "sun care", "deodorant", "hair styling"],
    "home" => ["furniture", "home decor", "bedding", "cushions", "lighting", "curtains", "art", "wall decor", "vases", "mirrors", "rugs", "storage", "clocks", "kitchenware"],
    "health" => ["health", "wellness", "fitness", "nutrition", "supplements", "vitamins", "organic", "herbal", "meditation", "spa", "yoga", "personal care", "stress relief", "wellbeing", "massage therapy"],
    "travel" => ["luggage", "bags", "travel", "backpacks", "suitcases", "travel accessories", "carry-on", "duffle bags", "tote bags", "passport holders", "travel pillows", "luggage sets", "rolling bags"],
    "baby" => ["baby", "kids", "toys", "clothing", "nursery", "strollers", "baby care", "childrenswear", "playpens", "diapers", "baby accessories", "kids books", "educational games", "baby toys", "baby feeding"],
    "books" => ["books", "novels", "literature", "comics", "magazines", "e-books", "audiobooks", "children's books", "textbooks", "cookbooks", "self-help", "fiction", "non-fiction", "biographies"]
];

$faq = [
    "how to order" => [
        "keywords" => ["how to order", "order process", "place an order", "buy product", "make a purchase", "orders"],
        "response" => "To order a product, browse through our catalog, add items to your cart, and proceed to checkout."
    ],
    "payment methods" => [
        "keywords" => ["payment methods", "how to pay", "payment options", "pay for product"],
        "response" => "We accept all major credit cards, PayPal, and online banking options."
    ],
    "return policy" => [
        "keywords" => ["return policy", "return items", "return product", "refund", "return process"],
        "response" => "Our return policy allows you to return products within 30 days of purchase."
    ],
    "shipping" => [
        "keywords" => ["shipping", "delivery time", "shipping time", "how long to ship", "delivery details"],
        "response" => "Shipping times vary by location. Typically, orders arrive within 3-7 business days."
    ],
    "customer support" => [
        "keywords" => ["customer support", "contact support", "help", "how to contact", "support team"],
        "response" => "You can reach our customer support team via the Contact Us page."
    ]
];

$greetings = [
    "hello" => "Hello! How can I assist you today?",
    "hi" => "Hi there! What can I do for you?",
    "hey" => "Hey! How can I help you?",
    "good morning" => "Good morning! What can I assist you with?",
    "good afternoon" => "Good afternoon! How can I help you today?",
    "good evening" => "Good evening! How can I assist you?",
    "how are you" => "I'm just a bot, but I'm here to help you with your questions!",
    "what's up" => "Not much, just here to assist you! What do you need help with?",
    "yo" => "Yo! How can I assist you today?",
    "hiya" => "Hiya! What can I do for you?",
    "greetings" => "Greetings! How can I help you today?",
    "howdy" => "Howdy! What can I assist you with?",
    "what's good" => "Everything's great! How can I help you?",
    "what's new" => "Not much, just ready to help! What can I do for you?",
    "long time no see" => "It’s been a while! How can I assist you?",
    "sup" => "Not much, just here to help. What's up with you?",
    "hello there" => "Hello there! How can I assist you today?",
    "hi there" => "Hi there! What do you need help with?",
    "hey there" => "Hey there! How can I help you today?",
    "good day" => "Good day! What can I assist you with?",
    "how are you doing" => "I'm just a bot, but I'm here to assist you! How can I help?",
    "how's it going" => "It's going great! How can I help you today?",
    "bot" => "Yes, I'm here! How can I assist you?",
    "help" => "I'm here to help! What can I do for you?",
    "bye" => "Good Bye! Thank you for chatting with me.",
];


function getRecommendations($conn, $category)
{
    $sql = "SELECT * FROM products WHERE category LIKE :category OR productName LIKE :category  ORDER BY RAND() LIMIT 3";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':category', "%$category%", PDO::PARAM_STR);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getResponse($input_message, $greetings, $faq, $product_keywords, $conn)
{
    foreach ($greetings as $key => $response) {
        if (strpos($input_message, $key) !== false) {
            return json_encode(['message' => $response]);
        }
    }

    foreach ($faq as $faq_item) {
        foreach ($faq_item['keywords'] as $keyword) {
            if (strpos($input_message, $keyword) !== false) {
                return json_encode(['message' => $faq_item['response']]);
            }
        }
    }

    foreach ($product_keywords as $category => $keywords) {
        foreach ($keywords as $keyword) {
            if (strpos($input_message, $keyword) !== false) {
                $products = getRecommendations($conn, $category);
                if (!empty($products)) {
                    $recommendations = [];
                    foreach ($products as $product) {
                        $recommendations[] = [
                            'id' => $product['id'],
                            'name' => $product['productName'],
                            'description' => $product['description'],
                            'price' => $product['price'],
                            'image' => $product['image']
                        ];
                    }
                    return json_encode([
                        'message' => "Here are some $category recommendations for you:",
                        'products' => $recommendations
                    ]);
                } else {
                    return json_encode(['message' => "Sorry, we couldn't find any products related to '$category'."]);
                }
            }
        }
    }

    return json_encode(['message' => "I'm sorry, I don't understand that. Can you ask again?"]);
}

$response_message = getResponse($input_message, $greetings, $faq, $product_keywords, $conn);

echo $response_message;
