# About

Legal Tech is a web application that provides legal services to users. It is built with Next.js, Tailwind CSS, and
TypeScript.

## Getting Started

### Pre-hook commits

Install and configure husky and lint-staged to run prettier and eslint before each commit.

```shell
npm install --save-dev husky lint-staged
npx husky init
node --eval "fs.writeFileSync('.husky/pre-commit','npx lint-staged\n')"
```

Add the following to the package.json file

```json
{
  "lint-staged": {
    "**/*.{ts,tsx}": ["prettier --write .", "eslint --fix ."]
  }
}
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
