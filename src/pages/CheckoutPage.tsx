@@ .. @@
-"use client";
-
 import { useState } from "react";
-import { useRouter } from "next/navigation";
+import { useNavigate } from "react-router-dom";
-import Link from "next/link";
+import { Link } from "react-router-dom";
 import Image from "next/image";
@@ .. @@
 export default function CheckoutPage() {
-  const router = useRouter();
+  const navigate = useNavigate();
@@ .. @@
   // Redirect to cart if empty
   if (items.length === 0 && !orderPlaced) {
-    router.push("/cart");
+    navigate("/cart");
     return null;
   }