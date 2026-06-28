@echo off
set /a count=0
:loop
set /a count+=1
docker info >nul 2>&1
if %errorlevel%==0 (
  echo DOCKER_READY
  exit /b 0
)
if %count% geq 40 (
  echo DOCKER_TIMEOUT
  exit /b 1
)
ping 127.0.0.1 -n 4 >nul
goto loop