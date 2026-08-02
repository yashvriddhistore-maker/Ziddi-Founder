Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ihdrg\.gemini\antigravity\brain\e28559f2-e54f-4d0f-bc7f-967a264d24f5\media__1785667484085.png"
$destPath = "h:\Antigravity\ziddifounder\daily_darshan\assets\daily\shiva_today.jpg"

$src = [System.Drawing.Image]::FromFile($srcPath)
$x = [int]($src.Width * 0.36)
$y = [int]($src.Height * 0.27)
$w = [int]($src.Width * 0.26)
$h = [int]($src.Height * 0.25)

$cropRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)

$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($src, $destRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$src.Dispose()

$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

Write-Host "✅ Successfully cropped official Mahakaleshwar photo!"
