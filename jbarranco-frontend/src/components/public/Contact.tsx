import { useContactForm } from "./contact/hooks/useContactForm";
import { ContactForm } from "./contact/components/ContactForm";
import { ContactInfo } from "./contact/components/ContactInfo";

const Contact: React.FC = () => {
  const {
    formData,
    sending,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
  } = useContactForm();

  return (
    <div className="bg-white flex flex-col justify-start py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-brand-blue">
            Contacto
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Estamos aquí para ayudarte. Hablemos.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <div>
            <ContactForm
              formData={formData}
              sending={sending}
              onChange={handleChange}
              onCheckboxChange={handleCheckboxChange}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Información de Contacto */}
          <ContactInfo />
        </div>
      </div>
    </div>
  );
};

export default Contact;
