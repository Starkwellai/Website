# Stages the ~244 MB subset of D:/Starkwell that api/serving_api.py actually
# reads into ./deploy/data, mirroring the same relative layout, so the
# Dockerfile's `COPY deploy/data ./data` + the ENV paths in the Dockerfile
# line up without editing serving_api.py's defaults.
#
# Run this from the repo root before `docker build`. Re-run after any
# monthly rebuild to refresh the deployed data.

$ErrorActionPreference = "Stop"
$Source = "D:/Starkwell/data"
$Dest = Join-Path $PSScriptRoot "data"

$Files = @(
    "serving/service_provider_prices.parquet",
    "serving/cash_by_service.parquet",
    "reference/facility_dim.parquet",
    "reference/facility_measures.parquet",
    "reference/hospital_dim.parquet",
    "reference/plan_design.parquet",
    "reference/plan_benefits.parquet",
    "reference/plan_network.parquet",
    "reference/shoppable_services.parquet",
    "reference/network_rates.parquet",
    "reference/nucc_taxonomy_251.csv",
    "providers.parquet"
)

foreach ($f in $Files) {
    $srcPath = Join-Path $Source $f
    $dstPath = Join-Path $Dest $f
    $dstDir = Split-Path $dstPath -Parent
    if (-not (Test-Path $dstDir)) {
        New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
    }
    if (-not (Test-Path $srcPath)) {
        Write-Warning "Missing source file, skipping: $srcPath"
        continue
    }
    Copy-Item -Path $srcPath -Destination $dstPath -Force
    Write-Host "Copied $f"
}

$totalMB = (Get-ChildItem -Path $Dest -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host ("Staged {0:N1} MB into {1}" -f $totalMB, $Dest)
