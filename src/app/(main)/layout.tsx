// src/app/(main)/layout.tsx
"use client";

import HomePageLayout from "@/components/homePageLayout/homePageLayout";
import { AuthGuard } from "@/components/AuthGuard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard requireAuth={false}>
            <HomePageLayout>
                {children}
            </HomePageLayout>
        </AuthGuard>
    );
}