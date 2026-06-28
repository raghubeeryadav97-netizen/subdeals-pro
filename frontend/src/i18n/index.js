const translations = {
  en: {
    home: 'Home', plans: 'Plans', entertainment: 'Entertainment', ai: 'AI Plans',
    pricing: 'Pricing', faq: 'FAQ', reviews: 'Reviews', about: 'About', blog: 'Blog',
    contact: 'Contact', login: 'Login', register: 'Register', dashboard: 'Dashboard',
    buyNow: 'Buy Now', search: 'Search plans...', featured: 'Featured Plans',
    popular: 'Popular Plans', trending: 'Trending Plans', howItWorks: 'How It Works',
    newsletter: 'Newsletter', subscribe: 'Subscribe', heroTitle: 'Premium Subscriptions at Unbeatable Prices',
    heroSubtitle: 'Get Netflix, Spotify, ChatGPT Plus & more at the best prices in India',
    getStarted: 'Get Started', viewPlans: 'View Plans', statistics: 'Statistics',
    customers: 'Happy Customers', orders: 'Orders Delivered', plans_count: 'Premium Plans',
    satisfaction: 'Satisfaction Rate', loading: 'Loading...', noResults: 'No results found',
    duration: 'Duration', price: 'Price', features: 'Features', refundPolicy: 'Refund Policy',
    terms: 'Terms of Service', privacy: 'Privacy Policy',
  },
  hi: {
    home: 'होम', plans: 'प्लान', entertainment: 'मनोरंजन', ai: 'AI प्लान',
    pricing: 'कीमत', faq: 'सवाल-जवाब', reviews: 'रिव्यू', about: 'हमारे बारे में', blog: 'ब्लॉग',
    contact: 'संपर्क', login: 'लॉगिन', register: 'रजिस्टर', dashboard: 'डैशबोर्ड',
    buyNow: 'अभी खरीदें', search: 'प्लान खोजें...', featured: 'फीचर्ड प्लान',
    popular: 'लोकप्रिय प्लान', trending: 'ट्रेंडिंग प्लान', howItWorks: 'कैसे काम करता है',
    newsletter: 'न्यूज़लेटर', subscribe: 'सब्सक्राइब', heroTitle: 'बेस्ट कीमत पर प्रीमियम सब्सक्रिप्शन',
    heroSubtitle: 'Netflix, Spotify, ChatGPT Plus और भी बहुत कुछ भारत की सबसे अच्छी कीमत पर',
    getStarted: 'शुरू करें', viewPlans: 'प्लान देखें', statistics: 'आंकड़े',
    customers: 'खुश ग्राहक', orders: 'ऑर्डर डिलीवर', plans_count: 'प्रीमियम प्लान',
    satisfaction: 'संतुष्टि दर', loading: 'लोड हो रहा है...', noResults: 'कोई परिणाम नहीं',
    duration: 'अवधि', price: 'कीमत', features: 'फीचर्स', refundPolicy: 'रिफंड नीति',
    terms: 'नियम और शर्तें', privacy: 'गोपनीयता नीति',
  },
};

let currentLang = localStorage.getItem('lang') || 'en';

export const setLanguage = (lang) => {
  currentLang = lang;
  localStorage.setItem('lang', lang);
};

export const t = (key) => translations[currentLang]?.[key] || translations.en[key] || key;

export const getLanguage = () => currentLang;
export const getLanguages = () => Object.keys(translations);