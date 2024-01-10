import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { IUser } from '../types/user';
import { Button, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ICustomer } from '../types/customer';


interface IExportExcelProps {
    excelData: ICustomer[] | undefined;
    fileName: string;
}
const ExcelExportExportButton = ({ excelData, fileName }: IExportExcelProps) => {
    const fileType = "application/vnd.openxmlformats-officedocuments.spreadsheetml.sheet;charset=UTF-8"
    const fileExtension = ".xlsx"

    const exportToExcel = () => {
        if (excelData && excelData?.length > 0 ) {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { "data": ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "array" })
        FileSaver.saveAs(data, fileName + fileExtension)
        }
    }

    return (
        <>
            <Button variant="text" endIcon={<FileUploadIcon />} onClick={() => {exportToExcel()}}>
                <Typography fontWeight="500" style={{ color: 'black' }}>
                    Exporter
                </Typography>
            </Button>
        </>
    )
}

export default ExcelExportExportButton