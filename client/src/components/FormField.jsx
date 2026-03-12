export default function FormField({ label, name, type = 'text', placeholder, formik }) {
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div>
      <label className="block text-sm font-medium text-[#111827] mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-[#111827] placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
          hasError
            ? 'border-red-400 focus:ring-red-400 bg-red-50'
            : 'border-gray-200 focus:ring-indigo-500'
        }`}
      />
      {hasError && (
        <p className="mt-1.5 text-xs text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );
}
