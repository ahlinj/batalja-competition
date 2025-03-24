Write-Host "Please choose an option:"
Write-Host "Type 1 to start the game"
Write-Host "Type 2 to copy the current bot to the previous bot folder"

$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
	Remove-Item -Path "out/production/bot_current/*" -Force
	Remove-Item -Path "out/production/bot_previous/*" -Force
	javac -d out/production/bot_current bot_current/src/*.java
	javac -d out/production/bot_previous bot_previous/src/*.java
	java -jar game.jar out/production/bot_current out/production/bot_current out/production/bot_previous out/production/bot_previous
} elseif ($choice -eq "2") {
	Remove-Item -Path "bot_previous/src/*" -Force
	Copy-Item -Path "bot_current/src/*" -Destination "bot_previous/src/*"
} else {
    Write-Host "Invalid choice. Please enter 1 or 2."
}