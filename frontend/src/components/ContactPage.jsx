import { useState } from "react";
import { contactPageStyles as cps } from "../assets/dummyStyles";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  SendHorizonal,
  Stethoscope,
  User,
} from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const ContactPage = () => {
  // custom web page title
  usePageTitle("Contact Us");

  const initial = {
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const departments = [
    "General Physician",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Gynecology",
  ];

  const servicesMapping = {
    "General Physician": [
      "General Consultation",
      "Adult Checkup",
      "Vaccination",
      "Health Screening",
    ],
    Cardiology: [
      "ECG",
      "Echocardiography",
      "Stress Test",
      "Heart Consultation",
    ],
    Orthopedics: ["Fracture Care", "Joint Pain Consultation", "Physiotherapy"],
    Dermatology: ["Skin Consultation", "Allergy Test", "Acne Treatment"],
    Pediatrics: ["Child Checkup", "Vaccination (Child)", "Growth Monitoring"],
    Gynecology: ["Antenatal Care", "Pap Smear", "Ultrasound"],
  };

  const genericServices = [
    "General Consultation",
    "ECG",
    "Blood Test",
    "X-Ray",
    "Ultrasound",
    "Physiotherapy",
    "Vaccination",
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      e.phone = "Phone number must be exactly 10 digits";

    if (!form.department && !form.service) {
      e.department = "Please choose a department or service";
      e.service = "Please choose a department or service";
    }

    if (!form.message.trim()) e.message = "Please write a short message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      setForm((prev) => ({ ...prev, department: value, service: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === "department" || name === "service") {
      setErrors((prev) => {
        const copy = { ...prev };
        if (
          (name === "department" && value) ||
          (name === "service" && value) ||
          form.department ||
          form.service
        ) {
          delete copy.department;
          delete copy.service;
        }
        return copy;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const text = `*Contact Request*\nName: ${form.name}\nEmail: ${
      form.email
    }\nPhone: ${form.phone}\nDepartment: ${
      form.department || "N/A"
    }\nService: ${form.service || "N/A"}\nMessage: ${form.message}`;

    const url = `https://wa.me/8299431275?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    setForm(initial);
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const availableServices = form.department
    ? servicesMapping[form.department] || []
    : genericServices;

  return (
    <div className={`${cps.pageContainer}`}>
      <div className={`${cps.bgAccent1}`}></div>
      <div className={`${cps.bgAccent2}`}></div>

      <div className={`${cps.gridContainer}`}>
        <div className={`${cps.formContainer}`}>
          <h2 className={`${cps.formTitle}`}>Contact Us</h2>
          <p className={`${cps.formSubtitle}`}>
            We'd love to hear from you! Fill out the form below and we'll get
            back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className={`${cps.formSpace}`}>
            <div className={`${cps.formGrid}`}>
              <div>
                <label className={`${cps.label}`}>
                  <User size={16} /> Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`${cps.input}`}
                />
                {errors.name && <p className={`${cps.error}`}>{errors.name}</p>}
              </div>
              <div>
                <label className={`${cps.label}`}>
                  <Mail size={16} /> Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`${cps.input}`}
                />
                {errors.email && (
                  <p className={`${cps.error}`}>{errors.email}</p>
                )}
              </div>
            </div>
            <div className={`${cps.formGrid}`}>
              <div>
                <label className={`${cps.label}`}>
                  <Phone size={16} /> Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={`${cps.input}`}
                  maxLength="10"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className={`${cps.error}`}>{errors.phone}</p>
                )}
              </div>

              <div>
                <label className={`${cps.label}`}>
                  <MapPin size={16} /> Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={`${cps.select}`}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className={`${cps.error}`}>{errors.department}</p>
                )}
              </div>
            </div>

            <div>
              <label className={`${cps.label}`}>
                <Stethoscope size={16} /> Service
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className={`${cps.select}`}
              >
                <option value="">
                  Select Service or choose a department first...
                </option>
                {availableServices.map((service, idx) => (
                  <option key={idx} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className={`${cps.error}`}>{errors.service}</p>
              )}
            </div>

            <div>
              <label className={`${cps.label}`}>
                <MessageSquare size={16} /> Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Describe your queries..."
                rows={4}
                className={`${cps.textarea} resize-none google-sans-400`}
              />

              {errors.message && (
                <p className={`${cps.error}`}>{errors.message}</p>
              )}
            </div>

            <div className={`${cps.buttonContainer}`}>
              <button type="submit" className={`${cps.button}`}>
                <SendHorizonal size={18} />
                <span>Send via WhatsApp</span>
              </button>

              {sent && (
                <p className={`${cps.sentMessage}`}>
                  Opening WhatsApp & clearing form...
                </p>
              )}
            </div>
          </form>
        </div>
        {/* Right side info panel */}
        <div className={cps.infoContainer}>
          {/* Contact Info Card */}
          <div className={cps.infoCard}>
            <h3 className={cps.infoTitle} style={{ color: "#065f46" }}>
              Get in Touch
            </h3>
            <p className={cps.infoText} style={{ color: "#047857" }}>
              Reach us through any of the channels below.
            </p>
            <div className={cps.infoItem} style={{ color: "#065f46" }}>
              <Phone size={16} /> +91 82994 31275
            </div>
            <div className={cps.infoItem} style={{ color: "#065f46" }}>
              <Mail size={16} /> contact@caresync.com
            </div>
            <div className={cps.infoItem} style={{ color: "#065f46" }}>
              <MapPin size={16} /> 123 Health Street, Your City
            </div>
          </div>

          {/* Hours Card */}
          <div className={cps.hoursContainer}>
            <h4 className={cps.hoursTitle} style={{ color: "#065f46" }}>
              Working Hours
            </h4>
            <p className={cps.hoursText}>Mon – Sat: 9:00 AM – 7:00 PM</p>
            <p className={cps.hoursText}>Sunday: 10:00 AM – 2:00 PM</p>
          </div>

          {/* Map */}
          <iframe
            className={cps.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20855.505948700913!2d88.38254839601929!3d22.475372713898803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0271652e763a03%3A0x93ab7f119f9d152b!2sPeerless%20Hospital!5e0!3m2!1sen!2sin!4v1779724431067!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Clinic Location"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
