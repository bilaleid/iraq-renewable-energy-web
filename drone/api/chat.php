<?php
/**
 * FLYZONE HUR-UAV-01 website — Claude-powered chat widget backend.
 *
 * Receives {message, lang, history} from js/main.js, calls the Claude API
 * server-side (so the API key never reaches the browser), and returns
 * {reply}. On any failure it returns a JSON error the widget already knows
 * how to handle gracefully (falls back to "message us on WhatsApp").
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed']);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'server_not_configured']);
    exit;
}
require $configPath;

// ---------------------------------------------------------------------
// Parse & validate input
// ---------------------------------------------------------------------
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!is_array($input) || empty($input['message']) || !is_string($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_request']);
    exit;
}

$message = trim($input['message']);
if ($message === '') {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_request']);
    exit;
}
// Hard cap so a single message can't blow up cost/latency.
if (mb_strlen($message) > 1500) {
    $message = mb_substr($message, 0, 1500);
}

$lang = in_array($input['lang'] ?? '', ['ar', 'tr', 'en'], true) ? $input['lang'] : 'en';
$langNames = ['ar' => 'Arabic', 'tr' => 'Turkish', 'en' => 'English'];

// Client-supplied history is trusted only as plain text turns — the system
// prompt below is always ours, never overridable from the browser.
$history = [];
if (isset($input['history']) && is_array($input['history'])) {
    foreach (array_slice($input['history'], -10) as $turn) {
        if (!is_array($turn)) continue;
        $role = ($turn['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
        $content = isset($turn['content']) && is_string($turn['content']) ? trim($turn['content']) : '';
        if ($content === '') continue;
        $history[] = ['role' => $role, 'content' => mb_substr($content, 0, 1500)];
    }
}

// ---------------------------------------------------------------------
// Rate limiting (simple flat-file counter per IP, no database needed)
// ---------------------------------------------------------------------
function flyzone_rate_limited(string $ip): bool
{
    $dir = __DIR__ . '/.rl_data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $file = $dir . '/' . md5($ip) . '.json';

    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return false; // fail open — don't break the widget if disk I/O fails
    }
    flock($fp, LOCK_EX);

    $raw = stream_get_contents($fp);
    $timestamps = json_decode($raw, true);
    if (!is_array($timestamps)) $timestamps = [];

    $now = time();
    $windowStart = $now - RATE_LIMIT_WINDOW_SECONDS;
    $timestamps = array_values(array_filter($timestamps, fn($t) => $t > $windowStart));

    $limited = count($timestamps) >= RATE_LIMIT_MAX_REQUESTS;
    if (!$limited) {
        $timestamps[] = $now;
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($timestamps));
    }

    flock($fp, LOCK_UN);
    fclose($fp);
    return $limited;
}

$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = trim(explode(',', $ip)[0]);

if (flyzone_rate_limited($ip)) {
    http_response_code(429);
    echo json_encode(['error' => 'rate_limited']);
    exit;
}

// ---------------------------------------------------------------------
// System prompt — the product/company knowledge base and behavior rules.
// Sourced entirely from FLYZONE's official HUR-UAV-01 technical brochure.
// ---------------------------------------------------------------------
$systemPrompt = <<<PROMPT
You are the official AI assistant embedded on FLYZONE's marketing website for the HUR-UAV-01 drone. You answer visitor questions right there in the chat widget.

ABOUT FLYZONE
FLYZONE is a Turkish developer of cutting-edge drone technology, based at Zaim Teknopark, Sabahattin Zaim University, Istanbul, Türkiye. It engineers high-performance flight systems and integrated software solutions for safer, smarter, and more efficient aerial operations.

PRODUCT: HUR-UAV-01 — "Smart Navigation Beyond GPS"
An intelligent multirotor UAV platform engineered for stable, precise flight in GPS-denied or GPS-degraded environments, using a sensor-fusion architecture: optical flow + LiDAR + barometer + IMU.

KEY TECHNOLOGY
1. GPS-Denied Navigation — Optical Flow Camera (tracks ground motion frame-by-frame, effective ceiling up to 35 m); LiDAR distance sensor (0.1 m to 40 m altitude measurement); Improved EKF (fuses optical flow, barometer and magnetometer to reduce IMU drift and hold position); immune to GPS jamming; dual mode (GPS or GPS-denied, switchable per mission).
2. AI Object Detection & Tracking — integrated computer vision automatically detects and tracks targets, with confidence up to 75% depending on target, scene and model configuration. Always mention this figure is variable and conditions-dependent — never claim guaranteed accuracy.
3. Engineering & Reliability — Dual-IMU (redundant inertial sensing); STM32 flight controller; dual vibration isolation (for the flight controller and guidance sensors); open-source hardware (customizable — ideal for research and Teknofest teams); rapid battery swap.

SPECIFICATIONS (real figures from the official brochure — never invent or estimate numbers beyond these)
- Net weight: 3 kg
- Max take-off weight (MTOW): 3.5 kg
- Flight time: up to 17 minutes
- Operational range: up to 2.5 km
- Flight speed: 2.5 m/s
- Max altitude: 150 m
- Optical flow range: up to 35 m
- Operating temperature: -20°C to +35°C
- Standard delivery within Turkey: 3 days

WHO IT'S FOR
- Companies & industry: industrial inspection/mapping, security & surveillance, urban operations without relying on GPS.
- Universities & research centers: open-source R&D platform, thesis/PhD projects, sensor-fusion and autonomous-navigation research.
- Teknofest & academic competition teams: ready platform for GPS-denied navigation algorithms, local Istanbul-based technical support, spare parts, fast delivery.
- Government & public-safety institutions: search & rescue, emergency response in complex urban environments, training programs.

CONTACT
WhatsApp / phone: +90 536 697 62 22 (team available around the clock). Email: flyzoneproteam@gmail.com. Based in Istanbul, Türkiye.

YOUR ROLE AND RULES
- Answer using ONLY the facts above. Never invent specs, certifications, pricing, or claims that aren't listed here — if you don't know something, say so honestly and offer to connect them with the team.
- There is no public price list. For pricing, quotes, bulk/institutional deals, customization requests, or anything requiring a real commitment, warmly steer the visitor to WhatsApp (+90 536 697 62 22) or the contact form on this page — offer to help them get there rather than guessing a number.
- Keep replies short and conversational: 2 to 5 sentences, like a real chat message — not an essay, not a bulleted spec sheet unless they explicitly ask for the full spec list.
- Respond in the language the visitor is writing in. If that's unclear, default to {$langNames[$lang]}.
- Stay on topic: FLYZONE, the HUR-UAV-01, drones, and GPS-denied navigation. If asked something unrelated, politely note that this chat is for HUR-UAV-01 / FLYZONE questions and offer to help with that instead.
- You cannot place orders, take payments, or make binding commitments — always route those to the human team via WhatsApp or the contact form.
- Be warm, professional, and genuinely helpful. You represent FLYZONE's brand to a potential customer, university, or Teknofest team.
PROMPT;

// ---------------------------------------------------------------------
// Build the Claude API request
// ---------------------------------------------------------------------
$messages = $history;
$messages[] = ['role' => 'user', 'content' => $message];

$payload = [
    'model' => ANTHROPIC_MODEL,
    'max_tokens' => 1024,
    'system' => $systemPrompt,
    'messages' => $messages,
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: ' . ANTHROPIC_API_KEY,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_TIMEOUT => 28,
    CURLOPT_CONNECTTIMEOUT => 10,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $curlError) {
    http_response_code(502);
    echo json_encode(['error' => 'upstream_unreachable']);
    exit;
}

$data = json_decode($response, true);

if ($httpCode !== 200 || !is_array($data)) {
    http_response_code(502);
    echo json_encode(['error' => 'upstream_error']);
    exit;
}

if (($data['stop_reason'] ?? '') === 'refusal') {
    echo json_encode([
        'reply' => "I'm not able to help with that specific request, but I'm happy to answer anything about the HUR-UAV-01 — or you can reach our team directly on WhatsApp.",
    ]);
    exit;
}

$replyText = '';
if (!empty($data['content']) && is_array($data['content'])) {
    foreach ($data['content'] as $block) {
        if (($block['type'] ?? '') === 'text') {
            $replyText .= $block['text'];
        }
    }
}

if (trim($replyText) === '') {
    http_response_code(502);
    echo json_encode(['error' => 'empty_response']);
    exit;
}

echo json_encode(['reply' => $replyText]);
