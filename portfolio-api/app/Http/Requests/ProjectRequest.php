<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
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
            'description' => ['nullable', 'string'],
            'link_url' => ['nullable', 'url'],
            'project_category_id' => ['required', 'exists:project_categories,id'],
            'tool_ids' => ['nullable', 'array'],
            'tool_ids.*' => ['integer', 'exists:tools,id'],
            'features' => ['nullable', 'array'],
            'features.*' => ['required', 'string', 'max:255'],
        ];
    }
}
