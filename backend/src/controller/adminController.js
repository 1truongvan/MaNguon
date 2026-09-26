import mongoose from "mongoose";

// Lấy thông tin kết nối MongoDB (an toàn - không expose credentials)
export const getMongoDBInfo = async (req, res) => {
  try {
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    const stateName = states[connectionState] || "unknown";
    const isConnected = connectionState === 1;

    // Lấy thông tin database
    const dbName = mongoose.connection.db?.databaseName || "N/A";
    const host = mongoose.connection.host || "N/A";
    const port = mongoose.connection.port || "N/A";

    // Lấy MONGO_URI nhưng ẩn credentials
    const mongoUri = process.env.MONGO_URI || "";
    let maskedUri = "Not configured";
    
    if (mongoUri) {
      // Mask credentials trong connection string
      // Format: mongodb://username:password@host:port/database
      try {
        const url = new URL(mongoUri);
        const maskedHost = url.hostname;
        const maskedPath = url.pathname;
        maskedUri = `${url.protocol}//***:***@${maskedHost}${maskedPath}`;
      } catch (err) {
        // Nếu không parse được URL, chỉ hiển thị một phần
        const parts = mongoUri.split("@");
        if (parts.length > 1) {
          maskedUri = `mongodb://***:***@${parts[1]}`;
        } else {
          maskedUri = mongoUri.substring(0, 20) + "...";
        }
      }
    }

    // Lấy số lượng collections
    let collectionsCount = 0;
    let collectionsList = [];
    if (isConnected && mongoose.connection.db) {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        collectionsCount = collections.length;
        collectionsList = collections.map(col => col.name);
      } catch (err) {
        console.error("Error getting collections:", err);
        // Fallback: thử cách khác
        try {
          const db = mongoose.connection.db;
          const adminDb = db.admin();
          const dbList = await adminDb.listDatabases();
          // Nếu không lấy được collections, để mảng rỗng
        } catch (fallbackErr) {
          console.error("Fallback error:", fallbackErr);
        }
      }
    }

    res.json({
      status: isConnected ? "connected" : "disconnected",
      state: stateName,
      isConnected,
      database: {
        name: dbName,
        host,
        port,
        collectionsCount,
        collections: collectionsList
      },
      connectionString: maskedUri, // Masked version
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: "Không thể lấy thông tin MongoDB",
      message: error.message,
      status: "error"
    });
  }
};

// Kiểm tra health của database
export const checkDatabaseHealth = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    
    if (!isConnected) {
      return res.status(503).json({
        healthy: false,
        status: "disconnected",
        message: "MongoDB không kết nối"
      });
    }

    // Thử ping database
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(503).json({
        healthy: false,
        status: "disconnected",
        message: "Database object không tồn tại"
      });
    }
    await db.admin().ping();
    
    res.json({
      healthy: true,
      status: "connected",
      message: "MongoDB hoạt động bình thường",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      healthy: false,
      status: "error",
      message: "Lỗi khi kiểm tra MongoDB",
      error: error.message
    });
  }
};

