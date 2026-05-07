export const EmailTemplate = ({ firstName, email, telefono, mensaje }) => {
  return `
    Te contacto, ${firstName}!
    Su correo es ${email}
    Su telefono es ${telefono}
    Su mensaje es ${mensaje}
  `;
};
