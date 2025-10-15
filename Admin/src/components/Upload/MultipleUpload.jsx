import { useCallback } from 'react';

export default function MultipleUpload({ files, setFiles, limit = 7 }) {
  const handleChange = useCallback(
    (event) => {
      const selected = Array.from(event.target.files ?? []);
      setFiles(selected.slice(0, limit));
    },
    [setFiles, limit]
  );

  const removeFile = (index) => {
    const next = files.filter((_, idx) => idx !== index);
    setFiles(next);
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-gray-600">
        <span className="text-sm font-medium">Unggah foto proyek (maks {limit})</span>
        <span className="text-xs text-gray-500">Format: JPG, JPEG, PNG, WEBP — max 2MB</span>
        <input type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />
        <span className="rounded bg-gray-900 px-3 py-2 text-sm font-semibold text-white">Pilih File</span>
      </label>

      {!!files.length && (
        <ul className="mt-4 space-y-2 text-left text-sm">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded border bg-gray-50 px-3 py-2"
            >
              <span className="truncate font-medium">{file.name}</span>
              <button
                type="button"
                className="text-xs font-semibold text-red-500 hover:text-red-600"
                onClick={() => removeFile(index)}
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
