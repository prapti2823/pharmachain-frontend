// Demo data for testing the frontend without backend

export const demoMedicines = [
  {
    medicine_id: 1,
    medicine_name: "Paracetamol 500mg",
    manufacturer: "ABC Pharma Ltd",
    batch_number: "PAR2024001",
    expiry_date: "2025-12-31",
    ingredients: "Paracetamol, Starch, Magnesium Stearate",
    usage: "Take 1-2 tablets every 4-6 hours as needed",
    storage: "Store below 25°C",
    quantity_manufactured: 1000,
    blockchain_hash: "0x1a2b3c4d5e6f7890abcdef1234567890",
    qr_code_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    image_url: "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Paracetamol",
    ai_validation: {
      status: "valid",
      confidence: 95,
      analysis: "All parameters within acceptable ranges"
    },
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    medicine_id: 2,
    medicine_name: "Amoxicillin 250mg",
    manufacturer: "XYZ Pharmaceuticals",
    batch_number: "AMX2024002",
    expiry_date: "2025-06-30",
    ingredients: "Amoxicillin, Lactose, Cellulose",
    usage: "Take as prescribed by physician",
    storage: "Store in cool, dry place",
    quantity_manufactured: 500,
    blockchain_hash: "0x9876543210fedcba0987654321abcdef",
    qr_code_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    image_url: "https://via.placeholder.com/300x200/059669/FFFFFF?text=Amoxicillin",
    ai_validation: {
      status: "valid",
      confidence: 88,
      analysis: "Minor packaging variations detected but within tolerance"
    },
    created_at: "2024-01-14T14:20:00Z"
  }
];

export const demoVerificationResult = {
  status: "completed",
  verification_result: {
    status: "verified",
    trust_level: "trusted",
    confidence: 85,
    trust_score: 85,
    ai_decision: "ACCEPT"
  },
  qr_data: {
    medicine_id: 1,
    batch_number: "PAR2024001"
  },
  medicine_details: {
    medicine_name: "Paracetamol 500mg",
    manufacturer: "ABC Pharma Ltd",
    batch_number: "PAR2024001",
    expiry_date: "2025-12-31",
    ingredients: "Paracetamol, Starch, Magnesium",
    quantity_manufactured: 1000,
    image_url: "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Paracetamol",
    blockchain_hash: "0x1a2b3c4d5e6f7890abcdef1234567890"
  },
  blockchain_verification: {
    blockchain_verified: true,
    database_match: true,
    medicine_found: true,
    hash_match: true
  },
  image_matching: {
    match_score: 0.85,
    similarity: "high",
    match_confidence: 85,
    ai_analysis: "Package images match with high confidence. No signs of tampering detected."
  },
  recommendations: [
    "Medicine verified as authentic",
    "Safe to dispense"
  ]
};

export const demoWatchdogAlerts = [
  {
    id: 1,
    type: "duplicate_qr",
    level: "Warning",
    message: "Duplicate QR code detected for batch PAR2024001",
    timestamp: new Date().toISOString(),
    details: "QR code scanned from 2 different locations within 5 minutes"
  },
  {
    id: 2,
    type: "time_anomaly",
    level: "Safe",
    message: "Normal scanning pattern detected",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    details: "All QR scans within expected timeframes"
  },
  {
    id: 3,
    type: "image_integrity",
    level: "Critical",
    message: "Image tampering detected in batch XYZ2024005",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    details: "Original image hash does not match current package image"
  }
];

// Demo QR data (encrypted format)
export const demoQRData = "gAAAAABh5x2yK8J9X2mN4P7qR5sT8vW1Z3bC6dF9gH2jK5lM8nP0qS3tU6wX9yA2bE5fH8iL1mO4pR7sU0vY3zA6cF9hI2kN5oQ8rT1uW4xZ7aB0dG3fJ6iL9mP2sV5yB8eH1kN4oR7tU0wX3zA6cF9hI2lO5qS8vW1Z4bE7gJ0kN3pR6sU9yC2fH5iL8mP1qT4wX7zA0dG3gJ6kN9oR2sV5yB8eH1lO4pS7tU0wX3zA6cF9hI2mN5qR8vW1Z4bE7gJ0kN3pS6tU9yC2fH5iL8mP1qT4wX7zA0dG3gJ6lO9oR2sV5yB8eH1mN4pS7tU0wX3zA6cF9hI2kN5qR8vW1Z4bE7gJ0lO3pS6tU9yC2fH5iL8mP1qT4wX7zA0dG3gJ6mN9oR2sV5yB8eH1kN4pS7tU0wX3zA6cF9hI2lO5qR8vW1Z4bE7gJ0kN3pS6tU9yC2fH5iL8mP1qT4wX7zA0dG3gJ6mN9oR2sV5yB8eH1lO4pS7tU0wX3zA6cF9hI2kN5qR8vW1Z4bE7gJ0lO3pS6tU9yC2fH5iL8mP1qT4wX7zA0dG3gJ6mN9oR2sV5yB8eH1kN4pS7tU0wX3zA6cF9hI2lO5qR8vW1Z4bE7gJ0kN3pS6tU9yC2fH5iL8mP1qT4wX7zA0dG3gJ6mN9oR2sV5yB8eH1lO4pS7tU0wX3zA6cF9hI2kN5qR8vW1Z4bE7gJ0lO3pS6tU9yC2fH5iL8mP1qT4wX7zA0dG3gJ6mN9oR2sV5yB8eH";

// Function to simulate API delay
export const simulateApiDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};