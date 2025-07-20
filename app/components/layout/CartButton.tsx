"use client";

import { ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { toggleCart } from "@/app/lib/features/cartSlice";

export default function CartButton() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={() => dispatch(toggleCart())}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
