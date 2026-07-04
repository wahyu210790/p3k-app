<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware EnsureIsKasirOrOwner
 * Kasir dan Owner sama-sama diizinkan (untuk POS dan Non-Sales).
 */
class EnsureIsKasirOrOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || (!$user->isKasir() && !$user->isOwner())) {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json(['message' => 'Akses ditolak.'], 403);
            }
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
