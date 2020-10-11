package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.repository.DeliverRepository;
import ecma.demo.storeapplication.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    ReportService reportService;
    @Autowired
    DeliverRepository deliverRepository;

    @GetMapping
    public HttpEntity<?> getCurrent(@RequestParam(required = false) UUID productId,
            @RequestParam(required = false) String param, @RequestParam(required = false) String search,
            @RequestParam Integer page, @RequestParam Integer size) {
        return reportService.getCurrentProduct(param,productId, search, page, size);
    }

}
