param(
    [Parameter(Mandatory = $false)]
    [string]$PptxPath = (Join-Path $PSScriptRoot 'output\Propuesta_BPM_Tech_Sistema_Propuestas_Comerciales_Ago2026.pptx'),

    [Parameter(Mandatory = $false)]
    [string]$PdfPath = (Join-Path $PSScriptRoot 'output\Propuesta_BPM_Tech_Sistema_Propuestas_Comerciales_Ago2026.pdf'),

    [Parameter(Mandatory = $false)]
    [string]$RenderDir = (Join-Path $PSScriptRoot 'output\rendered'),

    [Parameter(Mandatory = $false)]
    [string]$QaPath = (Join-Path $PSScriptRoot 'output\qa-report.json')
)

$ErrorActionPreference = 'Stop'
$fontLoaderSource = @'
using System;
using System.Runtime.InteropServices;
public static class BpmFontLoader {
    [DllImport("gdi32.dll", CharSet = CharSet.Unicode)]
    public static extern int AddFontResourceEx(string file, uint flags, IntPtr reserved);
}
'@
if (-not ('BpmFontLoader' -as [type])) { Add-Type -TypeDefinition $fontLoaderSource }
$fontDir = Join-Path $PSScriptRoot 'assets\fonts'
foreach ($fontFile in Get-ChildItem -LiteralPath $fontDir -Filter '*.ttf') {
    [void][BpmFontLoader]::AddFontResourceEx($fontFile.FullName, 0, [IntPtr]::Zero)
}

$resolvedPptx = (Resolve-Path -LiteralPath $PptxPath).Path
$outputRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot 'output')).Path
$resolvedRenderParent = (Resolve-Path -LiteralPath (Split-Path -Parent $RenderDir)).Path
if (-not $resolvedPptx.StartsWith((Resolve-Path -LiteralPath $PSScriptRoot).Path, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "El PPTX debe estar dentro del sistema de presentaciones: $resolvedPptx"
}
if (-not $resolvedRenderParent.StartsWith($outputRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "El directorio de render debe estar dentro de output: $RenderDir"
}

New-Item -ItemType Directory -Force -Path $RenderDir | Out-Null
Get-ChildItem -LiteralPath $RenderDir -File -ErrorAction SilentlyContinue | Remove-Item -Force
$resolvedRenderDir = (Resolve-Path -LiteralPath $RenderDir).Path
$pdfParent = Split-Path -Parent $PdfPath
if (-not $pdfParent) { $pdfParent = (Get-Location).Path }
New-Item -ItemType Directory -Force -Path $pdfParent | Out-Null
$resolvedPdfPath = Join-Path (Resolve-Path -LiteralPath $pdfParent).Path (Split-Path -Leaf $PdfPath)

$powerPoint = $null
$presentation = $null
$issues = [System.Collections.Generic.List[object]]::new()
try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    $powerPoint.DisplayAlerts = 1
    $presentation = $powerPoint.Presentations.Open($resolvedPptx, $true, $false, $false)

    foreach ($slide in $presentation.Slides) {
        foreach ($shape in $slide.Shapes) {
            if ($shape.HasTextFrame -eq -1 -and $shape.TextFrame2.HasText -eq -1) {
                $availableHeight = $shape.Height - $shape.TextFrame2.MarginTop - $shape.TextFrame2.MarginBottom
                $availableWidth = $shape.Width - $shape.TextFrame2.MarginLeft - $shape.TextFrame2.MarginRight
                $boundHeight = $shape.TextFrame2.TextRange.BoundHeight
                $boundWidth = $shape.TextFrame2.TextRange.BoundWidth
                $heightOverflow = [Math]::Round($boundHeight - $availableHeight, 2)
                $widthOverflow = [Math]::Round($boundWidth - $availableWidth, 2)
                if ($heightOverflow -gt 2 -or $widthOverflow -gt 2) {
                    $preview = ($shape.TextFrame2.TextRange.Text -replace "`r|`n", ' ').Trim()
                    if ($preview.Length -gt 80) { $preview = $preview.Substring(0, 80) + '…' }
                    $issues.Add([PSCustomObject]@{
                        slide = $slide.SlideIndex
                        shape = $shape.Name
                        text = $preview
                        height_overflow_pt = [Math]::Max(0, $heightOverflow)
                        width_overflow_pt = [Math]::Max(0, $widthOverflow)
                    })
                }
            }
        }
    }

    $presentation.Export($resolvedRenderDir, 'PNG', 1600, 900)
    $presentation.SaveAs($resolvedPdfPath, 32)

    $fontNames = @()
    foreach ($font in $presentation.Fonts) { $fontNames += $font.Name }
    $manifest = [PSCustomObject]@{
        generated_at = (Get-Date).ToString('s')
        pptx = $resolvedPptx
        pdf = (Resolve-Path -LiteralPath $resolvedPdfPath).Path
        slides = $presentation.Slides.Count
        size = '16:9'
        width_in = [Math]::Round($presentation.PageSetup.SlideWidth / 72, 3)
        height_in = [Math]::Round($presentation.PageSetup.SlideHeight / 72, 3)
        fonts = $fontNames | Sort-Object -Unique
        text_overflow_issues = $issues
    }
    $qaParent = Split-Path -Parent $QaPath
    if ($qaParent) { New-Item -ItemType Directory -Force -Path $qaParent | Out-Null }
    $manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $QaPath -Encoding utf8
    Write-Output ($manifest | ConvertTo-Json -Depth 6)
}
finally {
    if ($presentation) { $presentation.Close() }
    if ($powerPoint) { $powerPoint.Quit() }
    if ($presentation) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) }
    if ($powerPoint) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
