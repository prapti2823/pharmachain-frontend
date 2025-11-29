# 🐕 Watchdog AI Agent - Frontend Integration Guide

## 🚀 **Overview**
The Watchdog AI Agent continuously monitors your pharmaceutical supply chain for fraud, anomalies, and security issues. It provides real-time alerts via API endpoints.

---

## 📡 **API Endpoints**

### **1. Start Monitoring**
```http
POST /watchdog/start-monitoring
```
**Response:**
```json
{
  "status": "Watchdog monitoring started"
}
```

### **2. Get Status & Last Scan**
```http
GET /watchdog/status
```
**Response:**
```json
{
  "monitoring": true,
  "total_alerts": 15,
  "last_scan": {
    "timestamp": "2024-01-15T14:30:00",
    "duplicate_qrs": [],
    "image_issues": [
      {
        "alert_type": "image_missing",
        "severity": "medium",
        "message": "Image missing for medicine 12",
        "medicine_id": 12,
        "medicine_name": "Aspirin 100mg",
        "timestamp": "2024-01-15T14:30:00"
      }
    ],
    "blockchain_alerts": [
      {
        "alert_type": "quantity_mismatch",
        "severity": "high",
        "message": "Quantity mismatch - DB: 45, Blockchain: 38",
        "db_count": 45,
        "blockchain_count": 38,
        "timestamp": "2024-01-15T14:30:00"
      }
    ],
    "total_alerts": 2
  }
}
```

### **3. Get All Alerts**
```http
GET /watchdog/alerts
```
**Response:**
```json
{
  "alerts": [
    {
      "alert_type": "duplicate_qrs",
      "severity": "high",
      "message": "3 duplicate QR codes detected",
      "count": 3,
      "timestamp": "2024-01-15T14:25:00"
    },
    {
      "alert_type": "rapid_registrations",
      "severity": "medium",
      "message": "5 rapid registrations detected (possible bot activity)",
      "count": 5,
      "timestamp": "2024-01-15T14:28:00"
    }
  ],
  "total_count": 15
}
```

### **4. Get Latest Scan Results**
```http
GET /watchdog/alerts/latest
```
**Response:** Same as `last_scan` object from status endpoint

### **5. Clear All Alerts**
```http
DELETE /watchdog/alerts
```
**Response:**
```json
{
  "message": "All alerts cleared"
}
```

---

## 🚨 **Alert Types & Severity Levels**

### **Alert Types:**
- `duplicate_qrs` - Same QR code used multiple times
- `image_missing` - Medicine image not accessible
- `image_verification_failed` - Image check failed
- `blockchain_monitoring_failed` - Blockchain connection issues
- `quantity_mismatch` - Database vs blockchain count mismatch
- `duplicate_blockchain_hash` - Same hash found on blockchain
- `rapid_registrations` - Suspicious fast registrations

### **Severity Levels:**
- `critical` - Immediate action required
- `high` - Important security issue
- `medium` - Moderate concern
- `low` - Minor issue

---

## 💻 **Frontend Implementation Examples**

### **React/JavaScript Integration**

#### **1. Watchdog Status Component**
```jsx
import React, { useState, useEffect } from 'react';

const WatchdogStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchdogStatus();
    const interval = setInterval(fetchWatchdogStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchWatchdogStatus = async () => {
    try {
      const response = await fetch('/watchdog/status');
      const data = await response.json();
      setStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch watchdog status:', error);
      setLoading(false);
    }
  };

  const startMonitoring = async () => {
    try {
      await fetch('/watchdog/start-monitoring', { method: 'POST' });
      fetchWatchdogStatus();
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="watchdog-status">
      <h3>🐕 Watchdog AI Agent</h3>
      
      <div className="status-info">
        <p>Status: {status?.monitoring ? '🟢 Active' : '🔴 Inactive'}</p>
        <p>Total Alerts: {status?.total_alerts || 0}</p>
        
        {!status?.monitoring && (
          <button onClick={startMonitoring}>Start Monitoring</button>
        )}
      </div>

      {status?.last_scan && (
        <div className="last-scan">
          <h4>Last Scan: {new Date(status.last_scan.timestamp).toLocaleString()}</h4>
          <p>Total Issues Found: {status.last_scan.total_alerts}</p>
        </div>
      )}
    </div>
  );
};
```

