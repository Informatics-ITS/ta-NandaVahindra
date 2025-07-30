const { clearAllCache } = require("../utils/cacheUtils");
// const { clearAllCache } = require("../utils/newCacheService");

// Clear all cache data
const clearCache = (req, res) => {
    clearAllCache();
    res.status(200).send("Cache cleared");
};

module.exports = clearCache;