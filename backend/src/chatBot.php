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
    "electronics" => [
        "electronics",
        "gadgets",
        "devices",
        "tech",
        "appliances",
        "smartphones",
        "laptops",
        "tablets",
        "headphones",
        "smartwatches",
        "tv",
        "camera",
        "speakers",
        "gaming consoles",
        "wearables",
        "power banks",
        "chargers",
        "keyboards",
        "mice",
        "monitors",
        "printers",
        "scanners",
        "smart home",
        "drones",
        "bluetooth devices",
        "projectors",
        "usb devices",
        "audio equipment",
        "routers",
        "virtual reality",
        "smart lighting",
        "fitness trackers"
    ],
    "apparel" => [
        "clothing",
        "apparel",
        "fashion",
        "wear",
        "shirts",
        "pants",
        "dresses",
        "jackets",
        "suits",
        "skirts",
        "t-shirts",
        "sweaters",
        "jeans",
        "blouses",
        "sweatshirts",
        "formal wear",
        "activewear",
        "underwear",
        "shoes",
        "sneakers",
        "boots",
        "heels",
        "accessories",
        "hats",
        "scarves",
        "gloves",
        "belts",
        "watches",
        "jewelry",
        "handbags",
        "backpacks",
        "eyewear",
        "purses",
        "outerwear"
    ],
    "sports" => [
        "sports",
        "fitness",
        "gear",
        "equipment",
        "workout",
        "exercise",
        "outdoor",
        "camping",
        "hiking",
        "biking",
        "running",
        "swimming",
        "yoga",
        "sportswear",
        "accessories",
        "dumbbells",
        "weights",
        "treadmills",
        "cycling",
        "tennis",
        "badminton",
        "cricket",
        "football",
        "basketball",
        "sports shoes",
        "training equipment",
        "athletics",
        "fishing gear",
        "water sports",
        "climbing",
        "sports bags",
        "sports mats"
    ],
    "game" => [
        "toys",
        "games",
        "action figures",
        "board games",
        "puzzles",
        "collectibles",
        "figurines",
        "games for kids",
        "video games",
        "gaming accessories",
        "dolls",
        "educational toys",
        "building blocks",
        "figure",
        "RC cars",
        "role-playing games",
        "card games",
        "strategy games",
        "jigsaw puzzles",
        "learning games",
        "gaming consoles",
        "playsets",
        "craft kits",
        "plush toys",
        "stuffed animals",
        "construction sets",
        "science kits",
        "arcade games",
        "model kits"
    ],
    "beauty" => [
        "beauty",
        "cosmetics",
        "skincare",
        "makeup",
        "haircare",
        "fragrance",
        "shampoo",
        "conditioner",
        "serums",
        "lotions",
        "nail care",
        "face masks",
        "sun care",
        "deodorant",
        "hair styling",
        "eyeshadow",
        "lipstick",
        "foundation",
        "concealer",
        "mascara",
        "eyeliner",
        "blush",
        "bronzer",
        "highlighter",
        "makeup brushes",
        "beauty tools",
        "perfumes",
        "body sprays",
        "essential oils",
        "organic beauty",
        "anti-aging products"
    ],
    "home" => [
        "furniture",
        "home decor",
        "bedding",
        "cushions",
        "lighting",
        "curtains",
        "art",
        "wall decor",
        "vases",
        "mirrors",
        "rugs",
        "storage",
        "clocks",
        "kitchenware",
        "pillow",
        "mug",
        "tableware",
        "cookware",
        "cutlery",
        "appliances",
        "lamps",
        "sofas",
        "dining sets",
        "beds",
        "wardrobes",
        "bookshelves",
        "garden decor",
        "planters",
        "candles",
        "blankets",
        "towels",
        "tablecloths",
        "home",
        "living"
    ],
    "health" => [
        "health",
        "wellness",
        "fitness",
        "nutrition",
        "supplements",
        "vitamins",
        "organic",
        "herbal",
        "meditation",
        "spa",
        "yoga",
        "personal care",
        "stress relief",
        "wellbeing",
        "massage therapy",
        "protein powders",
        "energy bars",
        "first aid",
        "health monitors",
        "blood pressure monitors",
        "thermometers",
        "essential oils",
        "aromatherapy",
        "immune boosters",
        "pain relief",
        "medical supplies",
        "fitness bands",
        "rehabilitation",
        "dental care",
        "oral hygiene",
        "hygiene products"
    ],
    "travel" => [
        "luggage",
        "bags",
        "travel",
        "backpacks",
        "suitcases",
        "travel accessories",
        "carry-on",
        "duffle bags",
        "tote bags",
        "passport holders",
        "travel pillows",
        "luggage sets",
        "rolling bags",
        "packing organizers",
        "travel kits",
        "travel gadgets",
        "adventure gear",
        "camping equipment",
        "travel journals",
        "portable chargers",
        "power banks",
        "travel adapters",
        "weekend bags",
        "trekking gear",
        "travel clothing",
        "portable coolers",
        "beach bags",
        "travel blankets"
    ],
    "baby" => [
        "baby",
        "kids",
        "toys",
        "clothing",
        "nursery",
        "strollers",
        "baby care",
        "childrenswear",
        "playpens",
        "diapers",
        "baby accessories",
        "kids books",
        "educational games",
        "baby toys",
        "baby feeding",
        "bibs",
        "baby bottles",
        "pacifiers",
        "high chairs",
        "cribs",
        "baby monitors",
        "baby walkers",
        "baby carriers",
        "bath toys",
        "baby bath",
        "baby skincare",
        "soft toys",
        "swaddles",
        "baby blankets",
        "baby safety",
        "teething toys"
    ],
    "books" => [
        "books",
        "novels",
        "literature",
        "comics",
        "magazines",
        "e-books",
        "audiobooks",
        "children's books",
        "textbooks",
        "cookbooks",
        "self-help",
        "fiction",
        "non-fiction",
        "biographies",
        "poetry",
        "graphic novels",
        "history books",
        "science books",
        "travel guides",
        "reference books",
        "study materials",
        "business books",
        "romance novels",
        "thrillers",
        "fantasy books",
        "mystery novels",
        "classic literature",
        "how-to guides",
        "parenting books",
        "career guides",
        "health books"
    ]
];


