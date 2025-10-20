# Publishing Guide for create-saas-app-a1x6

This guide contains the remaining steps to publish your npm package.

## ✅ Completed Steps (1-3)

- ✅ **Step 1**: Created `create-saas-app-a1x6/` folder
- ✅ **Step 2**: Created `package.json` with CLI configuration
- ✅ **Step 3**: Created `index.js` CLI script

---

## 📋 Remaining Steps

### **Step 4: Copy Template Files**

Copy your entire `saas-complete` folder into the `template/` directory:

```bash
# From saas-template directory:
cd create-saas-app-a1x6
mkdir template
cp -r ../saas-complete/* template/

# Remove files that shouldn't be published:
rm -rf template/node_modules
rm -rf template/.next
rm -f template/.env.local
rm -f template/pnpm-lock.yaml
```

**Keep these files:**
- ✅ `.env.example`
- ✅ `.gitignore`
- ✅ All source code (app/, lib/, components/, etc.)
- ✅ `README.md`
- ✅ `package.json`

**Remove these:**
- ❌ `node_modules/`
- ❌ `.next/`
- ❌ `.env.local`
- ❌ `pnpm-lock.yaml`
- ❌ `.git/` (if exists)

---

### **Step 5: Create `.npmignore`**

Create `.npmignore` file in `create-saas-app-a1x6/`:

```
# Don't publish these from template
template/node_modules
template/.next
template/.env.local
template/pnpm-lock.yaml
template/.git

# Development files
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

### **Step 6: Create Package README**

Create `README.md` in `create-saas-app-a1x6/`:

```markdown
# create-saas-app-a1x6

Create a production-ready personal SaaS with Next.js, Supabase, and Stripe in seconds.

## Quick Start

```bash
npx create-saas-app-a1x6 my-awesome-saas
cd my-awesome-saas
```

## What's Included

- 🔐 Supabase Authentication (PKCE flow)
- 💳 Stripe Subscriptions (checkout, webhooks, portal)
- 📊 Auto-generated pricing pages
- 🗄️ PostgreSQL + Drizzle ORM
- 📝 Activity logging
- 🎨 shadcn/ui + Tailwind CSS
- 🚀 Next.js 15 (App Router, Server Actions)

## Setup

After creating your project:

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials
3. Add your Stripe credentials
4. Run `pnpm db:push`
5. Run `pnpm stripe:sync`
6. Run `pnpm dev`

Check the generated README.md for detailed instructions.

## License

MIT
```

---

### **Step 7: Install Dependencies Locally**

Before publishing, install the CLI dependencies:

```bash
cd create-saas-app-a1x6
npm install
```

This installs:
- `chalk` - Terminal colors
- `fs-extra` - File operations
- `ora` - Loading spinners

---

### **Step 8: Test Locally**

Test your CLI before publishing:

```bash
# In create-saas-app-a1x6 directory:
npm link

# Then in any test directory:
cd ..
npx create-saas-app-a1x6 test-project

# Verify it works:
cd test-project
ls -la
pnpm dev
```

If it works, unlink:
```bash
npm unlink -g create-saas-app-a1x6
```

---

### **Step 9: Check Package Name Availability**

Before publishing, check if the name is available on npm:

```bash
npm search create-saas-app-a1x6
```

If taken, you'll need to either:
- Use a different name (update `package.json`)
- Use a scoped package: `@yourusername/create-saas-app-a1x6`

To use scoped package:
```json
{
  "name": "@yourusername/create-saas-app-a1x6",
  "bin": {
    "create-saas-app-a1x6": "./index.js"
  }
}
```

---

### **Step 10: Create npm Account**

If you don't have an npm account:

1. Go to [npmjs.com](https://www.npmjs.com/signup)
2. Sign up
3. Verify your email

Then login via CLI:
```bash
npm login
```

Enter your:
- Username
- Password
- Email

---

### **Step 11: Publish to npm**

Ready to publish? Run:

```bash
# Make sure you're in create-saas-app-a1x6 directory
cd create-saas-app-a1x6

