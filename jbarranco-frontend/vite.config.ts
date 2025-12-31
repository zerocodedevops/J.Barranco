import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["logo-light.png", "favicon.png"],
            manifest: {
                name: "J-Barranco - Gestión de Limpieza",
                short_name: "J-Barranco",
                description:
                    "Sistema de gestión para servicios de limpieza de comunidades",
                theme_color: "#003366",
                background_color: "#f8f9fa",
                display: "standalone",
                icons: [
                    {
                        src: "/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                    {
                        src: "/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
            workbox: {
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
                globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],
                // Cache más agresivo para assets
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern:
                            /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "firebase-storage-cache",
                            expiration: {
                                maxEntries: 100, // Aumentado de 50 a 100
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
                            },
                        },
                    },
                    // Cache para Firestore API (reduce lecturas)
                    {
                        urlPattern:
                            /^https:\/\/firestore\.googleapis\.com\/.*/i,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "firestore-api-cache",
                            networkTimeoutSeconds: 3,
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60, // 1 hora
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    // Cache para assets estáticos de la app
                    {
                        urlPattern: /\/images\//,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "app-images-cache",
                            expiration: {
                                maxEntries: 60,
                                maxAgeSeconds: 60 * 60 * 24 * 90, // 90 días
                            },
                        },
                    },
                ],
            },
            devOptions: {
                enabled: false, // Deshabilitado en desarrollo para evitar confusión
            },
        }),
    ],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    firebase: [
                        "firebase/app",
                        "firebase/auth",
                        "firebase/firestore",
                        "firebase/storage",
                    ],
                    pdf: ["jspdf", "jspdf-autotable"],
                    ui: ["@heroicons/react", "react-hot-toast"],
                },
            },
        },
    },
});
