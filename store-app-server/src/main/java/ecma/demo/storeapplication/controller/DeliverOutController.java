package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqDeliverOut;
import ecma.demo.storeapplication.service.DeliverOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/deliverOut")
public class DeliverOutController {
    @Autowired
    DeliverOutService deliverOutService;

    @PostMapping
    HttpEntity<?> save(@RequestBody ReqDeliverOut reqDeliverOut){
        return deliverOutService.save(reqDeliverOut);
    }

    @GetMapping("/history/{id}")
    public HttpEntity<?> getHistory(@PathVariable UUID id){
        return deliverOutService.getProductHistory(id);
    }
}
