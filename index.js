#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const prompts = require('prompts');
const glob = require('glob');

// Get project name from command line argument
const projectName = process.argv[2];

if (!projectName) {
  console.error(chalk.red('❌ Please specify the project name:'));
  console.log(chalk.cyan('  npx create-saas-app-ai-chat my-saas'));
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

// Step 3: Gather customization information
console.log(chalk.cyan('\n📝 Let\'s customize your app...\n'));

(async () => {
  const answers = await prompts([
    {
      type: 'text',
      name: 'appTagline',
      message: 'App tagline (optional):',
      initial: 'Multi-Model AI Chat Platform'
    },
    {
      type: 'text',
      name: 'appDescription',
      message: 'App description (optional):',
      initial: 'Production-ready AI SaaS template with Next.js, Supabase, Stripe, and OpenRouter. Access 15+ AI models through a unified interface.'
    },
    {
      type: 'text',
      name: 'supportEmail',
      message: 'Support email address:',
      initial: 'support@example.com',
      validate: email => /\S+@\S+\.\S+/.test(email) ? true : 'Please enter a valid email address'
    },
    {
      type: 'text',
      name: 'twitterUrl',
      message: 'Twitter/X URL (optional, leave empty to skip):',
      initial: ''
    },
    {
      type: 'text',
      name: 'linkedinUrl',
      message: 'LinkedIn URL (optional, leave empty to skip):',
      initial: ''
    },
    {
      type: 'text',
      name: 'githubUrl',
      message: 'GitHub URL (optional, leave empty to skip):',
      initial: ''
    }
  ]);

  // Step 4: Replace template variables
  const replaceSpinner = ora('Customizing template...').start();
  try {
    // Convert project name to Title Case
    const appName = projectName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // Template variable replacements
    const replacements = {
      '\\{\\{APP_NAME\\}\\}': appName,
      '\\{\\{APP_TAGLINE\\}\\}': answers.appTagline || 'Multi-Model AI Chat Platform',
      '\\{\\{APP_DESCRIPTION\\}\\}': answers.appDescription || 'Production-ready AI SaaS template with Next.js, Supabase, Stripe, and OpenRouter.',
      '\\{\\{APP_AUTHOR\\}\\}': appName,
      '\\{\\{SUPPORT_EMAIL\\}\\}': answers.supportEmail || 'support@example.com',
      '\\{\\{TWITTER_URL\\}\\}': answers.twitterUrl || '',
      '\\{\\{LINKEDIN_URL\\}\\}': answers.linkedinUrl || '',
      '\\{\\{GITHUB_URL\\}\\}': answers.githubUrl || '',
      '\\{\\{YEAR\\}\\}': new Date().getFullYear().toString(),
    };

    // Function to replace variables in a file
    const replaceInFile = (filePath) => {
      if (!fs.existsSync(filePath)) return;

      // Skip binary files and certain directories
      const ext = path.extname(filePath);
      const skipExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
      if (skipExts.includes(ext)) return;

      const relativePath = path.relative(targetDir, filePath);
      if (relativePath.startsWith('node_modules') ||
          relativePath.startsWith('.next') ||
          relativePath.startsWith('.git')) {
        return;
      }

      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        Object.entries(replacements).forEach(([key, value]) => {
          const regex = new RegExp(key, 'g');
          if (regex.test(content)) {
            content = content.replace(regex, value);
            modified = true;
          }
        });

        if (modified) {
          fs.writeFileSync(filePath, content, 'utf8');
        }
      } catch (error) {
        // Skip files that can't be read as text
      }
    };

    // Find all files that need processing
    const patterns = [
      '**/*.tsx',
      '**/*.ts',
      '**/*.json',
      '**/*.md',
      '**/*.js',
      '**/*.jsx'
    ];

    patterns.forEach(pattern => {
      const files = glob.sync(pattern, {
        cwd: targetDir,
        absolute: true,
        nodir: true,
        ignore: ['**/node_modules/**', '**/.next/**', '**/.git/**']
      });

      files.forEach(file => replaceInFile(file));
    });

    replaceSpinner.succeed('Template customized');
  } catch (error) {
    replaceSpinner.fail('Failed to customize template');
    console.error(error);
    process.exit(1);
  }

  // Step 5: Install dependencies
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
  console.log(chalk.white('  5. Set up OpenRouter: https://openrouter.ai'));
  console.log(chalk.white('  6. Run: pnpm db:push'));
  console.log(chalk.white('  7. Run: pnpm dev\n'));
  console.log(chalk.gray('Check the README.md for detailed setup instructions.\n'));
})();
