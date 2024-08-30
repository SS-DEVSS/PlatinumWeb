export const EmailTemplate = ({ firstName, email, telefono, mensaje }) => (
  <div>
    <h1>Te contacto, {firstName}!</h1>
    <p>Su correo es {email}</p>
    <p>Su teléfono es {telefono}</p>
    <p>Su mensaje es {mensaje}</p>
  </div>
);
