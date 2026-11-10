$docxPath = "D:\Yogesh\Coding\CSP\docs\Final_doc\Gramin_Career_Setu_CSP_Report.docx"
$pdfPath  = "D:\Yogesh\Coding\CSP\docs\Final_doc\Gramin_Career_Setu_CSP_Report.pdf"

Write-Host "Input docx: $docxPath"
Write-Host "Output pdf: $pdfPath"

if (-not (Test-Path $docxPath)) {
    Write-Error "Input document not found: $docxPath"
    exit 1
}

Write-Host "Initializing Word.Application COM..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false

try {
    Write-Host "Opening document..."
    $doc = $word.Documents.Open($docxPath, $false, $true) # ReadOnly
    Write-Host "Exporting as PDF (wdFormatPDF = 17)..."
    # 17 = wdExportFormatPDF
    $doc.ExportAsFixedFormat($pdfPath, 17)
    $doc.Close([ref]$false)
    Write-Host "Conversion completed successfully!"
    if (Test-Path $pdfPath) {
        $info = Get-Item $pdfPath
        Write-Host "Generated PDF size: $($info.Length) bytes ($([math]::round($info.Length / 1MB, 2)) MB)"
    }
} catch {
    Write-Error "Failed during conversion: $_"
    exit 1
} finally {
    Write-Host "Quitting Word application..."
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
