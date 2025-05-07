Write-Host "Please choose an option:"
Write-Host "Type 1 to start the game"
Write-Host "Type 2 to copy the current bot to the previous bot folder"

$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
	Remove-Item -Path "out/production/bot_current/*" -Force
	Remove-Item -Path "out/production/bot_previous/*" -Force
	javac -d out/production/bot_current bot_current/src/*.java
	javac -d out/production/bot_previous bot_previous/src/*.java
	
	
	$allResults = @()
	$choice2 = [int](Read-Host "How many times do you want to run the game?")


	for ($i = 1; $i -le $choice2; $i++) {
		Write-Host "Running game $i..."

		$javaArgs = @(
			"-jar", "game.jar",
			"out/production/bot_current",
			"out/production/bot_current",
			"out/production/bot_previous",
			"out/production/bot_previous",
			"-g"
		)

		$gameOutput = & java @javaArgs
		$currentPlayer = $null

		foreach ($line in $gameOutput) {
			# Detect Player
			if ($line -match "^Player\s+(\d+)") {
				$currentPlayer = $matches[1]
			}

			# Detect reasonForDeath
			if ($line -match "^reasonForDeath:\s*(\w+)") {
				$deathReason = $matches[1]

				$allResults += [PSCustomObject]@{
					Game = $i
					Player = $currentPlayer
					ReasonForDeath = $deathReason
				}
			}
		}
	}

	# Export all results to CSV
	$csvPath = "game_results.csv"
	$allResults | Export-Csv $csvPath -NoTypeInformation
	Write-Host "Saved results to $csvPath"
	Import-Csv "game_results.csv" |
		Group-Object Player, ReasonForDeath |
		Select-Object @{Name="Player"; Expression={$_.Name.Split(',')[0]}},
					  @{Name="ReasonForDeath"; Expression={$_.Name.Split(',')[1]}},
					  Count |
		Sort-Object Player, ReasonForDeath


} elseif ($choice -eq "2") {
	Remove-Item -Path "bot_previous/src/*" -Force
	Copy-Item -Path "bot_current/src/*" -Destination "bot_previous/src/*"
} else {
    Write-Host "Invalid choice. Please enter 1 or 2."
}