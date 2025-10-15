<?php

return [
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'auth/login',
        'auth/logout',
    ],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_filter([
        env('FRONTEND_ADMIN_URL', 'http://localhost:5173'),
        env('FRONTEND_PORTFOLIO_URL', 'http://localhost:5174'),
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ]),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
