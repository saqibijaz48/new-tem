@@ .. @@
-"use client";
-
 import { useState } from "react";
-import Link from "next/link";
+import { Link } from "react-router-dom";
-import { useRouter } from "next/navigation";
+import { useNavigate } from "react-router-dom";
@@ .. @@
 export default function LoginPage() {
-  const router = useRouter();
+  const navigate = useNavigate();
@@ .. @@
         dispatch(setUser(mockUser));
         toast.success(
           language === "en" ? "Login successful!" : "Prisijungimas sėkmingas!",
         );
-        router.push("/");
+        navigate("/");
         return;
@@ .. @@
         dispatch(setUser(user));
         toast.success(
           language === "en" ? "Login successful!" : "Prisijungimas sėkmingas!",
         );
-        router.push("/");
+        navigate("/");
       }