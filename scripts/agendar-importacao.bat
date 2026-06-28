@echo off
echo Registrando tarefa agendada no Windows...
schtasks /create /tn "ViralForge - Importar Kalodata" /tr "npx ts-node \"%~dp0importar-kalodata.ts\"" /sc daily /st 08:00
echo Tarefa agendada com sucesso para todos os dias as 08:00.
pause
