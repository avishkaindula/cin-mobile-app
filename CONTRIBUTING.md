# 🌍 Contributing to Climate Intelligence Network

Thank you for your interest in contributing to the **Climate Intelligence Network (CIN)** open-source projects. We're building technology to empower climate action, and we welcome your ideas, code, and support.

This guide will walk you through the process of contributing — from setting up your local environment to opening your first pull request.

---

## 📜 Code of Conduct

We are committed to creating a welcoming and respectful environment for everyone. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## 🚀 How to Contribute

### 1. Fork the Repository

Start by forking the repository:

- Click the **Fork** button at the top-right of the repository page.
- Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME
```

---

### 2. Create a New Branch

We follow a protected branching strategy. You **should not** push changes directly to `main` or `dev`.

- `main` – Stable, production-ready code.
- `dev` – Integrates all feature/fix branches before being merged into `main`.
- `feat/*` – New feature branches.
- `fix/*` – Bug fix branches.

To start contributing:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature-name
```

Use a descriptive branch name based on what you're working on.

---

### 3. Make Your Changes

- Follow the existing code style.
- Write clear, readable, and maintainable code.
- Add comments and tests where applicable.
- Keep each pull request focused on a single change or topic.

---

### 4. Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages:

```bash
git add .
git commit -m "feat: add temperature anomaly chart"
```

---

### 5. Push and Open a Pull Request

Push your changes to your fork:

```bash
git push origin feat/your-feature-name
```

Then open a pull request **against the `dev` branch** in the original repository.

In your pull request:

- Provide a clear title and description.
- Link related issues with `Closes #issue_number`.
- Describe your changes and any testing done.
- Request reviews from maintainers.

---

## 🧠 Branching Strategy

```text
main  ← Protected, stable branch for production
│
└── dev  ← Protected, integration branch for development
     ├── feat/new-feature
     └── fix/bug-fix
```

> All features and fixes must be developed in their own branch and opened as a PR into `dev`. Direct commits to `main` and `dev` are not allowed.

---

## ✅ Coding Guidelines

- Maintain consistent formatting (use Prettier or defined linters).
- Avoid large PRs; keep them atomic and focused.
- Use TypeScript where applicable.
- Include tests for new components, functions, or utilities.
- Comment complex logic.
- Ensure builds and tests pass before submitting a PR.

---

## 🐛 Reporting Issues

If you find a bug or want to suggest a feature:

1. Go to the [Issues](../../issues) tab.
2. Choose the appropriate template.
3. Provide a clear and descriptive title.
4. Include steps to reproduce (for bugs).
5. Share screenshots or logs if helpful.

We also tag beginner-friendly issues with `good first issue` and `help wanted`.

---

## 🔐 Security Policy

If you discover a security vulnerability, please *do not* open a public issue.

Instead, email us at [team@theclimateintel.org](mailto:team@theclimateintel.org) or contact a maintainer directly.

---

## 💬 Questions or Help?

Need support or clarification?

- Start a discussion in the GitHub issues or discussion tab.
- Join our contributor Slack (link TBA).
- Tag a maintainer in your PR.

---

## 🙌 Thank You

Your contributions make this project — and our collective climate impact — possible. Whether you’re fixing bugs, adding features, improving documentation, or sharing feedback, you are helping build a better future.

Together, we code for climate. 🌱

—
*The Climate Intelligence Network Maintainers*
