export const translations = {
  en: {
    // Navigation
    home: "Home",
    shop: "Shop",
    about: "About",
    contact: "Contact",
    blog: "Blog",
    cart: "Cart",
    orders: "Orders",
    login: "Login",
    logout: "Logout",
    signup: "Sign Up",
    admin: "Admin",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    price: "Price",
    category: "Category",
    all: "All",

    // Product
    addToCart: "Add to Cart",
    quantity: "Quantity",
    size: "Size",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    featuredProducts: "Featured Products",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",

    // Cart
    cartEmpty: "Your cart is empty",
    cartTotal: "Total",
    proceedToCheckout: "Proceed to Checkout",
    removeFromCart: "Remove from Cart",
    updateQuantity: "Update Quantity",

    // Checkout
    checkout: "Checkout",
    billingAddress: "Billing Address",
    shippingAddress: "Shipping Address",
    paymentMethod: "Payment Method",
    orderSummary: "Order Summary",
    placeOrder: "Place Order",
    orderConfirmation: "Order Confirmation",
    orderNumber: "Order Number",

    // Forms
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    postalCode: "Postal Code",
    country: "Country",
    message: "Message",
    subject: "Subject",

    // Messages
    itemAddedToCart: "Item added to cart",
    itemRemovedFromCart: "Item removed from cart",
    orderPlaced: "Order placed successfully",
    loginRequired: "Please login to continue",
    invalidCredentials: "Invalid credentials",
    accountCreated: "Account created successfully",
  },
  lt: {
    // Navigation
    home: "Pradžia",
    shop: "Parduotuvė",
    about: "Apie mus",
    contact: "Kontaktai",
    blog: "Tinklaraštis",
    cart: "Krepšelis",
    orders: "Užsakymai",
    login: "Prisijungti",
    logout: "Atsijungti",
    signup: "Registruotis",
    admin: "Administracija",

    // Common
    loading: "Kraunama...",
    error: "Klaida",
    success: "Sėkmė",
    save: "Išsaugoti",
    cancel: "Atšaukti",
    delete: "Ištrinti",
    edit: "Redaguoti",
    add: "Pridėti",
    search: "Ieškoti",
    filter: "Filtruoti",
    sort: "Rūšiuoti",
    price: "Kaina",
    category: "Kategorija",
    all: "Visi",

    // Product
    addToCart: "Pridėti į krepšelį",
    quantity: "Kiekis",
    size: "Dydis",
    inStock: "Yra sandėlyje",
    outOfStock: "Nėra sandėlyje",
    featuredProducts: "Rekomenduojami produktai",
    newArrivals: "Naujienos",
    bestSellers: "Populiariausi",

    // Cart
    cartEmpty: "Jūsų krepšelis tuščias",
    cartTotal: "Iš viso",
    proceedToCheckout: "Pereiti prie apmokėjimo",
    removeFromCart: "Pašalinti iš krepšelio",
    updateQuantity: "Atnaujinti kiekį",

    // Checkout
    checkout: "Apmokėjimas",
    billingAddress: "Sąskaitos adresas",
    shippingAddress: "Pristatymo adresas",
    paymentMethod: "Mokėjimo būdas",
    orderSummary: "Užsakymo santrauka",
    placeOrder: "Pateikti užsakymą",
    orderConfirmation: "Užsakymo patvirtinimas",
    orderNumber: "Užsakymo numeris",

    // Forms
    firstName: "Vardas",
    lastName: "Pavardė",
    email: "El. paštas",
    phone: "Telefonas",
    address: "Adresas",
    city: "Miestas",
    postalCode: "Pašto kodas",
    country: "Šalis",
    message: "Žinutė",
    subject: "Tema",

    // Messages
    itemAddedToCart: "Prekė pridėta į krepšelį",
    itemRemovedFromCart: "Prekė pašalinta iš krepšelio",
    orderPlaced: "Užsakymas sėkmingai pateiktas",
    loginRequired: "Prašome prisijungti",
    invalidCredentials: "Neteisingi prisijungimo duomenys",
    accountCreated: "Paskyra sėkmingai sukurta",
  },
};

export function getTranslation(key: string, language: "en" | "lt"): string {
  const keys = key.split(".");
  let value: any = translations[language];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

export function useTranslation(language: "en" | "lt") {
  return (key: string) => getTranslation(key, language);
}
