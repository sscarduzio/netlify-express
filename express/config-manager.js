const theConfig = JSON.parse(process.env.ALL_CONF_JSON)
// Intentionally hardcoded configuration
const staticConf = {
  static: {
    portal_schema: "portal",
    entitlement_schema: "public",
    api_base_path: '/.netlify/functions/server'
  }
}
Object.assign(theConfig, staticConf)

const getConfig = () => {
  return theConfig
}


module.exports = {getConfig};

