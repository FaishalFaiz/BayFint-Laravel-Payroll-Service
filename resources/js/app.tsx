import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        const page = pages[`./pages/${name}.tsx`] || pages[`./pages/${name}/index.tsx`];

        if (!page) {
            console.error(`Inertia Page not found: ${name}. Searched in:`, Object.keys(pages));
        }

        return page;
    },
    setup({ el, App, props }) {
        if (!el) {
return;
}

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#2563eb', // Blue-600
    },
});
