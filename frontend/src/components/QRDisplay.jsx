
function QRDisplay({ qrData }) {
  if (!qrData) {
    return null;
  }

  return (
    <section className="qr-container">
      <h3>QR del producto</h3>

      <p>
        Escaneá este código para acceder directamente a la página del producto.
      </p>

      <img
        src={qrData.qrCode}
        alt="Código QR del producto"
        className="qr-image"
      />

      <a
        href={qrData.qrCode}
        download={`qr-producto-${qrData.productId}.png`}
        className="qr-download"
      >
        Descargar QR
      </a>
    </section>
  );
}

export default QRDisplay;
