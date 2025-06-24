#!/bin/bash

# DocMorph Deployment Script
# Built by Montfort Assogba

echo "🚀 Starting DocMorph deployment process..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Create .nojekyll file to bypass Jekyll processing
echo "📝 Creating .nojekyll file..."
touch out/.nojekyll

# Create CNAME file if you have a custom domain (optional)
# echo "your-domain.com" > out/CNAME

echo "📁 Static files generated in 'out' directory"
echo "📋 Files ready for deployment:"
ls -la out/

echo "🎉 Deployment preparation complete!"
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Copy all files from 'out' directory to your gh-pages branch"
echo "2. Or use: npx gh-pages -d out"
echo "3. Or manually upload files to your hosting provider"
echo ""
echo "📱 Your app will be available at:"
echo "https://your-username.github.io/docmorph/"
