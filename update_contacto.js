const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Contacto.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the simulated submission with actual API call
const oldCode = `    setIsSubmitting(true);

    // Simular envío (aquí integrarías tu backend o servicio de email)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Formulario enviado:', formData);

      setSubmitMessage('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
      setFormData({
        name: '',
        email: '',
        service: 'General',
        message: '',
      });
      setErrors({});

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);

    } catch (error) {
      setSubmitMessage('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }`;

const newCode = `    setIsSubmitting(true);

    // Send to backend API
    try {
      const { submitContact } = await import('../utils/api');
      const response = await submitContact(formData);

      if (response.success) {
        setSubmitMessage(response.message);
        setFormData({
          name: '',
          email: '',
          service: 'consultoria',
          message: '',
        });
        setErrors({});

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitMessage(response.message || 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
      }

    } catch (error) {
      console.error('Error submitting contact:', error);
      setSubmitMessage('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Contacto.jsx updated successfully!');
