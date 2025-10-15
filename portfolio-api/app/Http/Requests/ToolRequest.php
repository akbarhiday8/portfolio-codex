<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ToolRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'tool_type_id' => ['required', 'exists:tool_types,id'],
            'tool_category_id' => ['required', 'exists:tool_categories,id'],
            'icon_color' => ['required', 'regex:/^#([A-Fa-f0-9]{6})$/'],
        ];
    }
}
