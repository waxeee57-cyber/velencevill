$password = "VelenceVill2016"
$exp = [long]([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()) + 12*60*60*1000
$payloadJson = '{"exp":' + $exp + '}'
$payloadBytes = [System.Text.Encoding]::UTF8.GetBytes($payloadJson)
$payload = [Convert]::ToBase64String($payloadBytes) -replace '\+', '-' -replace '/', '_' -replace '=', ''
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($password)
$sigBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payload))
$sig = [Convert]::ToBase64String($sigBytes) -replace '\+', '-' -replace '/', '_' -replace '=', ''
$token = "$payload.$sig"
$headers = @{Authorization="Bearer $token"}
$result = Invoke-WebRequest -Uri "https://project-5h5vh.vercel.app/api/analytics" -Headers $headers -UseBasicParsing
$result.StatusCode
$result.Content