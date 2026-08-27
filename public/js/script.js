document.addEventListener('DOMContentLoaded', () => {

  // Página login.html registrar y avanzar a evento.html
  const nombreInput = document.getElementById('nombre');
  if (nombreInput) {
    const form = document.querySelector('main form');
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
  }

  // Página evento.html pasar el id hacia pago.html
  const btnPago = document.getElementById('btnPago');
  if (btnPago) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      btnPago.href = `pago.html?id=${id}`;
    }
  }

  // Página pago.html, al confirmar ir al ticket
  const ubicacionInput = document.getElementById('ubicacion');
  if (ubicacionInput) {
    const formPago = document.querySelector('main form');
    formPago.addEventListener('submit', (e) => {
      e.preventDefault();
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      window.location.href = `ticket.html?id=${id}`;
    });
  }

  // Página ticket.html mostrar el QR
  const qrImg = document.getElementById('qrImg');
  if (qrImg) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      qrImg.src = `/api/registro/${id}/qr`;
    }
  }

});