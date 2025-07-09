
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true, // ✅ Пропускает ошибки типов
    },
    eslint: {
        ignoreDuringBuilds: true, // ✅ Пропускает ESLint при build
    },
    images: {
        domains: ['flagcdn.com'],
    },
};

export default nextConfig;