@echo off
REM Script pour builder et déployer un projet Node.js sur GitHub Pages

echo *** Build du projet ***
npm run build
if errorlevel 1 (
  echo Erreur lors du build, arrêt du script.
  exit /b 1
)

echo.
echo *** Déploiement sur GitHub Pages ***
npm run deploy
if errorlevel 1 (
  echo Erreur lors du déploiement, arrêt du script.
  exit /b 1
)

echo.
echo Build et déploiement terminés avec succès !
pause
