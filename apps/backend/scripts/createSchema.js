#!/usr/bin/env node

/**
 * Predeploy script to create a branch-specific schema for PR environments
 * Usage: RAILWAY_GIT_BRANCH=<branch> node scripts/createSchema.js
 */

import mysql from "mysql2/promise";

const branch = process.env.RAILWAY_GIT_BRANCH;

if (!branch) {
  console.error("RAILWAY_GIT_BRANCH is not set!");
  process.exit(1);
}

const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_PORT),
};

const schemaName = branch.replace(/[^a-zA-Z0-9_]/g, "_");

async function main() {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${schemaName}\`;`);
    console.log(`✅ Schema ${schemaName} is ready`);

    await connection.end();
  } catch (err) {
    console.error("Error creating schema:", err);
    process.exit(1);
  }
}

main();
