package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqDeliverAll;
import ecma.demo.storeapplication.service.DeliverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/deliver")
public class DeliverController {
    @Autowired
    DeliverService deliverService;

    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqDeliverAll reqDeliverAll){
        return deliverService.save(reqDeliverAll);
    }

    @GetMapping("/history/{id}")
    public HttpEntity<?> getHistory(@PathVariable UUID id){
        return deliverService.getProductHistory(id);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> deleteDeliver(@PathVariable UUID id){
        return deliverService.deleteDeliver(id);
    }
}
