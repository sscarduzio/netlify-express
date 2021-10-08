const theConfig = JSON.parse(process.env.ALL_CONF_JSON)
// Intentionally hardcoded configuration
const staticConf = {
  static: {
    db_schema: "portal"
  }
}

const getConfig = () => {
  return Object.assign(staticConf, theConfig)
}


module.exports = {getConfig};

