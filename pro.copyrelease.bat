rem  *******************************************************
rem  *     DANIEL ELÍAS BAT DE GENERACION DE RELEASE       *
rem  *                Fecha:13/02/2022                     *
rem  *                Fecha:13/02/2022                     *
rem  *******************************************************
echo off
cls
echo Creando variables de entorno
set current=%cd%
set t=%current%\dist
cd %t%
echo Compiando el Compilando

@REM copy %current%\src\*.js %t%
@REM copy %current%\src\app\constants\*.* %t%\app\constants
@REM copy %current%\src\app\functions\*.* %t%\app\functions
@REM copy %current%\src\app\helpers\*.* %t%\app\helpers
@REM copy %current%\src\app\hooks\*.* %t%\src\app\hooks

@REM copy %current%\src\server\controllers\*.js %t%\server\controllers
@REM copy %current%\src\server\db\*.js %t%\server\db
@REM copy %current%\src\server\helpers\*.js %t%\server\helpers
@REM copy %current%\src\server\middlewares\*.js %t%\server\middlewares
@REM copy %current%\src\server\models\*.js %t%\server\models
@REM copy %current%\src\server\routes\*.js %t%\server\routes
@REM copy %current%\src\server\services\*.js %t%\server\services

xcopy %current%\src\server\public\contents %t%\server\public\contents /E
xcopy %current%\src\server\public\fonts %t%\server\public\fonts /E
xcopy %current%\src\server\public\images %t%\server\public\images /E
xcopy %current%\src\server\public\scripts %t%\server\public\scripts /E

copy %current%\src\server\public\*.* %t%\server\public
