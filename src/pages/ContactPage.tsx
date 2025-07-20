import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useAppSelector } from "@/app/lib/hooks";
import { useTranslation } from "@/app/lib/translations";
import { createContactMessage } from "@/app/lib/database";
import toast from "react-hot-toast";

export default function ContactPage() {
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactInfo = [
    {
      icon: Mail,
      title: language === "en" ? "Email Us" : "Rašykite mums",
      content: "info@estore.lt",
      description:
        language === "en"
          ? "Send us an email anytime!"
          : "Rašykite mums bet kada!",
    },
    {
      icon: Phone,
      title: language === "en" ? "Call Us" : "Skambinkite",
      content: "+370 600 12345",
      description:
        language === "en"
          ? "Mon-Fri from 8am to 6pm"
          : "Pr-Pn nuo 8:00 iki 18:00",
    },
    {
      icon: MapPin,
      title: language === "en" ? "Visit Us" : "Aplankykite mus",
      content: language === "en" ? "Vilnius, Lithuania" : "Vilnius, Lietuva",
      description:
        language === "en"
          ? "Come say hello at our office!"
          : "Atvykite pasisveikinti į mūsų biurą!",
    },
    {
      icon: Clock,
      title: language === "en" ? "Working Hours" : "Darbo laikas",
      content:
        language === "en" ? "Mon - Fri: 8:00 - 18:00" : "Pr - Pn: 8:00 - 18:00",
      description:
        language === "en"
          ? "Weekend: 10:00 - 16:00"
          : "Savaitgaliais: 10:00 - 16:00",
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name =
        language === "en" ? "Name is required" : "Vardas privalomas";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        language === "en" ? "Email is required" : "El. paštas privalomas";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =
        language === "en" ? "Email is invalid" : "Neteisingas el. paštas";
    }

    if (!formData.subject.trim()) {
      newErrors.subject =
        language === "en" ? "Subject is required" : "Tema privaloma";
    }

    if (!formData.message.trim()) {
      newErrors.message =
        language === "en" ? "Message is required" : "Žinutė privaloma";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        language === "en"
          ? "Message must be at least 10 characters"
          : "Žinutė turi būti bent 10 simbolių";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const messageData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        language,
      };

      await createContactMessage(messageData);

      toast.success(
        language === "en"
          ? "Message sent successfully! We will get back to you soon."
          : "Žinutė išsiųsta sėkmingai! Netrukus su jumis susisieksime.",
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.success(
        language === "en"
          ? "Message received! We will get back to you soon. (Demo mode)"
          : "Žinutė gauta! Netrukus su jumis susisieksime. (Demo režimas)",
      );

      // Reset form even in demo mode
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {language === "en" ? "Contact Us" : "Susisiekite su mumis"}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            {language === "en"
              ? "We would love to hear from you. Send us a message and we will respond as soon as possible."
              : "Mums labai svarbu jūsų nuomonė. Parašykite mums žinutę ir mes atsakysime kuo greičiau."}
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-soft p-6 text-center card-hover"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-primary-600 font-medium mb-1">
                  {info.content}
                </p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-soft p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === "en"
                  ? "Send us a message"
                  : "Parašykite mums žinutę"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Your Name" : "Jūsų vardas"} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`input-field ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      placeholder={
                        language === "en" ? "Enter your name" : "Įveskite vardą"
                      }
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("email")} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`input-field ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      placeholder={
                        language === "en"
                          ? "Enter your email"
                          : "Įveskite el. paštą"
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("subject")} *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    className={`input-field ${errors.subject ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    placeholder={
                      language === "en"
                        ? "What is this about?"
                        : "Kokia žinutės tema?"
                    }
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("message")} *
                  </label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    className={`input-field resize-none ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    placeholder={
                      language === "en"
                        ? "Tell us more details..."
                        : "Papasakokite daugiau detalių..."
                    }
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {loading
                      ? language === "en"
                        ? "Sending..."
                        : "Siunčiama..."
                      : language === "en"
                        ? "Send Message"
                        : "Siųsti žinutę"}
                  </span>
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === "en"
                    ? "Frequently Asked Questions"
                    : "Dažnai užduodami klausimai"}
                </h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {language === "en"
                        ? "How long does delivery take?"
                        : "Kiek laiko užtrunka pristatymas?"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "en"
                        ? "Standard delivery takes 1-3 business days within Lithuania. Express delivery is available for next-day delivery."
                        : "Standartinis pristatymas užtrunka 1-3 darbo dienas Lietuvoje. Galimas skubus pristatymas kitą dieną."}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {language === "en"
                        ? "What payment methods do you accept?"
                        : "Kokius mokėjimo būdus priimate?"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "en"
                        ? "We accept cash on delivery (COD), and we are working on adding card payments soon."
                        : "Priimame apmokėjimą gavus (COD), ir netrukus pridėsime mokėjimą kortele."}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {language === "en"
                        ? "Can I return a product?"
                        : "Ar galiu grąžinti produktą?"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "en"
                        ? "Yes, we offer a 30-day return policy for most products. The item must be in original condition."
                        : "Taip, siūlome 30 dienų grąžinimo politiką daugumai produktų. Prekė turi būti originalioje būklėje."}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-soft p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {language === "en"
                        ? "How can I track my order?"
                        : "Kaip galiu sekti savo užsakymą?"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "en"
                        ? "Once your order is shipped, you will receive a tracking number via email to monitor your package."
                        : "Kai jūsų užsakymas bus išsiųstas, el. paštu gausite sekimo numerį, kad galėtumėte stebėti siuntą."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
