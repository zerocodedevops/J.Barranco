import type { Config } from "tailwindcss";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "brand-blue": "#003366",
                "brand-green": "#00A86B",
                "brand-orange": "#FF7F50",
                "brand-blue-light": "#66b3ff",
                "gray-light": "#f8f9fa",
            },
        },
    },
    plugins: [],
} satisfies Config;
