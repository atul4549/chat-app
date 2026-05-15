import config from "../config/index.js";

/**
 * Print server startup information
 */
export const printStartupInfo = () => {
    const protocol = config.https ? 'https' : 'http';
    const baseUrl = `${protocol}://${config.host || 'localhost'}:${config.port}`;
    
    console.log(`
    ═══════════════════════════════════════════════════════
    🚀 Server Started Successfully!
    ═══════════════════════════════════════════════════════
    ✅ Environment:     ${config.node_env || 'development'}
    ✅ Port:           ${config.port}
    ✅ Base URL:       ${baseUrl}
    ✅ Health Check:   ${baseUrl}/api/health
    ✅ Root Endpoint:  ${baseUrl}/
    ✅ Time:           ${new Date().toISOString()}
    ═══════════════════════════════════════════════════════
    `);
};
