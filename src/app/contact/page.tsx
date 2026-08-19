import ContactForm from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail, Clock, Shield, Sparkles, Navigation } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Concierge | Embera House Chennai",
  description:
    "Get in touch with the Embera House concierge: table bookings, private dining salon inquiries, press, and directions to No. 42, Khader Nawaz Khan Road, Nungambakkam, Chennai.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="label-caps text-[#C86E45] block">Chennai Residence</span>
          <h1 className="hero-title text-[#F7F2E9]">
            Contact & <span className="italic font-light text-[#D3B98D]">Concierge.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed">
            Our guest relations team is dedicated to curating your visit. For private dining, dietary consultations, or general inquiries, please contact us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Contact Information & Policies */}
          <div className="lg:col-span-5 space-y-8">
            {/* Address & Hours Card */}
            <div className="p-8 bg-[#191714] border border-white/10 space-y-6">
              <span className="label-caps text-[#C86E45] block">Location & Contact</span>

              <div className="space-y-4 text-xs sm:text-sm text-[#A9A095]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C86E45] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F7F2E9] block font-medium">EMBERA HOUSE</strong>
                    <span>No. 42, Khader Nawaz Khan Road, Nungambakkam, Chennai, Tamil Nadu 600006</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C86E45] shrink-0" />
                  <div>
                    <span className="text-[#F7F2E9] font-medium">+91 44 4890 5500 / +91 98400 33400</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C86E45] shrink-0" />
                  <div>
                    <span className="text-[#F7F2E9] font-medium">reservations@emberahouse.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                  <Clock className="w-4 h-4 text-[#D3B98D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F7F2E9] block font-medium">Service Hours</strong>
                    <p className="text-xs text-[#A9A095] mt-0.5">
                      Lunch: Tuesday – Sunday, 12:00 – 15:30
                    </p>
                    <p className="text-xs text-[#A9A095]">
                      Dinner: Monday – Sunday, 18:30 – 23:30
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel & Transit Card */}
            <div className="p-8 bg-[#191714] border border-white/10 space-y-4 text-xs text-[#A9A095]">
              <span className="label-caps text-[#C86E45] block">Arrival & Parking</span>
              <div className="space-y-2 leading-relaxed">
                <p>
                  <strong className="text-[#F7F2E9]">Metro & Rail:</strong> Nungambakkam Railway Station (1.2 km) and Thousand Lights Metro Station (1.5 km) are minutes away. Located off Nungambakkam High Road near Taj Coromandel.
                </p>
                <p>
                  <strong className="text-[#F7F2E9]">Valet & Chauffeur Parking:</strong> Dedicated complimentary valet service is available at the private portico on Khader Nawaz Khan Road for all dinner & lunch reservations.
                </p>
              </div>
            </div>

            {/* Dress Code & Accessibility */}
            <div id="dress-code" className="p-8 bg-[#191714] border border-white/10 space-y-4 text-xs text-[#A9A095]">
              <span className="label-caps text-[#D3B98D] block">Guest Standards</span>
              <div className="space-y-3 leading-relaxed">
                <div>
                  <strong className="text-[#F7F2E9] block mb-0.5">Dress Code: Smart Elegant</strong>
                  <span>Tailored evening attire is preferred. Athletic gymwear and slippers/flip-flops are politely declined in all dining rooms.</span>
                </div>
                <div id="accessibility" className="pt-2 border-t border-white/5">
                  <strong className="text-[#F7F2E9] block mb-0.5">Accessibility</strong>
                  <span>Embera House offers full wheelchair accessibility, elevator access to the Garden Terrace and Private Salon, and dedicated accessible facilities.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
