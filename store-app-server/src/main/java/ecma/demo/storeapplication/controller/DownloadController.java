package ecma.demo.storeapplication.controller;


import ecma.demo.storeapplication.repository.ProductRepository;
import ecma.demo.storeapplication.service.ExcelExporter;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;

@Controller
public class DownloadController {

    @Autowired
    ProductRepository productRepository;
    @Autowired
    ExcelExporter excelExporter;


    @GetMapping("/download/product.xlsx")
    public void downloadProductsWithExcelFormat (HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition","attachment; filename=product.xlsx");

        ByteArrayInputStream byteArrayInputStream = excelExporter.exportProductsToExcel(productRepository.getProductRemain("", 0, 10000));

        IOUtils.copy(byteArrayInputStream,response.getOutputStream());
    }
}
