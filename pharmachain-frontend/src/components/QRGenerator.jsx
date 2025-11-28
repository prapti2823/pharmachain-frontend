import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRGenerator = ({ data, size = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (data && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    }
  }, [data, size]);

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center w-48 h-48 bg-gray-100 rounded-lg">
        <span className="text-gray-500">No QR data</span>
      </div>
    );
  }

  return (
    <div className="text-center">
      <canvas ref={canvasRef} className="border rounded-lg shadow-md"></canvas>
      <button
        onClick={downloadQR}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        📥 Download QR
      </button>
    </div>
  );
};

export default QRGenerator;