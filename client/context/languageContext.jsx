import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext(null);

const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    contact: "Contact",
    agents: "Agents",
    signIn: "Sign in",
    signUp: "Sign up",
    profile: "Profile",
    
    // Home Page
    findRealEstate: "Find Real Estate & Get Your Dream Place",
    homeDescription: "Discover your perfect property with our comprehensive real estate platform. We connect buyers, sellers, and renters with the best properties in the market.",
    yearsOfExperience: "Years of Experience",
    awardGained: "Award Gained",
    propertyReady: "Property Ready",
    
    // About Page
    aboutTitle: "About Us",
    aboutSubtitle: "Your Trusted Real Estate Partner",
    aboutDescription: "We are a leading real estate company. Our mission is to help you find the perfect property that matches your dreams and lifestyle.",
    ourMission: "Our Mission",
    missionText: "To provide exceptional real estate services that exceed client expectations while maintaining the highest standards of professionalism and integrity.",
    ourVision: "Our Vision",
    visionText: "To become the most trusted and innovative real estate platform in the region, connecting people with their ideal properties.",
    ourValues: "Our Values",
    value1: "Integrity",
    value1Desc: "We conduct business with honesty and transparency.",
    value2: "Excellence",
    value2Desc: "We strive for excellence in every transaction.",
    value3: "Customer Focus",
    value3Desc: "Your satisfaction is our top priority.",
    
    // Contact Page
    contactTitle: "Get in Touch",
    contactSubtitle: "We'd love to hear from you",
    contactDescription: "Have questions? We're here to help! Reach out to us through any of the following channels.",
    name: "Name",
    contactEmail: "Email",
    phone: "Phone",
    message: "Message",
    contactSendMessage: "Send Message",
    contactInfo: "Contact Information",
    contactAddress: "Address",
    workingHours: "Working Hours",
    mondayFriday: "Monday - Friday: 9:00 AM - 6:00 PM",
    saturday: "Saturday: 10:00 AM - 4:00 PM",
    sunday: "Sunday: Closed",
    
    // Agents Page
    agentsTitle: "Our Expert Agents",
    agentsSubtitle: "Meet our professional real estate team",
    agentsDescription: "Our team of experienced agents is dedicated to helping you find your perfect property. Each agent brings years of expertise and a commitment to excellence.",
    viewProfile: "View Profile",
    propertiesSold: "Properties Sold",
    yearsExperience: "Years Experience",
    specialties: "Specialties",
    languages: "Languages",
    
    // Profile Page
    userInformation: "User Information",
    updateProfile: "Update Profile",
    avatar: "Avatar",
    username: "Username",
    email: "E-mail",
    logout: "Logout",
    myList: "My List",
    createNewPost: "Create New Post",
    savedList: "Saved List",
    loadingPosts: "Loading posts...",
    errorLoadingPosts: "Error loading posts.",
    
    // List Page
    availableProperties: "Available Properties",
    discoverProperty: "Discover your perfect property",
    agentsProperties: "Agent's Properties",
    propertiesByAgent: "Properties listed by this agent",
    propertiesFound: "Properties Found",
    propertyFound: "Property",
    noPostsFound: "No posts found. Try adjusting your filters.",
    propertiesBy: "Properties by",
    
    // Single Page
    general: "General",
    utilities: "Utilities",
    ownerResponsible: "Owner is responsible",
    tenantResponsible: "Tenant is responsible",
    petPolicy: "Pet Policy",
    petsAllowed: "Pets Allowed",
    petsNotAllowed: "Pets not Allowed",
    incomePolicy: "Income Policy",
    sizes: "Sizes",
    sqft: "sqft",
    beds: "beds",
    bathroom: "bathroom",
    nearbyPlaces: "Nearby Places",
    school: "School",
    away: "away",
    busStop: "Bus Stop",
    restaurant: "Restaurant",
    location: "Location",
    editPost: "Edit Post",
    deletePost: "Delete Post",
    sendMessage: "Send a Message",
    placeSaved: "Place Saved",
    savePlace: "Save the Place",
    unsavePlace: "Unsave the Place",
    cannotMessageYourself: "You cannot message yourself",
    
    // New Post Page
    addNewPost: "Add New Post",
    title: "Title",
    price: "Price",
    address: "Address",
    description: "Description",
    city: "City",
    bedroomNumber: "Bedroom Number",
    bathroomNumber: "Bathroom Number",
    latitude: "Latitude",
    longitude: "Longitude",
    type: "Type",
    property: "Property",
    rent: "Rent",
    buy: "Buy",
    apartment: "Apartment",
    house: "House",
    condo: "Condo",
    land: "Land",
    utilitiesPolicy: "Utilities Policy",
    shared: "Shared",
    petPolicyLabel: "Pet Policy",
    allowed: "Allowed",
    notAllowed: "Not Allowed",
    incomePolicyLabel: "Income Policy",
    totalSize: "Total Size",
    schoolLabel: "School",
    bus: "Bus",
    add: "Add",
    updatePost: "Update Post",
    
    // Common
    search: "Search",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    visitOurOffice: "Visit Our Office",
    openInGoogleMaps: "Open in Google Maps",
    bedroom: "bedroom",
    propertiesList: "Properties List",
    confirmDelete: "Are you sure you want to delete this post?",
    failedDelete: "Failed to delete post",
    failedSave: "Failed to save post",
    failedMessage: "Failed to send message",
    any: "any",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    about: "من نحن",
    contact: "اتصل بنا",
    agents: "الوكلاء",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    profile: "الملف الشخصي",
    
    // Home Page
    findRealEstate: "ابحث عن عقار واحصل على المكان الذي تحلم به",
    homeDescription: "اكتشف العقار المثالي من خلال منصة العقارات الشاملة. نربط المشترين والبائعين والمستأجرين بأفضل العقارات في السوق.",
    yearsOfExperience: "سنوات من الخبرة",
    awardGained: "جائزة حصلنا عليها",
    propertyReady: "عقار جاهز",
    
    // About Page
    aboutTitle: "من نحن",
    aboutSubtitle: "شريكك الموثوق في العقارات",
    aboutDescription: "نحن شركة عقارية رائدة . مهمتنا هي مساعدتك في العثور على العقار المثالي الذي يطابق أحلامك وأسلوب حياتك.",
    ourMission: "مهمتنا",
    missionText: "تقديم خدمات عقارية استثنائية تتجاوز توقعات العملاء مع الحفاظ على أعلى معايير الاحترافية والنزاهة.",
    ourVision: "رؤيتنا",
    visionText: "أن نصبح منصة العقارات الأكثر ثقة وابتكاراً في المنطقة، ونربط الناس بعقاراتهم المثالية.",
    ourValues: "قيمنا",
    value1: "النزاهة",
    value1Desc: "نعمل بصدق وشفافية.",
    value2: "التميز",
    value2Desc: "نسعى للتميز في كل معاملة.",
    value3: "التركيز على العميل",
    value3Desc: "رضاك هو أولويتنا القصوى.",
    
    // Contact Page
    contactTitle: "تواصل معنا",
    contactSubtitle: "نود أن نسمع منك",
    contactDescription: "لديك أسئلة؟ نحن هنا لمساعدتك! تواصل معنا من خلال أي من القنوات التالية.",
    name: "الاسم",
    contactEmail: "البريد الإلكتروني",
    phone: "الهاتف",
    message: "الرسالة",
    contactSendMessage: "إرسال الرسالة",
    contactInfo: "معلومات الاتصال",
    contactAddress: "العنوان",
    workingHours: "ساعات العمل",
    mondayFriday: "الاثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً",
    saturday: "السبت: 10:00 صباحاً - 4:00 مساءً",
    sunday: "الأحد: مغلق",
    
    // Agents Page
    agentsTitle: "وكلاؤنا الخبراء",
    agentsSubtitle: "تعرف على فريقنا العقاري المحترف",
    agentsDescription: "فريقنا من الوكلاء ذوي الخبرة مكرس لمساعدتك في العثور على عقارك المثالي. كل وكيل يجلب سنوات من الخبرة والالتزام بالتميز.",
    viewProfile: "عرض الملف الشخصي",
    propertiesSold: "عقارات مباعة",
    yearsExperience: "سنوات الخبرة",
    specialties: "التخصصات",
    languages: "اللغات",
    
    // Profile Page
    userInformation: "معلومات المستخدم",
    updateProfile: "تحديث الملف الشخصي",
    avatar: "الصورة الشخصية",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    logout: "تسجيل الخروج",
    myList: "قائمتي",
    createNewPost: "إنشاء منشور جديد",
    savedList: "القائمة المحفوظة",
    loadingPosts: "جاري تحميل المنشورات...",
    errorLoadingPosts: "خطأ في تحميل المنشورات.",
    
    // List Page
    availableProperties: "العقارات المتاحة",
    discoverProperty: "اكتشف عقارك المثالي",
    agentsProperties: "عقارات الوكيل",
    propertiesByAgent: "العقارات المدرجة من قبل هذا الوكيل",
    propertiesFound: "عقارات تم العثور عليها",
    propertyFound: "عقار",
    noPostsFound: "لم يتم العثور على منشورات. حاول تعديل عوامل التصفية الخاصة بك.",
    propertiesBy: "عقارات من",
    
    // Single Page
    general: "عام",
    utilities: "المرافق",
    ownerResponsible: "المالك مسؤول",
    tenantResponsible: "المستأجر مسؤول",
    petPolicy: "سياسة الحيوانات الأليفة",
    petsAllowed: "الحيوانات الأليفة مسموحة",
    petsNotAllowed: "الحيوانات الأليفة غير مسموحة",
    incomePolicy: "سياسة الدخل",
    sizes: "الأحجام",
    sqft: "قدم مربع",
    beds: "غرف نوم",
    bathroom: "حمام",
    nearbyPlaces: "الأماكن القريبة",
    school: "المدرسة",
    away: "بعيد",
    busStop: "محطة الحافلة",
    restaurant: "المطعم",
    location: "الموقع",
    editPost: "تعديل المنشور",
    deletePost: "حذف المنشور",
    sendMessage: "إرسال رسالة",
    placeSaved: "تم حفظ المكان",
    savePlace: "حفظ المكان",
    unsavePlace: "إلغاء حفظ المكان",
    cannotMessageYourself: "لا يمكنك إرسال رسالة لنفسك",
    
    // New Post Page
    addNewPost: "إضافة منشور جديد",
    title: "العنوان",
    price: "السعر",
    address: "العنوان",
    description: "الوصف",
    city: "المدينة",
    bedroomNumber: "عدد غرف النوم",
    bathroomNumber: "عدد الحمامات",
    latitude: "خط العرض",
    longitude: "خط الطول",
    type: "النوع",
    property: "نوع العقار",
    rent: "إيجار",
    buy: "شراء",
    apartment: "شقة",
    house: "منزل",
    condo: "شقة سكنية",
    land: "أرض",
    utilitiesPolicy: "سياسة المرافق",
    shared: "مشترك",
    petPolicyLabel: "سياسة الحيوانات الأليفة",
    allowed: "مسموح",
    notAllowed: "غير مسموح",
    incomePolicyLabel: "سياسة الدخل",
    totalSize: "الحجم الإجمالي",
    schoolLabel: "المدرسة",
    bus: "الحافلة",
    add: "إضافة",
    updatePost: "تحديث المنشور",
    
    // Common
    search: "بحث",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    visitOurOffice: "زيارة مكتبنا",
    openInGoogleMaps: "فتح في خرائط جوجل",
    bedroom: "غرفة نوم",
    propertiesList: "قائمة العقارات",
    confirmDelete: "هل أنت متأكد أنك تريد حذف هذا المنشور؟",
    failedDelete: "فشل في حذف المنشور",
    failedSave: "فشل في حفظ المنشور",
    failedMessage: "فشل في إرسال الرسالة",
    any: "أي",
    minPrice: "الحد الأدنى للسعر",
    maxPrice: "الحد الأقصى للسعر",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الداكن",
  }
};

export const LanguageContextProvider = ({ children }) => {
  const getInitialLanguage = () => {
    try {
      const saved = localStorage.getItem("language");
      return saved || "ar";
    } catch (err) {
      return "ar";
    }
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const initialLang = getInitialLanguage();
    try {
      document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = initialLang;
    } catch (err) {
      console.error("Failed to set initial language:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("language", language);
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    } catch (err) {
      console.error("Failed to save language:", err);
    }
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ar" : "en");
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

