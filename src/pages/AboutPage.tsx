import { Shield, Truck, Heart, Award, Users, Globe } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

export default function AboutPage() {
  const language = useAppSelector((state) => state.language.current);

  const features = [
    {
      icon: Shield,
      title: language === "en" ? "Secure Shopping" : "Saugūs pirkimai",
      description:
        language === "en"
          ? "Your data and payments are protected with industry-leading security measures."
          : "Jūsų duomenys ir mokėjimai apsaugoti pažangiausiomis saugumo priemonėmis.",
    },
    {
      icon: Truck,
      title: language === "en" ? "Fast Delivery" : "Greitas pristatymas",
      description:
        language === "en"
          ? "We deliver your orders quickly and efficiently across Lithuania."
          : "Greitai ir efektyviai pristatome jūsų užsakymus visoje Lietuvoje.",
    },
    {
      icon: Heart,
      title: language === "en" ? "Customer Care" : "Klientų aptarnavimas",
      description:
        language === "en"
          ? "Our dedicated support team is here to help you 24/7."
          : "Mūsų atsidavusi pagalbos komanda padės jums 24/7.",
    },
    {
      icon: Award,
      title: language === "en" ? "Quality Products" : "Kokybiški produktai",
      description:
        language === "en"
          ? "We carefully select only the highest quality products for our customers."
          : "Kruopščiai atrenkame tik aukščiausios kokybės produktus mūsų klientams.",
    },
  ];

  const stats = [
    {
      number: "50,000+",
      label: language === "en" ? "Happy Customers" : "Patenkintų klientų",
    },
    {
      number: "1,000+",
      label: language === "en" ? "Products" : "Produktų",
    },
    {
      number: "99.8%",
      label: language === "en" ? "Satisfaction Rate" : "Pasitenkinimo lygis",
    },
    {
      number: "24/7",
      label: language === "en" ? "Customer Support" : "Klientų palaikymas",
    },
  ];

  const team = [
    {
      name: "Elena Kazlauskienė",
      role:
        language === "en" ? "CEO & Founder" : "Generalinė direktorė ir įkūrėja",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b2c9?w=300&h=300&fit=crop&crop=face",
      description:
        language === "en"
          ? "Elena founded E-Store with a vision to make quality products accessible to everyone."
          : "Elena įkūrė E-Store su vizija padaryti kokybiškus produktus prieinamus visiems.",
    },
    {
      name: "Mindaugas Petrauskas",
      role: language === "en" ? "Head of Technology" : "Technologijų vadovas",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description:
        language === "en"
          ? "Mindaugas leads our technology team, ensuring our platform stays cutting-edge."
          : "Mindaugas vadovauja mūsų technologijų komandai, užtikrindamas, kad platforma būtų pažangiausia.",
    },
    {
      name: "Rūta Jankauskaitė",
      role:
        language === "en"
          ? "Customer Experience Manager"
          : "Klientų patirties vadovė",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description:
        language === "en"
          ? "Rūta ensures every customer has an exceptional shopping experience with us."
          : "Rūta užtikrina, kad kiekvienas klientas turėtų išskirtinę pirkinių patirtį pas mus.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        <div className="container py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {language === "en" ? "About E-Store" : "Apie E-Store"}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {language === "en"
                  ? "We are a modern e-commerce platform dedicated to providing high-quality products and exceptional customer service. Our mission is to make online shopping simple, secure, and enjoyable for everyone."
                  : "Mes esame šiuolaikinė e-komercijos platforma, skirta teikti aukštos kokybės produktus ir išskirtinį klientų aptarnavimą. Mūsų misija - padaryti internetinę prekybą paprastą, saugią ir malonią visiems."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center text-primary-600">
                  <Globe className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    {language === "en"
                      ? "Serving Lithuania"
                      : "Aptarnaujame Lietuvą"}
                  </span>
                </div>
                <div className="flex items-center text-primary-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    {language === "en" ? "Founded in 2020" : "Įkurta 2020 m."}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                  alt="About us"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Why Choose Us" : "Kodėl rinktis mus"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "en"
                ? "We are committed to providing the best online shopping experience with these core values."
                : "Mes įsipareigojame teikti geriausią internetinės prekybos patirtį vadovaudamiesi šiais pagrindiniais principais."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {language === "en"
                ? "Meet Our Team"
                : "Susipažinkite su mūsų komanda"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "en"
                ? "Our dedicated team works tirelessly to bring you the best products and service."
                : "Mūsų atsidavusi komanda nenuilstamai dirba, kad jums pasiūlytų geriausius produktus ir aptarnavimą."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-soft p-8 text-center card-hover"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="bg-primary-600 rounded-3xl p-8 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {language === "en" ? "Our Mission" : "Mūsų misija"}
            </h2>
            <p className="text-xl lg:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed">
              {language === "en"
                ? "To create a world where everyone has access to quality products, exceptional service, and a seamless shopping experience. We believe that technology should serve people, making their lives easier and more enjoyable."
                : "Sukurti pasaulį, kuriame visi turėtų prieigą prie kokybiškų produktų, išskirtinio aptarnavimo ir sklandžios pirkinių patirties. Mes tikime, kad technologijos turėtų tarnauti žmonėms, padaryti jų gyvenimą lengvesnį ir malonesnį."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
