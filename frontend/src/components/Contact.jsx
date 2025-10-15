import React, { useState } from 'react';
import Section from './Section';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(
        'https://formsubmit.io/send/akbar8nur@gmail.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" background="bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl dark:text-white">
          Hubungi Saya
        </h2>
        <p className="mt-4 text-lg text-gray-600 sm:text-xl md:text-2xl dark:text-gray-300">
          Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk
          menghubungi saya.
        </p>
      </div>

      <div className="mx-auto mt-10 w-full max-w-2xl sm:mt-12">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:space-y-8 sm:p-10"
          autoComplete="off"
        >
          <div className="relative">
            <label
              htmlFor="name"
              className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Masukkan nama Anda"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="email"
              className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Masukkan email Anda"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="message"
              className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
            >
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              autoComplete="off"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Tulis pesan Anda di sini"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 sm:py-4 px-8 sm:px-10 text-lg sm:text-xl font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 sm:h-6 sm:w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="font-medium">Mengirim...</span>
              </span>
            ) : (
              'Kirim Pesan'
            )}
          </button>

          {submitStatus === 'success' && (
            <div className="text-green-600 dark:text-green-400 text-center p-4 sm:p-5 text-base sm:text-lg bg-green-50 dark:bg-green-900/20 rounded-lg animate-fade-in">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-2 sm:mb-3 text-green-500 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Terima kasih! Pesan Anda telah berhasil dikirim.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="text-red-600 dark:text-red-400 text-center p-4 sm:p-5 text-base sm:text-lg bg-red-50 dark:bg-red-900/20 rounded-lg animate-fade-in">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-2 sm:mb-3 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Maaf! Terjadi kesalahan. Silakan coba lagi nanti.
            </div>
          )}
        </form>
      </div>
    </Section>
  );
};

export default Contact;
