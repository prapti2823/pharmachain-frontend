export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTrustScore = (score) => {
  if (score >= 80) return { color: 'text-green-600', bg: 'bg-green-100', label: 'High' };
  if (score >= 60) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium' };
  return { color: 'text-red-600', bg: 'bg-red-100', label: 'Low' };
};

export const getDecisionColor = (decision) => {
  switch (decision) {
    case 'ACCEPT': return 'text-green-600 bg-green-100';
    case 'REVIEW': return 'text-yellow-600 bg-yellow-100';
    case 'REJECT': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getAlertColor = (level) => {
  switch (level) {
    case 'Safe': return 'text-green-600 bg-green-100';
    case 'Warning': return 'text-yellow-600 bg-yellow-100';
    case 'Critical': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const truncateHash = (hash, length = 10) => {
  if (!hash) return 'N/A';
  return `${hash.substring(0, length)}...${hash.substring(hash.length - 6)}`;
};