#### **2. Alerts Dashboard Component**
```jsx
const AlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/watchdog/alerts');
      const data = await response.json();
      setAlerts(data.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const clearAlerts = async () => {
    try {
      await fetch('/watchdog/alerts', { method: 'DELETE' });
      setAlerts([]);
    } catch (error) {
      console.error('Failed to clear alerts:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6600';
      case 'medium': return '#ffaa00';
      case 'low': return '#00aa00';
      default: return '#666666';
    }
  };

  return (
    <div className="alerts-dashboard">
      <div className="header">
        <h3>🚨 Security Alerts</h3>
        <button onClick={clearAlerts}>Clear All</button>
      </div>

      {alerts.length === 0 ? (
        <p>✅ No alerts - System is secure</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div 
              key={index} 
              className="alert-item"
              style={{ borderLeft: `4px solid ${getSeverityColor(alert.severity)}` }}
            >
              <div className="alert-header">
                <span className="severity">{alert.severity.toUpperCase()}</span>
                <span className="timestamp">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="message">{alert.message}</p>
              <small className="type">Type: {alert.alert_type}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

#### **3. Real-time Alert Notifications**
```jsx
const AlertNotifications = () => {
  const [newAlerts, setNewAlerts] = useState([]);

  useEffect(() => {
    const checkForNewAlerts = async () => {
      try {
        const response = await fetch('/watchdog/alerts/latest');
        const data = await response.json();
        
        if (data.total_alerts > 0) {
          // Show notification for high/critical alerts
          const criticalAlerts = [
            ...data.duplicate_qrs.filter(a => a.severity === 'high'),
            ...data.blockchain_alerts.filter(a => a.severity === 'critical' || a.severity === 'high')
          ];
          
          if (criticalAlerts.length > 0) {
            setNewAlerts(criticalAlerts);
            // Show browser notification
            if (Notification.permission === 'granted') {
              new Notification('🚨 Security Alert', {
                body: `${criticalAlerts.length} critical security issues detected`,
                icon: '/alert-icon.png'
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to check alerts:', error);
      }
    };

    const interval = setInterval(checkForNewAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="alert-notifications">
      {newAlerts.map((alert, index) => (
        <div key={index} className="notification critical">
          🚨 {alert.message}
        </div>
      ))}
    </div>
  );
};
```

---

## 🎨 **CSS Styling Examples**

```css
.watchdog-status {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.alerts-dashboard {
  max-width: 800px;
  margin: 0 auto;
}

.alert-item {
  background: white;
  border-radius: 6px;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.severity {
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.notification.critical {
  background: #ff4444;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin: 5px 0;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
```

---

## 📱 **Mobile/React Native Integration**

```javascript
// Watchdog service for React Native
class WatchdogService {
  static async getStatus() {
    const response = await fetch(`${API_BASE_URL}/watchdog/status`);
    return response.json();
  }

  static async startMonitoring() {
    const response = await fetch(`${API_BASE_URL}/watchdog/start-monitoring`, {
      method: 'POST'
    });
    return response.json();
  }

  static async getAlerts() {
    const response = await fetch(`${API_BASE_URL}/watchdog/alerts`);
    return response.json();
  }
}

// Usage in React Native component
const WatchdogScreen = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    WatchdogService.getStatus().then(setStatus);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐕 Watchdog AI</Text>
      <Text>Status: {status?.monitoring ? '🟢 Active' : '🔴 Inactive'}</Text>
      <Text>Alerts: {status?.total_alerts || 0}</Text>
    </View>
  );
};
```

---

## 🔄 **Polling Strategy**

### **Recommended Polling Intervals:**
- **Status Check**: Every 30 seconds
- **Alert Check**: Every 60 seconds  
- **Dashboard Refresh**: Every 2 minutes

### **Efficient Polling:**
```javascript
class WatchdogPoller {
  constructor() {
    this.intervals = [];
  }

  startPolling() {
    // Status polling
    this.intervals.push(
      setInterval(() => this.checkStatus(), 30000)
    );
    
    // Alert polling
    this.intervals.push(
      setInterval(() => this.checkAlerts(), 60000)
    );
  }

  stopPolling() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }

  async checkStatus() {
    // Fetch and update status
  }

  async checkAlerts() {
    // Fetch and show new alerts
  }
}
```

---

## 🎯 **Integration Checklist**

- [ ] Add watchdog status widget to dashboard
- [ ] Implement alerts notification system
- [ ] Set up real-time polling for alerts
- [ ] Add alert severity color coding
- [ ] Implement alert clearing functionality
- [ ] Add browser notifications for critical alerts
- [ ] Create watchdog management page
- [ ] Test all alert types and responses
- [ ] Add loading states and error handling
- [ ] Style alerts according to severity levels

---

## 🚀 **Ready to Integrate!**

The Watchdog AI Agent now provides **complete API responses** for frontend integration. Build a secure, real-time monitoring dashboard! 🛡️