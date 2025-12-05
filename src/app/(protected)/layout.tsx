// src/app/(protected)/layout.tsx
"use client";

import HomePageLayout from "@/components/homePageLayout/homePageLayout";
import { AuthGuard } from "@/components/AuthGuard";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard requireAuth={true} requireEmailVerification={true}>
            <HomePageLayout>
                {children}
            </HomePageLayout>
        </AuthGuard>
    );
}