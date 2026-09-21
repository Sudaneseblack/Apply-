name: Deploy Football App

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Check project files
        run: |
          echo "Project files:"
          ls -la

          test -f index.html
          test -f style.css
          test -f app.js

      - name: Prepare files
        run: |
          mkdir -p dist
          cp index.html dist/index.html
          cp style.css dist/style.css
          cp app.js dist/app.js

      - name: Verify JavaScript
        run: |
          test -s dist/app.js
          echo "app.js موجود بنجاح"
          echo "لا يوجد script.js مطلوب"

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          force_orphan: true
