<?php

namespace App\Http\Controllers;

use App\Http\Requests\Setting\UpdateAccountRequest;
use Illuminate\Support\Facades\Hash;

class SettingController extends Controller
{
    public function updateAccount(UpdateAccountRequest $request)
    {
        $data = $request->validated();

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $request->user()->update($data);

        return response()->json(['message' => 'Account updated']);
    }
}
