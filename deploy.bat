@echo off
REM DocMorph Deployment Script for Windows
REM Built by Montfort Assogba

echo 🚀 Starting DocMorph deployment process...

REM Build the application
echo 📦 Building application...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build completed successfully!

REM Create .nojekyll file to bypass Jekyll processing
echo 📝 Creating .nojekyll file...
echo. > out\.nojekyll

REM Create CNAME file if you have a custom domain (optional)
REM echo your-domain.com > out\CNAME

echo 📁 Static files generated in 'out' directory
echo 📋 Files ready for deployment:
dir out\

echo 🎉 Deployment preparation complete!
echo.
echo To deploy to GitHub Pages:
echo 1. Copy all files from 'out' directory to your gh-pages branch
echo 2. Or use: npx gh-pages -d out
echo 3. Or manually upload files to your hosting provider
echo.
echo 📱 Your app will be available at:
echo https://your-username.github.io/docmorph/
