# ARCHIOR INTERIOR DESIGN - Lightweight HTTP Server
param(
    [int]$Port = 8080,
    [string]$RootDirectory = "d:\MY PROJECT\portfolio\New folder"
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"

try {
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    Write-Host "HTTP Server listening on $prefix"
    Write-Host "Serving files from: $RootDirectory"
} catch {
    # If port is blocked, try 8085
    $Port = 8085
    $prefix = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    Write-Host "HTTP Server listening on $prefix"
    Write-Host "Serving files from: $RootDirectory"
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
}

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $localPath = $request.Url.LocalPath
            if ($localPath -eq "/" -or [string]::IsNullOrWhiteSpace($localPath)) {
                $localPath = "/index.html"
            }

            $sanitizedPath = $localPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar).TrimStart([System.IO.Path]::DirectorySeparatorChar)
            $filePath = [System.IO.Path]::Combine($RootDirectory, $sanitizedPath)

            if ([System.IO.File]::Exists($filePath)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $localPath")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
            $response.Close()
        } catch {
            Write-Warning "Request processing notice: $_"
            try { $response.Close() } catch {}
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
