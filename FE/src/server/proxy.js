const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware quan trọng
app.use(cors());
app.use(express.json());

// Route proxy
app.get('/api/streets', async (req, res) => {
  try {
    const { district } = req.query;
    
    // THAY THẾ BẰNG TOKEN THẬT CỦA BẠN
    const GHTK_API_TOKEN = 'Token1234567890abcdef'; 
    
    const response = await axios.get(
      `https://services.giaohangtietkiem.vn/services/shipment/street?district=${district}`,
      {
        headers: {
          'Token': GHTK_API_TOKEN
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: error.message,
      fullError: JSON.stringify(error.response?.data) 
    });
  }
});

// Khởi động server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/streets?district=26`);
});