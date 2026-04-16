import React from "react";
import { Navigate } from "react-router-dom";

// هذا المكون يستقبل حالة تسجيل الدخول (isLoggedIn) والمحتوى المراد حمايته (children)
export default function ProtectedRoute({ isLoggedIn, children }) {

    if (!isLoggedIn) {
        // إذا لم يكن مسجلاً، قم بتوجيهه فوراً إلى صفحة الدخول
        return <Navigate to="/login" replace />;
    }

    // إذا كان مسجلاً، اسمح له بالمرور وعرض الصفحة
    return children;
}