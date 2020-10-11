package ecma.demo.storeapplication.service;

import ecma.demo.storeapplication.custom.CustomProductRemain;
import ecma.demo.storeapplication.repository.DeliverRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.NumberToTextConverter;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;


@Service
public class ExcelExporter {

    @Autowired
    DeliverRepository deliverRepository;

    public  ByteArrayInputStream exportProductsToExcel(List<CustomProductRemain> products) {


        try {
            Workbook workbook = new XSSFWorkbook();

            Sheet sheet = workbook.createSheet("Ombordagi qolqiq");

            Row row = sheet.createRow(0);

            Font headerFont = workbook.createFont();
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
            cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            cellStyle.setFont(headerFont);

            Cell cell = row.createCell(0);
            cell.setCellValue("Mahsulot nomi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(1);
            cell.setCellValue("Mahsulot nomiEn");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(2);
            cell.setCellValue("Miqdori");
            cell.setCellStyle(cellStyle);


            cell = row.createCell(3);
            cell.setCellValue("Yuan narxi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(4);
            cell.setCellValue("Kelib tushish narxi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(5);
            cell.setCellValue("Kelib tushish narxi boyicha summa");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(6);
            cell.setCellValue("Tan narxi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(7);
            cell.setCellValue("Bojxona narxi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(8);
            cell.setCellValue("Yolkira narxi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(9);
            cell.setCellValue("Boshqa xarajatlar");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(10);
            cell.setCellValue("Sotish narxi");
            cell.setCellStyle(cellStyle);

            cell = row.createCell(11);
            cell.setCellValue("Sotish narxi bo'yicha summa");
            cell.setCellStyle(cellStyle);

            for (int i = 0; i < products.size(); i++) {
                Row row1 = sheet.createRow(i + 1);
                row1.createCell(0).setCellValue(products.get(i).getUz_name());
                row1.createCell(1).setCellValue(products.get(i).getEn_name());
                row1.createCell(2).setCellValue(NumberToTextConverter.toText(products.get(i).getAmount()));
                row1.createCell(3).setCellValue(products.get(i).getJuan());
                row1.createCell(4).setCellValue(NumberToTextConverter.toText(products.get(i).getEnding_price())+" "+products.get(i).getCurrency());
                row1.createCell(5).setCellValue(NumberToTextConverter.toText(products.get(i).getAmount_ending_price())+" "+products.get(i).getCurrency());
                row1.createCell(6).setCellValue(NumberToTextConverter.toText(products.get(i).getPrice())+" "+products.get(i).getCurrency());
                row1.createCell(7).setCellValue(NumberToTextConverter.toText(products.get(i).getFare_cost())+" "+products.get(i).getCurrency());
                row1.createCell(8).setCellValue(NumberToTextConverter.toText(products.get(i).getCustom_cost())+" "+products.get(i).getCurrency());
                row1.createCell(9).setCellValue(NumberToTextConverter.toText(products.get(i).getOther_costs())+" "+products.get(i).getCurrency());
                row1.createCell(10).setCellValue(NumberToTextConverter.toText(products.get(i).getRetail_price())+" UZS");
                row1.createCell(11).setCellValue( NumberToTextConverter.toText(products.get(i).getAmount_retail_price())+" UZS");
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);
            sheet.autoSizeColumn(3);
            sheet.autoSizeColumn(4);
            sheet.autoSizeColumn(5);
            sheet.autoSizeColumn(6);
            sheet.autoSizeColumn(7);
            sheet.autoSizeColumn(8);
            sheet.autoSizeColumn(9);
            sheet.autoSizeColumn(10);
            sheet.autoSizeColumn(11);

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            workbook.write(byteArrayOutputStream);

            return new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }


    }
}
