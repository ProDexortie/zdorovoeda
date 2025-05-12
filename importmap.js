// Создаем import map для поддержки импортов React и JSX
const importMap = {
  imports: {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime",
    "@babel/standalone": "https://unpkg.com/@babel/standalone/babel.min.js"
  }
};

// Добавляем import map на страницу
const importMapScript = document.createElement('script');
importMapScript.type = 'importmap';
importMapScript.textContent = JSON.stringify(importMap);
document.head.appendChild(importMapScript);

// Добавляем Babel для обработки JSX
(async () => {
  const Babel = await import("@babel/standalone");
  
  // Перехватываем запросы к JSX файлам
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    if (typeof url === 'string' && url.endsWith('.jsx')) {
      const response = await originalFetch(url, options);
      const text = await response.text();
      
      // Трансформируем JSX в JavaScript
      const transformed = Babel.transform(text, {
        presets: ['react'],
        filename: url,
      }).code;
      
      // Создаем новый Response объект с трансформированным кодом
      return new Response(transformed, {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript'
        }
      });
    }
    return originalFetch(url, options);
  };
})();