const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/HP/Desktop/whatsflow-crm-dashboard-main/backend/node-api/src/routes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
    if (file === 'webhooks.ts' || file === 'auth.ts') return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('enforceTenancy')) {
        // Add import
        content = content.replace(
            /(import \{.*authenticateToken.*\} from '.*\/middleware\/auth';)/,
            "$1\nimport { enforceTenancy } from '../middleware/tenancy';"
        );

        // Add to router.use
        content = content.replace(
            /router\.use\(authenticateToken\);/g,
            "router.use(authenticateToken);\nrouter.use(enforceTenancy);"
        );

        // Add to inline route definitions
        content = content.replace(
            /, authenticateToken, async/g,
            ", authenticateToken, enforceTenancy, async"
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
