#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

// Get project name from command line argument
const projectName = process.argv[2];

if (!projectName) {
  console.error(chalk.red('❌ Please specify the project name:'));
  console.log(chalk.cyan('  npx create-saas-app-a1x6 my-saas'));
  process.exit(1);
}

// Paths
const templateDir = path.join(__dirname, 'template');
const targetDir = path.join(process.cwd(), projectName);

// Check if directory already exists
if (fs.existsSync(targetDir)) {
  console.error(chalk.red(`❌ Directory "${projectName}" already exists!`));
  process.exit(1);
}

console.log(chalk.bold('\n🚀 Creating your SaaS application...\n'));

// Step 1: Copy template
const copySpinner = ora('Copying template files...').start();
try {
  fs.copySync(templateDir, targetDir);
  copySpinner.succeed('Template files copied');
} catch (error) {
  copySpinner.fail('Failed to copy template');
  console.error(error);
  process.exit(1);
}

// Step 2: Update package.json with project name
const pkgSpinner = ora('Updating package.json...').start();
try {
  const pkgPath = path.join(targetDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  pkgSpinner.succeed('Package.json updated');
} catch (error) {
  pkgSpinner.fail('Failed to update package.json');
  console.error(error);
  process.exit(1);
}

// Step 3: Install dependencies
console.log(chalk.cyan('\n📦 Installing dependencies (this may take a few minutes)...\n'));
try {
  execSync('pnpm install', {
    cwd: targetDir,
    stdio: 'inherit'
  });
  console.log(chalk.green('✅ Dependencies installed\n'));
} catch (error) {
  console.log(chalk.yellow('⚠️  Failed to install with pnpm, trying npm...\n'));
  try {
    execSync('npm install', {
      cwd: targetDir,
      stdio: 'inherit'
    });
    console.log(chalk.green('✅ Dependencies installed\n'));
  } catch (npmError) {
    console.error(chalk.red('❌ Failed to install dependencies'));
    console.log(chalk.yellow('Please run "npm install" manually inside the project folder'));
  }
}

// Success message
console.log(chalk.bold.green('✨ Success! Your SaaS is ready!\n'));
console.log(chalk.cyan('Next steps:\n'));
console.log(chalk.white(`  1. cd ${projectName}`));
console.log(chalk.white('  2. Copy .env.example to .env.local and add your credentials'));
console.log(chalk.white('  3. Set up Supabase: https://supabase.com'));
console.log(chalk.white('  4. Set up Stripe: https://stripe.com'));
console.log(chalk.white('  5. Run: pnpm db:push'));
console.log(chalk.white('  6. Run: pnpm stripe:sync'));
console.log(chalk.white('  7. Run: pnpm dev\n'));
console.log(chalk.gray('Check the README.md for detailed setup instructions.\n'));
