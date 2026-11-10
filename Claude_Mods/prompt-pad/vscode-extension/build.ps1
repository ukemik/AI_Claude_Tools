# Packs this folder into prompt-pad-sender-<version>.vsix (no npm/vsce needed) and installs it.
# Run from any folder:  powershell -File build.ps1 [-Profiles <name>,<name>]
param([string[]]$Profiles = @())
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

$here = $PSScriptRoot
$pkg = Get-Content -LiteralPath "$here\package.json" -Raw | ConvertFrom-Json
$vsix = Join-Path $here "$($pkg.name)-$($pkg.version).vsix"

$manifest = @"
<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Language="en-US" Id="$($pkg.name)" Version="$($pkg.version)" Publisher="$($pkg.publisher)" />
    <DisplayName>$($pkg.displayName)</DisplayName>
    <Description xml:space="preserve">$($pkg.description)</Description>
    <Categories>Other</Categories>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="$($pkg.engines.vscode)" />
    </Properties>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code" />
  </Installation>
  <Dependencies />
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
  </Assets>
</PackageManifest>
"@

$contentTypes = '<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension=".json" ContentType="application/json" /><Default Extension=".js" ContentType="application/javascript" /><Default Extension=".vsixmanifest" ContentType="text/xml" /></Types>'

if (Test-Path -LiteralPath $vsix) { Remove-Item -LiteralPath $vsix }
$zip = [System.IO.Compression.ZipFile]::Open($vsix, 'Create')
try {
    function Add-Text($name, $text) {
        $entry = $zip.CreateEntry($name)
        $writer = New-Object System.IO.StreamWriter($entry.Open(), (New-Object System.Text.UTF8Encoding($false)))
        $writer.Write($text); $writer.Dispose()
    }
    Add-Text '[Content_Types].xml' $contentTypes
    Add-Text 'extension.vsixmanifest' $manifest
    foreach ($file in 'package.json', 'extension.js', 'block.js', 'completion.js') {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, "$here\$file", "extension/$file") | Out-Null
    }
} finally { $zip.Dispose() }

# Install into the default profile, then into every VS Code profile named in -Profiles
# (for example: powershell -File build.ps1 -Profiles vscode_profile).
code --install-extension $vsix --force
foreach ($p in $Profiles) { code --install-extension $vsix --profile $p --force }
