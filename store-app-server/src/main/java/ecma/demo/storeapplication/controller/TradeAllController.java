package ecma.demo.storeapplication.controller;

import ecma.demo.storeapplication.payload.ReqTradeAll;
import ecma.demo.storeapplication.service.TradeAllService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/tradeAll")
public class TradeAllController {
    @Autowired
    TradeAllService tradeAllService;
    
    @PostMapping
    public HttpEntity<?> save(@RequestBody ReqTradeAll reqTradeAll){
        return tradeAllService.save(reqTradeAll);
    }

    @GetMapping("/history")
    public HttpEntity<?> shoppingHistory(@RequestParam UUID client, @RequestParam String search, @RequestParam Integer size){
        return tradeAllService.shoppingHistory(client, search, size);
    }
}
