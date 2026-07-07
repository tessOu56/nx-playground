# Detect host OS for dev scripts (Windows / Linux / macOS)

param(
  [switch]$Json
)

if ($IsWindows -or ($env:OS -match 'Windows')) {
  $platform = 'windows'
} elseif ($IsLinux) {
  $platform = 'linux'
} elseif ($IsMacOS) {
  $platform = 'darwin'
} else {
  $platform = 'unknown'
}

if ($Json) {
  @{ platform = $platform; ci = [bool]$env:CI } | ConvertTo-Json -Compress
} else {
  $platform
}
