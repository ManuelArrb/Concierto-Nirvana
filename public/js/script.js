document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('main form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'No se pudo completar el registro');
        return;
      }

      window.location.href = `evento.html?id=${data.id}`;
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  });
});