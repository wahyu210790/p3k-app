<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware EnsureIsOwner
 * Hanya Owner yang boleh mengakses route yang dilindungi middleware ini.
 */
class EnsureIsOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isOwner()) {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return response()->json(['message' => 'Akses ditolak. Hanya Owner yang diizinkan.'], 403);
            }
            abort(403, 'Akses ditolak. Hanya Owner yang diizinkan.');
        }

        return $next($request);
    }
}
