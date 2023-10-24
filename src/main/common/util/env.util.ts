import fs from 'fs'
import path from 'path'

export function loadEnvVars() {
  const envFilePath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envFilePath)) {
    const envVars = fs.readFileSync(envFilePath, 'utf8').split('\n');
    for (const envVar of envVars) {
      const [key, value] = envVar.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  }
}