$faq = [
    "how to order" => [
        "keywords" => ["how to order", "order process", "place an order", "buy product", "make a purchase", "orders", "ordering guide", "purchase steps", "checkout process"],
        "response" => "To order a product, browse through our catalog, add items to your cart, and proceed to checkout. You can also create an account for faster checkouts in the future."
    ],
    "payment methods" => [
        "keywords" => ["payment methods", "how to pay", "payment options", "pay for product", "available payments", "credit card", "paypal", "debit card", "online banking"],
        "response" => "We accept all major credit cards, PayPal, online banking, and digital wallets. At checkout, you'll see the full list of available payment options."
    ],
    "return policy" => [
        "keywords" => ["return policy", "return items", "return product", "refund", "return process", "exchange", "product return", "refund policy", "return conditions"],
        "response" => "Our return policy allows you to return products within 30 days of purchase. To initiate a return, visit the Returns section on your account or contact customer support."
    ],
    "shipping" => [
        "keywords" => ["shipping", "delivery time", "shipping time", "how long to ship", "delivery details", "shipping cost", "international shipping", "shipping policy"],
        "response" => "Shipping times vary by location. Typically, orders arrive within 3-7 business days. You can check the estimated delivery date during checkout. International shipping may take longer."
    ],
    "customer support" => [
        "keywords" => ["customer support", "contact support", "help", "how to contact", "support team", "contact us", "get help", "assistance", "chat support"],
        "response" => "You can reach our customer support team via the Contact Us page, email, or live chat. We're here to help with any issues or inquiries."
    ],
    "order tracking" => [
        "keywords" => ["track order", "order tracking", "track shipment", "where is my order", "shipping status", "order status"],
        "response" => "To track your order, go to the Order Tracking section on our website, and enter your order number and email address."
    ],
    "account creation" => [
        "keywords" => ["create account", "sign up", "register account", "new account", "how to sign up", "open account"],
        "response" => "To create an account, click on Sign Up at the top of our website, fill in the required details, and verify your email address."
    ],
    "cancellations" => [
        "keywords" => ["cancel order", "order cancellation", "how to cancel", "cancel purchase", "stop order"],
        "response" => "To cancel an order, go to your Orders section, select the order you want to cancel, and click Cancel Order. Cancellations can only be made before the order is shipped."
    ],
    "discounts and offers" => [
        "keywords" => ["discounts", "offers", "promotions", "sales", "promo codes", "coupons", "deals", "discount"],
        "response" => "TrendHaven offers a 10% discount on your first purchase! Enjoy shopping with us and take advantage of this special offer."
    ],
    "gift cards" => [
        "keywords" => ["gift cards", "purchase gift card", "how to buy gift card", "gift card use", "gift card balance"],
        "response" => "You can purchase gift cards from our Gift Cards section. To redeem, enter the gift card code at checkout. You can also check your gift card balance in your account."
    ],
    "product availability" => [
        "keywords" => ["product availability", "in stock", "out of stock", "when back in stock", "check product stock"],
        "response" => "If a product is out of stock, you can sign up for notifications on the product page to get an update when it becomes available."
    ],
    "security and privacy" => [
        "keywords" => ["security", "privacy", "data protection", "secure payments", "privacy policy", "how secure is my data"],
        "response" => "We take your privacy and security seriously. All transactions are encrypted, and your data is stored securely. Refer to our Privacy Policy for more details."
    ],
    "newsletter subscription" => [
        "keywords" => ["subscribe newsletter", "get updates", "sign up for newsletter", "email updates", "newsletter"],
        "response" => "Subscribe to our newsletter to receive the latest updates, offers, and news. You can sign up using the form at the bottom of our homepage."
    ],
    "technical issues" => [
        "keywords" => ["technical issues", "website error", "cannot log in", "site problem", "technical support"],
        "response" => "If you face technical issues, please contact our technical support team via the Contact Us page or live chat. We're here to help resolve the issue."
    ],
    "goodjob" => [
        "keywords" => ["good job", "great work", "well done", "awesome", "amazing", "excellent", "fantastic", "superb", "impressive", "bravo", "good job", "good"],
        "response" => "Thank you! I'm here to assist you with any questions or requests you have. Feel free to ask me anything!"
    ],
    [
        "keywords" => ["thank you", "thanks", "appreciate", "thank you bot", "thanks bot", "thank you chatbot", "thanks chatbot", "thank you for help", "thanks for help"],
        "response" => "You're welcome! If you need any further assistance, feel free to ask. I'm here to help!"
    ]
];


$greetings = [
    "hello" => "Hello! How can I assist you today?",
    "hey" => "Hey! How can I help you?",
    "name" => "Hello there! My name is TrendBuddy. I'm here to help.",
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
    "hi" => "Hi there! What can I do for you?",
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
    "no" => "Okay then!"

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
usleep(400000);

$response_message = getResponse($input_message, $greetings, $faq, $product_keywords, $conn);

echo $response_message;
