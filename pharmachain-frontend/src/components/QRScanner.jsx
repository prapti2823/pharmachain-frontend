import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning && scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-scanner",
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scanner.render(
        (decodedText) => {
          scanner.clear();
          setIsScanning(false);
          onScanSuccess(decodedText);
        },
        (error) => {
          onScanError && onScanError(error);
        }
      );

      return () => {
        scanner.clear();
      };
    }
  }, [isScanning, onScanSuccess, onScanError]);

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!isScanning ? (
        <div className="text-center">
          <button
            onClick={startScanning}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            📱 Start QR Scanner
          </button>
        </div>
      ) : (
        <div>
          <div id="qr-scanner" ref={scannerRef} className="w-full"></div>
          <button
            onClick={stopScanning}
            className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Stop Scanner
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;