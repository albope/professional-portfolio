param(
    [Parameter(Mandatory = $true)]
    [string]$PptxPath,

    [Parameter(Mandatory = $true)]
    [string]$PotxPath
)

$ErrorActionPreference = 'Stop'
$resolvedPptx = (Resolve-Path -LiteralPath $PptxPath).Path
$systemRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
if (-not $resolvedPptx.StartsWith($systemRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "El PPTX debe estar dentro del sistema de presentaciones: $resolvedPptx"
}

$potxParent = Split-Path -Parent $PotxPath
if (-not $potxParent) { $potxParent = (Get-Location).Path }
New-Item -ItemType Directory -Force -Path $potxParent | Out-Null
$resolvedPotx = Join-Path (Resolve-Path -LiteralPath $potxParent).Path (Split-Path -Leaf $PotxPath)
if (-not $resolvedPotx.StartsWith($systemRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "La plantilla debe guardarse dentro del sistema de presentaciones: $resolvedPotx"
}

$powerPoint = $null
$presentation = $null
try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    $powerPoint.DisplayAlerts = 1
    $presentation = $powerPoint.Presentations.Open($resolvedPptx, $false, $false, $false)
    $presentation.SaveAs($resolvedPotx, 26)
    Write-Output $resolvedPotx
}
finally {
    if ($presentation) { $presentation.Close() }
    if ($powerPoint) { $powerPoint.Quit() }
    if ($presentation) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) }
    if ($powerPoint) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
