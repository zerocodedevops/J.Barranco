$files = @(
"src/config/redis.ts",
"src/firebase/appCheck.ts",
"src/hooks/useDebounce.ts",
"src/hooks/useFirestoreCollection.ts",
"src/hooks/useFirestoreCollectionQuery.ts",
"src/hooks/useFirestoreDocument.ts",
"src/hooks/useQuickPlanner.ts",
"src/hooks/useRecentActivity.ts",
"src/services/storageService.d.ts",
"src/utils/pdfUtils.ts",
"src/utils/seedData.ts",
"src/components/admin/CmsPage.tsx",
"src/components/admin/DocumentsPage.tsx",
"src/components/admin/EmployeesPage.tsx",
"src/components/admin/InventoryPage.tsx",
"src/components/common/DataLoader.tsx",
"src/components/common/LazyImage.tsx",
"src/components/common/PDFButtons.tsx",
"src/components/employee/ServiceDetail.tsx",
"src/components/layout/Header.tsx",
"src/components/layout/SubHeader.tsx",
"src/components/pdf/FacturaPDF.tsx",
"src/components/pdf/PDFComponents.tsx",
"src/components/pdf/QuejasReportePDF.tsx",
"src/components/pdf/styles.d.ts",
"src/components/pdf/styles.ts",
"src/components/pdf/TrabajosReportePDF.tsx",
"src/components/admin/dashboard/JobsChart.tsx",
"src/components/admin/dashboard/StatusBox.tsx",
"src/components/admin/employees/EmployeeRoutesTab.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file"
    } else {
        Write-Host "Skipped (Not Found): $file"
    }
}
