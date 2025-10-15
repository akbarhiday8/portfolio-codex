<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        //
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        if ($this->isHttpException($e) && $e->getStatusCode() === 419) {
            return response()->json(['message' => 'CSRF token mismatch.'], 419);
        }

        return parent::render($request, $e);
    }
}