# Publish!
npm publish

# If using scoped package and want it public:
npm publish --access public
```

**You should see:**
```
+ create-saas-app-a1x6@1.0.0
```

---

### **Step 12: Test Published Package**

Test that the published package works:

```bash
# In any directory:
npx create-saas-app-a1x6@latest my-final-test
cd my-final-test
pnpm dev
```

---

## 🔄 Updating Your Package

When you make changes to the template:

### **1. Update the template files**
```bash
# Copy updated files from saas-complete to template/
cd create-saas-app-a1x6
rm -rf template
mkdir template
cp -r ../saas-complete/* template/
# Clean up again
rm -rf template/node_modules template/.next template/.env.local template/pnpm-lock.yaml
```

### **2. Bump version**
```bash
# Patch (1.0.0 → 1.0.1) - Bug fixes
npm version patch

# Minor (1.0.0 → 1.1.0) - New features
npm version minor

# Major (1.0.0 → 2.0.0) - Breaking changes
npm version major
```

### **3. Publish update**
```bash
npm publish
```

---

## 📦 Package Structure

After completion, your structure should be:

```
create-saas-app-a1x6/
├── package.json              # CLI package config
├── index.js                  # CLI script
├── .npmignore               # Files to exclude from npm
├── README.md                # Package documentation
├── PUBLISHING_GUIDE.md      # This file
├── node_modules/            # CLI dependencies (after npm install)
└── template/                # Your saas-complete template
    ├── app/
    ├── lib/
    ├── components/
    ├── package.json
    ├── README.md
    └── ... (all files from saas-complete)
```

---

## 🚨 Important Checklist Before Publishing

- [ ] Template folder contains all necessary files
- [ ] No `node_modules/` in template
- [ ] No `.env.local` in template (only `.env.example`)
- [ ] No sensitive data or API keys
- [ ] `.npmignore` is configured
- [ ] Package name is available on npm
- [ ] Tested locally with `npm link`
- [ ] README.md for package is created
- [ ] Version number is correct in package.json
- [ ] Repository URL is correct

---

## 🎯 After Publishing

Users can install and use your package:

```bash
npx create-saas-app-a1x6 my-saas
```

You can view your package at:
```
https://www.npmjs.com/package/create-saas-app-a1x6
```

---

## 💡 Optional Enhancements

### Add Interactive Prompts

Install `inquirer`:
```bash
npm install inquirer
```

Update `index.js` to ask questions:
```javascript
const inquirer = require('inquirer');

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: 'What is your project name?',
    default: 'my-saas'
  },
  {
    type: 'confirm',
    name: 'installDeps',
    message: 'Install dependencies now?',
    default: true
  }
]);
```

### Add Git Initialization

In `index.js`, after copying files:
```javascript
execSync('git init', { cwd: targetDir });
execSync('git add .', { cwd: targetDir });
execSync('git commit -m "Initial commit from create-saas-app-a1x6"', { cwd: targetDir });
```

### Open in VS Code

At the end of `index.js`:
```javascript
try {
  execSync('code .', { cwd: targetDir });
  console.log(chalk.green('Opened in VS Code!'));
} catch {
  console.log(chalk.yellow('Could not open VS Code automatically'));
}
```

---

## 🐛 Troubleshooting

### "Package name already exists"
- Change the name in `package.json`
- Or use scoped package: `@yourusername/create-saas-app-a1x6`

### "Permission denied" on publish
- Run `npm login` again
- Check if you're logged in: `npm whoami`

### "ENOENT: no such file or directory, scandir 'template'"
- Make sure you completed Step 4 (copying template files)

### CLI not working after `npm link`
- Check that `index.js` has `#!/usr/bin/env node` at the top
- Make it executable: `chmod +x index.js` (Mac/Linux)

---

## 📞 Need Help?

- npm Documentation: https://docs.npmjs.com/
- Publishing packages: https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages
- Semantic Versioning: https://semver.org/

---

Good luck with your npm package! 🚀
